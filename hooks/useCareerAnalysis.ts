import { useMutation } from '@tanstack/react-query';

interface CareerAnalysisRequest {
  query: string;
}

interface CareerAnalysisResponse {
  answer: string;
  query: string;
  kbId: string;
  retrievedChunks: number;
  sources: Array<{
    source: string;
    score: number;
  }>;
}

const callLambdaFunction = async (request: CareerAnalysisRequest): Promise<CareerAnalysisResponse> => {
  console.log("Hook: Making API call to /api/career-analysis");
  
  const response = await fetch('/api/career-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log("Hook: Response status:", response.status);
  console.log("Hook: Response ok:", response.ok);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Hook: Response data:", data);
  
  return data;
};

export function useCareerAnalysis() {
  return useMutation<CareerAnalysisResponse, Error, CareerAnalysisRequest>({
    mutationFn: callLambdaFunction,
    onError: (error) => {
      console.error('Career analysis error:', error);
    },
  });
}