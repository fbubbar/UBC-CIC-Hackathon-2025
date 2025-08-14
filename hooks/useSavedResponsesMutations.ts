import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SavedResponsesService, 
  CreateSavedResponseRequest, 
  SavedResponse 
} from '@/lib/api';
import { SAVED_RESPONSES_QUERY_KEY } from './useSavedResponses';

export function useCreateSavedResponse() {
  const queryClient = useQueryClient();

  return useMutation<SavedResponse, Error, CreateSavedResponseRequest>({
    mutationFn: SavedResponsesService.createSavedResponse,
    onSuccess: (newResponse) => {
      // Add the new response to the existing list
      queryClient.setQueryData<SavedResponse[]>(
        SAVED_RESPONSES_QUERY_KEY,
        (oldData) => {
          if (!oldData) return [newResponse];
          return [newResponse, ...oldData];
        }
      );
      
      // Set the individual response data
      queryClient.setQueryData(
        ['saved-response', newResponse.id],
        newResponse
      );
    },
    onError: (error) => {
      console.error('Error creating saved response:', error);
    },
  });
}

export function useUpdateSavedResponse() {
  const queryClient = useQueryClient();

  return useMutation<
    SavedResponse, 
    Error, 
    { id: string; updates: Partial<CreateSavedResponseRequest> }
  >({
    mutationFn: ({ id, updates }) => 
      SavedResponsesService.updateSavedResponse(id, updates),
    onSuccess: (updatedResponse) => {
      // Update the response in the list
      queryClient.setQueryData<SavedResponse[]>(
        SAVED_RESPONSES_QUERY_KEY,
        (oldData) => {
          if (!oldData) return [updatedResponse];
          return oldData.map(response => 
            response.id === updatedResponse.id ? updatedResponse : response
          );
        }
      );
      
      // Update the individual response data
      queryClient.setQueryData(
        ['saved-response', updatedResponse.id],
        updatedResponse
      );
    },
    onError: (error) => {
      console.error('Error updating saved response:', error);
    },
  });
}

export function useDeleteSavedResponse() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: SavedResponsesService.deleteSavedResponse,
    onSuccess: (_, deletedId) => {
      // Remove the response from the list
      queryClient.setQueryData<SavedResponse[]>(
        SAVED_RESPONSES_QUERY_KEY,
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter(response => response.id !== deletedId);
        }
      );
      
      // Remove the individual response data
      queryClient.removeQueries({ 
        queryKey: ['saved-response', deletedId] 
      });
    },
    onError: (error) => {
      console.error('Error deleting saved response:', error);
    },
  });
}