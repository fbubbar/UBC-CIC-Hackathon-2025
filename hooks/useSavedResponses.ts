import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SavedResponsesService, SavedResponse } from '@/lib/api';

export const SAVED_RESPONSES_QUERY_KEY = ['saved-responses'] as const;

export function useSavedResponses() {
  return useQuery({
    queryKey: SAVED_RESPONSES_QUERY_KEY,
    queryFn: SavedResponsesService.getSavedResponses,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useSavedResponse(id: string) {
  return useQuery({
    queryKey: ['saved-response', id] as const,
    queryFn: () => SavedResponsesService.getSavedResponse(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useInvalidateSavedResponses() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ 
      queryKey: SAVED_RESPONSES_QUERY_KEY 
    });
  };
}

export function useSetSavedResponseData() {
  const queryClient = useQueryClient();
  
  return (newResponse: SavedResponse) => {
    // Add new response to the list
    queryClient.setQueryData<SavedResponse[]>(
      SAVED_RESPONSES_QUERY_KEY,
      (oldData) => {
        if (!oldData) return [newResponse];
        return [newResponse, ...oldData];
      }
    );
    
    // Set individual response data
    queryClient.setQueryData(
      ['saved-response', newResponse.id],
      newResponse
    );
  };
}