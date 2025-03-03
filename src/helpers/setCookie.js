const setCookie = (res, name, value, options = {}) => {
	res.cookie(name, value, {
		maxAge: options.maxAge || 30 * 24 * 60 * 60 * 1000, // По умолчанию 30 дней
		httpOnly: options.httpOnly !== false, // По умолчанию true
		sameSite: options.sameSite || 'None',
		secure: options.secure !== false, // По умолчанию true
		...options, // Позволяет переопределить любые параметры
	})
}

module.exports = setCookie
