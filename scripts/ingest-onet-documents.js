import { BedrockAgentClient, IngestKnowledgeBaseDocumentsCommand } from "@aws-sdk/client-bedrock-agent"
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { config } from 'dotenv';

config()

const bucketName = process.env.BUCKET_NAME;

// Initialize clients
const bedrockClient = new BedrockAgentClient({ region: 'us-west-2' });
const s3Client = new S3Client({ region: 'us-west-2' });

// Function to list all objects in the bucket
async function listAllObjects() {
  const allObjects = [];
  let continuationToken = undefined;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    });
    
    const response = await s3Client.send(command);
    
    if (response.Contents) {
      allObjects.push(...response.Contents);
    }
    
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  
  return allObjects;
}

// Function to ingest documents in batches
async function ingestDocuments(objects) {
  // Process in batches of 25
  const batchSize = 25;
  const totalBatches = Math.ceil(objects.length / batchSize);
  
  console.log(`Found ${objects.length} objects to ingest. Processing in ${totalBatches} batches.`);
  
  for (let i = 0; i < objects.length; i += batchSize) {
    const batch = objects.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    
    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} files)`);
    
    /** @type {import('@aws-sdk/client-bedrock-agent').KnowledgeBaseDocument[]} */
    const dataSourceObjects = batch
      .filter(obj => !obj.Key.endsWith('.metadata.json'))
      .map(obj => {        
        // Create paths for content and metadata
        const contentUri = `s3://${bucketName}/${obj.Key}`;
        const metadataUri = `s3://${bucketName}/${obj.Key}.metadata.json`;
        
        return {
          metadata: {
            type: "S3_LOCATION", 
            s3Location: {
              uri: metadataUri,
            }
          },
          content: {
            dataSourceType: "S3",
            s3: {
              s3Location: {
                uri: contentUri,
              }
            }
          }
        };
      })

    try {
      const command = new IngestKnowledgeBaseDocumentsCommand({
        knowledgeBaseId: process.env.KB_ID,
        dataSourceId: process.env.DATA_SOURCE_ID,
        documents: dataSourceObjects
      });
      
      const response = await bedrockClient.send(command);
      console.log(`Batch ${batchNumber} ingestion initiated.`);
      console.log(response)
    } catch (error) {
      console.error(`Error processing batch ${batchNumber}:`, error);
    }
    
    // Add a small delay between batches to avoid throttling
    if (i + batchSize < objects.length) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Main execution function
async function main() {
  try {
    console.log(`Starting ingestion of documents from bucket: ${bucketName}`);
    const objects = await listAllObjects();
    
    if (objects.length === 0) {
      console.log('No objects found in the bucket.');
      return;
    }
    
    await ingestDocuments(objects);
    console.log('Document ingestion process completed.');
  } catch (error) {
    console.error('Error in main execution:', error);
    process.exit(1);
  }
}

// Execute the script
await main()
