const { Server } = require('socket.io')

/**
 * @param {import("http").Server} server
 */

const setupWebSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: ['http://localhost:3000', 'http://localhost:3001'],
			credentials: true,
		},
	})

	let adminSocket = null // для отслеживания подключения только одного администратора
	let clientSockets = {} // для хранения клиентов

	io.on('connection', (socket) => {
		// Определяем роль клиента
		const { role } = socket.handshake.query
		if (role === 'client') {
			// Клиент создаёт свою уникальную комнату (по socket.id)
			socket.join(socket.id)
			clientSockets[socket.id] = socket
			console.log(`👤 Клиент ${socket.id} присоединился.`)
		} else if (role === 'admin') {
			// Админ подключается
			if (adminSocket) {
				socket.emit('adminError', 'Только один администратор может быть подключен')
				socket.disconnect()
			} else {
				adminSocket = socket
				socket.join('admins')
				console.log(`🛠 Админ ${socket.id} подключился.`)
			}
		}

		// Клиент отправляет сообщение → только в его комнату
		socket.on('clientMessage', (message) => {
			console.log(`📩 Клиент ${socket.id} отправил сообщение:`, message)
			io.to('admins').emit('adminReceive', { clientId: socket.id, message })
		})

		// Админ отправляет ответ клиенту (только в его комнату)
		socket.on('adminResponse', ({ clientId, response }) => {
			console.log(`📨 Админ отправил клиенту ${clientId}:`, response)
			io.to(clientId).emit('clientReceive', response)
		})

		// Индикатор набора текста
		socket.on('typing', () => {
			if (role === 'admin' && adminSocket === socket) {
				io.emit('adminTyping')
			} else if (role === 'client') {
				io.to('admins').emit('userTyping', {
					clientId: socket.id,
					role: 'client',
				})
			}
		})

		socket.on('stopTyping', () => {
			if (role === 'admin' && adminSocket === socket) {
				io.emit('adminStopTyping')
			} else if (role === 'client') {
				io.to('admins').emit('userStoppedTyping', { clientId: socket.id })
			}
		})

		// Отключение клиента
		socket.on('disconnect', () => {
			if (role === 'client') {
				delete clientSockets[socket.id]
			} else if (role === 'admin') {
				adminSocket = null
			}
			console.log(`❌ Клиент отключен: ${socket.id}`)
		})
	})
}

module.exports = { setupWebSocket }
