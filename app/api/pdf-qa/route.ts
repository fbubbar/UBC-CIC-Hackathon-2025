import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { NextRequest, NextResponse } from 'next/server';
import { TextProcessor } from '../../../lib/textProcessor';

const pdf = require('pdf-parse');

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-west-2'
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    const question = formData.get('question') as string;

    if (!file || !question) {
      return NextResponse.json({ 
        error: 'Both PDF file and question are required' 
      }, { status: 400 });
    }

    if (question.length > 500) {
      return NextResponse.json({ 
        error: 'Question must be 500 characters or less' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const pdfData = await pdf(buffer);
    const text = TextProcessor.cleanText(pdfData.text);

    if (!text || text.length < 10) {
      return NextResponse.json({ 
        error: 'Could not extract text from PDF or text is too short' 
      }, { status: 400 });
    }

    // Split into chunks
    const chunks = TextProcessor.chunkText(text, 500, 50);

    // Find relevant chunks
    const relevantChunks = TextProcessor.searchChunks(question, chunks, 3);

    if (relevantChunks.length === 0) {
      return NextResponse.json({ 
        error: 'No relevant content found in the PDF' 
      }, { status: 400 });
    }

    // Prepare context for Bedrock
    const context = relevantChunks
      .map(chunk => chunk.content)
      .join('\n\n');

    const prompt = `Based on the following context from a PDF document, please answer the question. If the context doesn't contain enough information to answer the question, please say so.

Context:
${context}

Question: ${question}

Please provide a clear and concise answer based on the context provided.`;

    // Call Bedrock
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        { role: "user", content: [{ type: "text", text: prompt }] }
      ]
    };

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      body: JSON.stringify(payload),
      contentType: "application/json"
    });

    const response = await client.send(command);
    const data = JSON.parse(new TextDecoder().decode(response.body));
    
    return NextResponse.json({ 
      answer: data.content[0].text,
      relevantChunks: relevantChunks.map(chunk => ({
        content: chunk.content.substring(0, 200) + '...',
        score: chunk.score
      })),
      success: true 
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process PDF and generate answer', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
