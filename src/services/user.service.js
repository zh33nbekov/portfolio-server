const ApiError = require('../exceptions/api.error.exception');
const User = require('../models/user.model');

class UserService {
	async getUserProfile(id) {
		try {
			const user = await User.findById(id);
			if (!user) {
				throw ApiError(400, 'Пользователь не найден');
			}
			return user;
		} catch (error) {
			// console.log(error)
		}
	}
	async fetchAllUsers() {
		const users = await User.find();
		return users;
	}
}
module.exports = new UserService();
