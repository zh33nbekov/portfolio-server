const setCookie = require('../helpers/setCookie')
const AuthService = require('../services/auth.service')

class AuthController {
	async signup(req, res, next) {
		try {
			const { fullName, email, password } = req.body
			const adminData = await AuthService.signup(fullName, email, password)
			setCookie(res, 'accessToken', adminData.accessToken, {
				maxAge: 15 * 60 * 1000,
				httpOnly: false,
			})
			setCookie(res, 'refreshToken', adminData.refreshToken)
			setCookie(res, 'admin-id', adminData.admin.id)
			res.json({ ...adminData.admin, info: 'Вы вошли в систему' })
		} catch (error) {
			next(error)
		}
	}
	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const adminData = await AuthService.login(email, password)
			setCookie(res, 'accessToken', adminData.accessToken, {
				maxAge: 15 * 60 * 1000,
				httpOnly: false,
			})
			setCookie(res, 'refreshToken', adminData.refreshToken)
			setCookie(res, 'admin-id', adminData.admin.id)
			res.json({ admin: adminData.admin, info: 'Вы вошли в систему' })
		} catch (error) {
			console.log(error)
			next(error)
		}
	}
	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const tokenData = await AuthService.logout(refreshToken)
			res.clearCookie('refreshToken', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			res.clearCookie('accessToken', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			res.status(200).json({
				message: 'Вы вышли из системы',
				data: tokenData,
			})
		} catch (error) {
			next(error)
		}
	}
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const adminData = await AuthService.refresh(refreshToken)
			res.cookie('refreshToken', adminData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			res.cookie('accessToken', adminData.accessToken, {
				maxAge: 15 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			})
			res.json(adminData.admin)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new AuthController()
