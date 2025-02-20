const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const TokenService = require('./token.service');
const UserDto = require('../dto/user.dto');
const ApiError = require('../exceptions/api.error.exception');

class AuthService {
	async signup(email, password) {
		const oldUser = await User.findOne({ email });
		if (oldUser) {
			throw ApiError.badRequest(`${email} уже существует`);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const newUser = await User.create({
			email,
			password: hashPassword,
		});
		const userDto = new UserDto(newUser);
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}
	async login(email, password) {
		const user = await User.findOne({ email });
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword || !user) {
			throw ApiError.badRequest('Неверный логин или пароль');
		}
		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}
	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.unAuthorizedError();
		}
		const token = TokenService.validateRefreshToken(refreshToken);
		const tokenFromDB = TokenService.checkToken(refreshToken);
		if (!token || !tokenFromDB) {
			throw ApiError.unAuthorizedError();
		}
		const user = await User.findById(token.id);
		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}
	async logout(refreshToken) {
		const tokenData = await TokenService.removeToken(refreshToken);
		if (!tokenData) {
			throw ApiError.badRequest('Токен не найден');
		}
		return tokenData;
	}
}

module.exports = new AuthService();
