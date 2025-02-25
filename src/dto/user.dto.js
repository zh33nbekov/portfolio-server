module.exports = class UserDto {
	fullName;
	email;
	id;
	role;

	constructor(model) {
		this.fullName = model.fullName;
		this.email = model.email;
		this.id = model._id.toString();
		this.role = model.role;
	}
};
