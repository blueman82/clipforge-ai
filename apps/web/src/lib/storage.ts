import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs'
import path from 'path'

// S3 client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'clipforge-storage'

export interface UploadResult {
  url: string
  key: string
  bucket: string
}

/**
 * Upload file to S3 bucket
 */
export async function uploadToS3(filePath: string, key: string): Promise<string> {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const fileContent = fs.readFileSync(filePath)
    const contentType = getContentType(filePath)

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read', // Make files publicly accessible
    })

    await s3Client.send(command)

    // Return public URL
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
  } catch (error) {
    console.error('S3 upload error:', error)
    throw new Error(`Failed to upload file to S3: ${error}`)
  }
}

/**
 * Generate signed URL for temporary access
 */
export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error('S3 signed URL error:', error)
    throw new Error(`Failed to generate signed URL: ${error}`)
  }
}

/**
 * Upload file with progress tracking
 */
export async function uploadWithProgress(
  filePath: string,
  key: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // For now, use basic upload - in production you'd use multipart upload for large files
    if (onProgress) onProgress(0)
    
    const url = await uploadToS3(filePath, key)
    
    if (onProgress) onProgress(100)
    return url
  } catch (error) {
    console.error('Upload with progress error:', error)
    throw error
  }
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('S3 delete error:', error)
    throw new Error(`Failed to delete file from S3: ${error}`)
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  
  const contentTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.aac': 'audio/aac',
    '.json': 'application/json',
    '.txt': 'text/plain',
  }

  return contentTypes[ext] || 'application/octet-stream'
}

/**
 * Generate upload URL for client-side uploads
 */
export async function generateUploadUrl(key: string, contentType: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error('Generate upload URL error:', error)
    throw new Error(`Failed to generate upload URL: ${error}`)
  }
}

/**
 * Check if file exists in S3
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Copy file within S3
 */
export async function copyFile(sourceKey: string, destinationKey: string): Promise<void> {
  try {
    const { CopyObjectCommand } = await import('@aws-sdk/client-s3')
    const command = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error('S3 copy error:', error)
    throw new Error(`Failed to copy file in S3: ${error}`)
  }
}