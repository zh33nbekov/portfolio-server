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

const storage = multer.memoryStorage()
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
})

const uploadToS3 = async (file) => {
	try {
		const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`

		const fileStream = Readable.from(file.buffer)

		const uploadParams = {
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: fileStream,
			ContentType: file.mimetype,
		}

		const uploader = new Upload({
			client: s3,
			params: uploadParams,
		})

		const result = await uploader.done()
		return result.Location
	} catch (error) {
		console.log('Ошибка загрузки на S3:', error)
		throw new Error('Не удалось загрузить файл на S3')
	}
}

module.exports = { upload, uploadToS3 }
