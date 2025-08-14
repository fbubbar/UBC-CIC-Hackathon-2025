import { useMutation } from '@tanstack/react-query';
import { PDFQAService, PDFQuestionRequest, PDFQuestionResponse } from '@/lib/api';

export function usePDFQuestion() {
  return useMutation<PDFQuestionResponse, Error, PDFQuestionRequest>({
    mutationFn: PDFQAService.askQuestion,
    onError: (error) => {
      console.error('PDF question error:', error);
    },
  });
}

export function useValidatePDFRequest() {
  return (request: Partial<PDFQuestionRequest>) => {
    return PDFQAService.validateRequest(request);
  };
}