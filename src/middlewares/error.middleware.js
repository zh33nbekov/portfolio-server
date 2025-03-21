const ApiError = require('../exceptions/api.error.exception')

const ErrorMiddleware = (err, req, res, next) => {
	if (err instanceof ApiError) {
		return res.status(err.status).json({ message: err.message, errors: err.errors })
	}
	return res.status(500).json({ message: 'Ошибка сервера' })
}
module.exports = ErrorMiddleware
