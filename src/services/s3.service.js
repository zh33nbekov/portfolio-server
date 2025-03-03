const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const { Upload } = require('@aws-sdk/lib-storage')
const { Readable } = require('stream')
const crypto = require('crypto')

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
})

// Настроим multer (без multer-s3)
const storage = multer.memoryStorage()
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

// Функция загрузки файла в S3
const uploadToS3 = async (file) => {
	try {
		// Генерируем уникальное имя файла
		const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`

		// Создаем поток из буфера файла
		const fileStream = Readable.from(file.buffer)

		// Параметры для загрузки в S3
		const uploadParams = {
			Bucket: process.env.AWS_S3_BUCKET_NAME, // Имя вашего бакета
			Key: fileName, // Путь и имя файла в S3
			Body: fileStream, // Тело запроса (поток файла)
			ContentType: file.mimetype, // Тип контента
			// ACL: 'public-read',
		}

		// Загрузка файла
		const uploader = new Upload({
			client: s3, // S3 клиент
			params: uploadParams, // Параметры загрузки
		})

		// Ожидаем завершения загрузки и получаем результат
		const result = await uploader.done()

		// Возвращаем URL загруженного файла
		return result.Location
	} catch (error) {
		// Обработка ошибок
		console.log('Ошибка загрузки на S3:', error)
		throw new Error('Не удалось загрузить файл на S3')
	}
}

module.exports = { upload, uploadToS3 }
