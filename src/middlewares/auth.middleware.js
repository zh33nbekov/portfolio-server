const ApiError = require('../exceptions/api.error.exception')
const TokenService = require('../services/token.service')

module.exports = function (req, res, next) {
	try {
		const accessToken = req.cookies.accessToken
		if (!accessToken) {
			return next(ApiError.unAuthorizedError())
		}
		const isValidAccessToken = TokenService.validateAccessToken(accessToken)

		if (!isValidAccessToken) {
			return next(ApiError.unAuthorizedError())
		}
		req.user = isValidAccessToken
		next()
	} catch (error) {
		console.log(error)
		return next(ApiError.unAuthorizedError())
	}
}
