const { default: mongoose } = require('mongoose')

const connectToMongo = async () => {
	const DB_URI = process.env.MONGO_URI || ''
	await mongoose.connect(DB_URI)
}

module.exports = connectToMongo
