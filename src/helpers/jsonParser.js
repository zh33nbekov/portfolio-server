const jsonParser = (body) => {
	const parsedBody = {}

	for (const key in body) {
		if (Object.prototype.hasOwnProperty.call(body, key)) {
			try {
				parsedBody[key] = JSON.parse(body[key])
			} catch (error) {
				parsedBody[key] = body[key]
				console.log(error)
			}
		}
	}

	return parsedBody
}

module.exports = jsonParser
