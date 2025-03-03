const Admin = require('../models/admin.model')
const bcrypt = require('bcrypt')
const TokenService = require('./token.service')
const AdminDto = require('../dto/user.dto')
const ApiError = require('../exceptions/api.error.exception')

class AuthService {
	async signup(fullName, email, password) {
		const admin = await Admin.findOne({ email })
		if (admin) {
			throw ApiError.badRequest(`${email} уже существует`)
		}
		const hashPassword = await bcrypt.hash(password, 3)
		const newAdmin = await Admin.create({
			fullName,
			email,
			password: hashPassword,
		})
		const adminDto = new AdminDto(newAdmin)
		const tokens = TokenService.generateTokens({ ...adminDto })
		await TokenService.saveRefreshToken(adminDto.id, tokens.refreshToken)
		return {
			...tokens,
			admin: adminDto,
		}
	}
	async login(email, password) {
		const admin = await Admin.findOne({ email })
		if (!admin) {
			throw ApiError.badRequest(`Пользователь ${email} не существует`)
		}
		const isValidPassword = await bcrypt.compare(password, admin.password)
		if (!isValidPassword || !admin) {
			throw ApiError.badRequest('Неверный логин или пароль')
		}
		const adminDto = new AdminDto(admin)
		const tokens = TokenService.generateTokens({ ...adminDto })
		await TokenService.saveRefreshToken(adminDto.id, tokens.refreshToken)
		return {
			...tokens,
			admin: adminDto,
		}
	}
	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.unAuthorizedError()
		}
		const token = TokenService.validateRefreshToken(refreshToken)
		const tokenFromDB = TokenService.checkToken(refreshToken)
		if (!token || !tokenFromDB) {
			throw ApiError.unAuthorizedError()
		}
		const admin = await Admin.findById(token.id)
		const adminDto = new AdminDto(admin)
		const tokens = TokenService.generateTokens({ ...adminDto })
		await TokenService.saveRefreshToken(adminDto.id, tokens.refreshToken)
		return {
			...tokens,
			admin: adminDto,
		}
	}
	async logout(refreshToken) {
		const tokenData = await TokenService.removeToken(refreshToken)
		if (!tokenData) {
			throw ApiError.badRequest('Токен не найден')
		}
		return tokenData
	}
}

module.exports = new AuthService()
