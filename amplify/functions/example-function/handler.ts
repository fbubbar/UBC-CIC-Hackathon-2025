import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { BedrockAgentRuntimeClient, RetrieveCommand } from '@aws-sdk/client-bedrock-agent-runtime';

interface RetrievalResult {
  content?: {
    text?: string;
  };
  location?: {
    s3Location?: {
      uri?: string;
    };
  };
  score?: number;
}

export const handler = async (event: any) => {
  const bedrockRuntime = new BedrockRuntimeClient({ region: 'us-west-2' });
  const bedrockAgent = new BedrockAgentRuntimeClient({ region: 'us-west-2' });
  
  const kbId = 'BEAQP7IZHR';
  
  try {
    const userQuery = event.query || 'What is artificial intelligence?';
    
    // Retrieve from knowledge base
    const retrieveCommand = new RetrieveCommand({
      knowledgeBaseId: kbId,
      retrievalQuery: { text: userQuery },
      retrievalConfiguration: {
        vectorSearchConfiguration: { numberOfResults: 5 }
      }
    });
    
    const retrieveResponse = await bedrockAgent.send(retrieveCommand);
    const retrievalResults: RetrievalResult[] = retrieveResponse.retrievalResults || [];
    
    // Extract context
    const retrievedContext = retrievalResults
      .map(result => result.content?.text)
      .filter(Boolean)
      .join('\n\n');
    
    // Prepare prompt
    const prompt = `Based on the following context, please answer the user's question:

Context:
${retrievedContext}

Question: ${userQuery}

Please provide a clear and concise answer based on the context provided.`;

    // Call Claude 3.5 Sonnet
    const invokeCommand = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      contentType: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }]
      })
    });
    
    const response = await bedrockRuntime.send(invokeCommand);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: responseBody.content[0].text,
        query: userQuery,
        kbId,
        retrievedChunks: retrievalResults.length,
        sources: retrievalResults.map(result => ({
          source: result.location?.s3Location?.uri || 'Unknown',
          score: result.score || 0
        }))
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
        errorCode: (error as any)?.name || 'UnknownError'
      })
    };
  }
};