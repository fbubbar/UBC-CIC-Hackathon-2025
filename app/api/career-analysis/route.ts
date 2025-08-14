import { NextRequest, NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambdaClient = new LambdaClient({
  region: 'us-west-2',
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('Sending query to Lambda:', query);

    // Invoke the Lambda function
    const command = new InvokeCommand({
      FunctionName: 'amplify-ubccicgenaihackathon-handlerlambdaE29D1580-oQWaxkD03BjQ',
      Payload: JSON.stringify({ query }),
    });

    console.log('Invoking Lambda function...');
    const response = await lambdaClient.send(command);
    console.log('Lambda response status:', response.StatusCode);
    console.log('Lambda response payload:', response.Payload);
    
    if (response.Payload) {
      const result = JSON.parse(new TextDecoder().decode(response.Payload));
      console.log('Decoded Lambda result:', result);
      
      // Check if Lambda returned an error
      if (result.errorMessage || result.errorType) {
        console.error('Lambda function error:', result);
        return NextResponse.json(
          { 
            error: 'Lambda function error',
            details: result.errorMessage || 'Unknown error',
            type: result.errorType || 'Unknown',
            requestId: result.requestId
          },
          { status: 500 }
        );
      }
      
      // If the Lambda returned a stringified body, parse it
      if (result.body && typeof result.body === 'string') {
        console.log('Parsing stringified body...');
        try {
          const parsedBody = JSON.parse(result.body);
          console.log('Parsed body:', parsedBody);
          return NextResponse.json(parsedBody);
        } catch (parseError) {
          console.error('Error parsing Lambda response body:', parseError);
          return NextResponse.json(
            { error: 'Invalid response format from Lambda' },
            { status: 500 }
          );
        }
      }
      
      console.log('Returning raw result');
      return NextResponse.json(result);
    }

    console.log('No payload in Lambda response');
    return NextResponse.json(
      { error: 'No response from Lambda function' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Career analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze career data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}