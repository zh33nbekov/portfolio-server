const User = require('../models/user.model');
const UserService = require('../services/user.service');

class UserController {
	async getUserProfile(req, res, next) {
		try {
			const { id } = req.params;
			const user = await UserService.getUserProfile(id);
			res.json(user);
		} catch (error) {
			// console.log(error);
		}
	}
	async removeOneUser(req, res, next) {
		try {
			const { id } = req.params;
			if (!id) {
				res.json({ message: 'Something went wrong((' });
			}
			const removedUser = await User.findByIdAndDelete(id);
			res.json(removedUser);
		} catch (error) {
			res.status(500).json(error.message);
		}
	}
	async removeAllUsers(req, res, next) {
		try {
			await User.deleteMany({});
			res.status(200).json({ message: 'Все заметки успешно удалены' });
		} catch (error) {
			res.status(500).json({ error: 'Внутренняя ошибка сервера' });
		}
	}
	async fetchAllUsers(req, res, next) {
		try {
			const users = await UserService.fetchAllUsers();
			res.json(users);
		} catch (error) {
			// console.log(error);
		}
	}
}

module.exports = new UserController();