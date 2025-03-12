require('dotenv').config()
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const AuthRouter = require('./routes/auth.route')
const { default: mongoose } = require('mongoose')
const ErrorMiddleware = require('./middlewares/error.middleware')
const GreetingRouter = require('./routes/greeting.route')
const AboutRouter = require('./routes/about.route')
const AdminRouter = require('./routes/admin.route')
const MessageRouter = require('./routes/feedback.route')
const ContactRouter = require('./routes/contact.route')
const { setupWebSocket } = require('./websocket/websocket')
const http = require('http')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: [
			process.env.LOCAL_CLIENT_URL,
			process.env.LOCAL_ADMIN_URL,
			process.env.PUBLIC_CLIENT_URL,
			process.env.PUBLIC_ADMIN_URL,
		],
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

setupWebSocket(server)

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
