const getCorsOptions = () => {
	return {
		origin: [
			process.env.LOCAL_CLIENT_URL,
			process.env.LOCAL_ADMIN_URL,
			process.env.PUBLIC_CLIENT_URL,
			process.env.PUBLIC_ADMIN_URL,
		],
		credentials: true,
	}
}

module.exports = getCorsOptions
