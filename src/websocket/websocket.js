// apps/server/socket.js
const socketIo = require('socket.io')

let connectedClients = []

function setupWebSocket(server) {
	const io = socketIo(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	})

	io.on('connection', (socket) => {
		console.log('New client connected:', socket.id)

		// Обработка регистрации клиента
		socket.on('register', (userData) => {
			const newClient = {
				id: socket.id,
				name: userData.name,
				isAdmin: userData.isAdmin || false,
				connected: true,
			}

			// Если клиент - админ
			if (userData.isAdmin) {
				// Отправляем список всех клиентов админу
				socket.emit(
					'clientsList',
					connectedClients.filter((client) => !client.isAdmin)
				)
			} else {
				// Добавляем клиента в список
				connectedClients.push(newClient)

				// Уведомляем админа о новом клиенте
				io.emit('newClient', newClient)
			}

			// Подтверждаем регистрацию
			socket.emit('registered', { success: true, id: socket.id })
			console.log(
				`Client registered: ${userData.name} (${socket.id}), isAdmin: ${userData.isAdmin}`
			)
		})

		// Обработка сообщений
		socket.on('message', (messageData) => {
			console.log('New message:', messageData)

			if (messageData.isAdmin) {
				// Если отправитель - админ, отправляем сообщение конкретному клиенту
				io.to(messageData.to).emit('message', {
					id: Date.now(),
					text: messageData.text,
					from: 'admin',
					to: messageData.to,
					timestamp: new Date().toISOString(),
				})
			} else {
				// Если отправитель - клиент, отправляем сообщение админу
				io.emit('clientMessage', {
					id: Date.now(),
					text: messageData.text,
					from: socket.id,
					fromName: messageData.fromName,
					timestamp: new Date().toISOString(),
				})
			}
		})

		// Обработка отключения клиента
		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id)

			// Находим и обновляем статус клиента
			const clientIndex = connectedClients.findIndex((client) => client.id === socket.id)
			if (clientIndex !== -1) {
				connectedClients[clientIndex].connected = false

				// Уведомляем админа об отключении клиента
				io.emit('clientDisconnected', { id: socket.id })

				// Через некоторое время удаляем клиента из списка
				setTimeout(
					() => {
						connectedClients = connectedClients.filter((client) => client.id !== socket.id)
						io.emit('clientRemoved', { id: socket.id })
					},
					5 * 60 * 1000
				) // 5 минут
			}
		})

		// Обработка выбора клиента админом
		socket.on('selectClient', (clientId) => {
			console.log('Admin selected client:', clientId)
			socket.emit('clientSelected', { id: clientId })
		})
	})

	return io
}

module.exports = { setupWebSocket }
