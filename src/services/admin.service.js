const UserDto = require('../dto/user.dto')
const ApiError = require('../exceptions/api.error.exception')
const Admin = require('../models/admin.model')

class AdminService {
	async getAdminProfile(id) {
		try {
			const admin = await Admin.findById(id)
			if (!admin) {
				throw ApiError.badRequest(400, 'Пользователь не найден')
			}
			const userDto = new UserDto(admin)
			return userDto
		} catch (error) {
			console.log(error)
		}
	}
	async fetchAdmins() {
		const admins = await Admin.find()
		return admins
	}
}
module.exports = new AdminService()
