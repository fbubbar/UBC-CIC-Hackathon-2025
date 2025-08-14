import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFile, readdir } from 'fs/promises'
import { resolve } from 'path'
import { config } from 'dotenv'
import * as process from 'process'
import { fileTypeFromBuffer } from 'file-type'

// Load environment variables
config()

async function uploadFilesToS3() {
  try {
    // Path to the ONet_Output directory
    const directoryPath = resolve(__dirname, '../data/ONet_Output');
    
    // Extract bucket name from outputs
    const bucketName = process.env.BUCKET_NAME
    console.log(`Using S3 bucket: ${bucketName}`);
    
    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-west-2',
    });

    // Get all files in the directory
    const files = await readdir(directoryPath);
    console.log(`Found ${files.length} files to upload`);

    // Upload each file
    for (const file of files) {
      const filePath = resolve(directoryPath, file);
      const fileContent = await readFile(filePath);
      
      // Determine content type (default to text/plain for .txt files)
      let contentType = 'text/plain';
      if (!file.endsWith('.txt')) {
        const fileTypeResult = await fileTypeFromBuffer(fileContent);
        contentType = fileTypeResult?.mime || 'application/octet-stream';
      }
      
      const params = {
        Bucket: bucketName,
        Key: `ONet_Output/${file}`,
        Body: fileContent,
        ContentType: contentType,
      };

      try {
        await s3Client.send(new PutObjectCommand(params));
        console.log(`Successfully uploaded ${file}`);
      } catch (uploadErr) {
        console.error(`Error uploading ${file}:`, uploadErr);
      }
    }

    console.log('All files uploaded successfully!');
  } catch (err) {
    console.error('Error in upload process:', err);
  }
}

uploadFilesToS3();
