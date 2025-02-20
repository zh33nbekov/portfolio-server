const AuthService = require('../services/auth.service');

class AuthController {
	async signup(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await AuthService.signup(email, password);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res.cookie('accessToken', userData.accessToken, {
				maxAge: 15 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res.json({ ...userData.user, info: 'Вы успешно вошли в систему' });
		} catch (error) {
			next(error);
		}
	}
	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await AuthService.login(email, password);
			res.cookie('accessToken', userData.accessToken, {
				maxAge: 15 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
				path: '/',
			});
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
				path: '/',
			});
			res.json({ ...userData.user, info: 'Вы успешно вошли в систему' });
		} catch (error) {
			next(error);
		}
	}
	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const tokenData = await AuthService.logout(refreshToken);
			res.clearCookie('refreshToken', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res.clearCookie('accessToken', {
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res.status(200).json({
				message: 'Вы успешно вышли из системы',
				data: tokenData,
			});
		} catch (error) {
			next(error);
		}
	}
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await AuthService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res.cookie('accessToken', userData.accessToken, {
				maxAge: 15 * 60 * 1000,
				httpOnly: true,
				sameSite: 'None',
				secure: true,
			});
			res.json(userData.user);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new AuthController();
