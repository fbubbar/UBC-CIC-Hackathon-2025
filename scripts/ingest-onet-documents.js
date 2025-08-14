import { BedrockAgentClient, IngestKnowledgeBaseDocumentsCommand } from "@aws-sdk/client-bedrock-agent"
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs'
import * as path from 'path'

// Bucket information from amplify outputs
const BUCKET_NAME = 'amplify-ubccicgenaihackathon202-databucket76dba918-u4tbp0b8ey8w';
const KNOWLEDGE_BASE_ID = 'BEAQP7IZHR';
const DATA_SOURCE_ID = 'PBLLIR7W05'

// Initialize clients
const bedrockClient = new BedrockAgentClient({ region: 'us-west-2' });
const s3Client = new S3Client({ region: 'us-west-2' });

// Function to list all objects in the bucket
async function listAllObjects() {
  const allObjects = [];
  let continuationToken = undefined;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
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
        const contentUri = `s3://${BUCKET_NAME}/${obj.Key}`;
        const metadataUri = `s3://${BUCKET_NAME}/${obj.Key}.metadata.json`;
        
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
        knowledgeBaseId: KNOWLEDGE_BASE_ID,
        dataSourceId: DATA_SOURCE_ID,
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
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Main execution function
async function main() {
  try {
    console.log(`Starting ingestion of documents from bucket: ${BUCKET_NAME}`);
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
