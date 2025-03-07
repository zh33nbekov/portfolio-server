require('dotenv').config()
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const AuthRouter = require('./routers/auth.router')
const { default: mongoose } = require('mongoose')
const ErrorMiddleware = require('./middlewares/error.middleware')
const GreetingRouter = require('./routers/greeting.router')
const AboutRouter = require('./routers/about.router')
const AdminRouter = require('./routers/admin.router')
const MessageRouter = require('./routers/feedback.router')
const ContactRouter = require('./routers/contact.router')
const { setupWebSocket } = require('./websocket/websocket')
const http = require('http')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:3001'],
		credentials: true,
	})
)

app.use('/api/v1', AdminRouter)
app.use('/api/v1', AboutRouter)
app.use('/api/v1', MessageRouter)
app.use('/api/v1', ContactRouter)
app.use('/api/v1', GreetingRouter)
app.use('/api/v1/auth', AuthRouter)

app.use(ErrorMiddleware)

// Подключаем WebSocket
// setupWebSocket(server)

const startServer = async () => {
	const PORT = process.env.PORT || 5500
	const DB_URI = process.env.MONGO_URI || ''
	try {
		await mongoose.connect(DB_URI)
		server.listen(PORT, () => console.log('🚀 Server started on port ' + PORT))
	} catch (err) {
		console.log(err, 'error')
	}
}

startServer()
