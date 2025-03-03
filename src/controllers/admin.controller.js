const AdminService = require('../services/admin.service')

class AdminController {
	async getAdminProfile(req, res, next) {
		try {
			const id = req.cookies['admin-id']
			const admin = await AdminService.getAdminProfile(id)
			res.json(admin)
		} catch (error) {
			next()
			console.log(error)
		}
	}
	async removeAdmin(req, res, next) {
		try {
			const { id } = req.params
			await AdminService.removeAdmin(id)
			res.json({ info: 'Success' })
		} catch (error) {
			next()
			console.log(error)
		}
	}
	async removeAdmins(req, res, next) {
		try {
			await AdminService.removeAdmins()
			res.json({ info: 'Success' })
		} catch (error) {
			next()
			console.log(error)
		}
	}
	async fetchAdmins(req, res, next) {
		try {
			const admins = await AdminService.fetchAdmins()
			res.json({ admins })
		} catch (error) {
			next()
			console.log(error)
		}
	}
}

module.exports = new AdminController()
