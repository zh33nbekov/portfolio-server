const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token.model')

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_TOKEN_KEY,
			{ expiresIn: '1m' }
		)
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_TOKEN_KEY,
			{ expiresIn: '30d' }
		)
		return {
			accessToken,
			refreshToken,
		}
	}
	async saveRefreshToken(userID, refreshToken) {
		const tokenData = await TokenModel.findOne({ user: userID })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}
		const newToken = await TokenModel.create({
			user: userID,
			refreshToken,
		})
		return newToken
	}
	validateAccessToken(accessToken) {
		try {
			const tokenData = jwt.verify(
				accessToken,
				process.env.JWT_ACCESS_TOKEN_KEY
			)
			return tokenData
		} catch (error) {
			return null
		}
	}
	validateRefreshToken(refreshToken) {
		try {
			const tokenData = jwt.verify(
				refreshToken,
				process.env.JWT_REFRESH_TOKEN_KEY
			)
			return tokenData
		} catch (error) {
			return null
		}
	}
	async checkToken(refreshToken) {
		const tokenData = await TokenModel.findOne({ refreshToken })
		return tokenData
	}
	async removeToken(refreshToken) {
		const tokenData = await TokenModel.deleteOne({ refreshToken })
		return tokenData
	}
}

module.exports = new TokenService()
