require('dotenv').config()
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const AuthRouter = require('./routes/auth.route')
const ErrorMiddleware = require('./middlewares/error.middleware')
const GreetingRouter = require('./routes/greeting.route')
const AboutRouter = require('./routes/about.route')
const AdminRouter = require('./routes/admin.route')
const MessageRouter = require('./routes/feedback.route')
const ContactRouter = require('./routes/contact.route')
const { setupWebSocket } = require('./websocket/websocket')
const http = require('http')
const connectToMongo = require('./lib/mongoDB')
const getCorsOptions = require('./lib/getCorsOptions')

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(cookieParser())
app.use(cors(getCorsOptions()))

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
	try {
		await connectToMongo()
		server.listen(PORT, () => console.log('Сервер запущен на порту ' + PORT))
	} catch (error) {
		console.log(error, 'error')
	}
}

startServer()
