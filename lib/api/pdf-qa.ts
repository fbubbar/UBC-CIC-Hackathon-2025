import { 
  PDFQuestionRequest, 
  PDFQuestionResponse, 
  ApiError, 
  ApiResponse,
  isApiError 
} from './types';

export class PDFQAService {
  private static readonly BASE_URL = '/api';

  static async askQuestion(
    request: PDFQuestionRequest
  ): Promise<PDFQuestionResponse> {
    const formData = new FormData();
    formData.append('pdf', request.pdf);
    formData.append('question', request.question);

    const response = await fetch(`${this.BASE_URL}/pdf-qa`, {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse<PDFQuestionResponse> = await response.json();

    if (!response.ok) {
      throw new Error(
        isApiError(data) 
          ? data.error 
          : `HTTP ${response.status}: ${response.statusText}`
      );
    }

    if (isApiError(data)) {
      throw new Error(data.error);
    }

    return data;
  }

  static validateRequest(request: Partial<PDFQuestionRequest>): string[] {
    const errors: string[] = [];

    if (!request.pdf) {
      errors.push('PDF file is required');
    } else if (request.pdf.type !== 'application/pdf') {
      errors.push('File must be a PDF');
    }

    if (!request.question?.trim()) {
      errors.push('Question is required');
    } else if (request.question.length > 500) {
      errors.push('Question must be 500 characters or less');
    }

    return errors;
  }
}