import { v2 as cloudinary } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ''
const apiKey = process.env.CLOUDINARY_API_KEY || ''
const apiSecret = process.env.CLOUDINARY_API_SECRET || ''
const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'gimnasiocarrie'

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret)

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })
}

export async function uploadImageBuffer(buffer, options = {}) {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary no está configurado en el servidor.')
  }

  const folder = options.folder || uploadFolder

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    )

    stream.end(buffer)
  })
}
