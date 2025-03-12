const { Server } = require('socket.io')

const users = {} // { socketId: { name, id } }
const messages = {} // { userId: [{ sender, message }] }

const setupWebSocket = (server) => {
	const io = new Server(server, {
		cors: { origin: '*' },
	})

	io.on('connection', (socket) => {
		console.log(`User connected: ${socket.id}`)

		socket.on('user_join', (name) => {
			users[socket.id] = { name, id: socket.id }
			if (!messages[socket.id]) messages[socket.id] = []
			io.emit('update_users', Object.values(users))
		})

		socket.on('send_message', ({ sender, message }) => {
			const userId = socket.id
			messages[userId].push({ sender, message })
			io.emit('receive_message', { sender, message, userId })
		})

		socket.on('admin_reply', ({ userId, message }) => {
			if (users[userId]) {
				messages[userId].push({ sender: 'Admin', message })
				io.to(userId).emit('receive_message', { sender: 'Admin', message, userId })
			}
		})

		socket.on('disconnect', () => {
			delete users[socket.id]
			io.emit('update_users', Object.values(users))
		})
	})
}

module.exports = { setupWebSocket }
