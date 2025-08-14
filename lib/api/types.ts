export interface RelevantChunk {
  content: string;
  score: number;
}

export interface PDFQuestionRequest {
  pdf: File;
  question: string;
}

export interface PDFQuestionResponse {
  answer: string;
  relevantChunks: RelevantChunk[];
  success: boolean;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface SavedResponse {
  id: string;
  question: string;
  answer: string;
  fileName: string;
  savedAt: string;
  tags: string[];
  userId?: string;
}

export interface CreateSavedResponseRequest {
  question: string;
  answer: string;
  fileName: string;
  tags?: string[];
}

export type ApiResponse<T> = T | ApiError;

export function isApiError(response: any): response is ApiError {
  return response && typeof response.error === 'string';
}