import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bucket information from amplify outputs
const BUCKET_NAME = 'polaris-kb-bucket';

// Initialize S3 client
const s3Client = new S3Client({ region: 'us-west-2' });

// Directory containing the ONet Output files
const ONET_OUTPUT_DIR = path.join(__dirname, '../data/ONet_Output');

// Function to create and upload metadata files
async function createAndUploadMetadata() {
  try {
    // Read all files in the ONet_Output directory
    const files = fs.readdirSync(ONET_OUTPUT_DIR);
    
    console.log(`Found ${files.length} files in ONet_Output directory`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      if (!file.endsWith('.txt')) continue; // Only process text files
      
      const filePath = path.join(ONET_OUTPUT_DIR, file);
      const fileKey = `ONet_Output/${file}`;
      
      // Create barebones metadata JSON
      const title = file.split('_').slice(0, -1).join(' ')
      const metadata = {
        "metadataAttributes": {
          "job_category": title,
          "source": "ONet",
          "file_type": "text",
        }
      };
      
      const metadataJson = JSON.stringify(metadata, null, 2);
      const metadataFileName = `${file}.metadata.json`;
      const metadataFilePath = path.join(ONET_OUTPUT_DIR, metadataFileName);
      const metadataKey = `ONet_Output/${metadataFileName}`;
      
      // Write metadata file locally first
      fs.writeFileSync(metadataFilePath, metadataJson);
      console.log(`Created local metadata file: ${metadataFileName}`);
      
      try {
        // Upload metadata file to S3
        const uploadCommand = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: metadataKey,
          Body: metadataJson,
          ContentType: 'application/json'
        });
        
        await s3Client.send(uploadCommand);
        console.log(`Uploaded metadata file to S3: ${metadataKey}`);
        successCount++;
      } catch (error) {
        console.error(`Error uploading metadata file ${metadataFileName}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Metadata file creation complete. Success: ${successCount}, Errors: ${errorCount}`);
  } catch (error) {
    console.error('Error processing files:', error);
    process.exit(1);
  }
}

// Main execution
await createAndUploadMetadata();
