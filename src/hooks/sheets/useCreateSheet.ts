import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSheetRequest } from '@/services/sheets.service';
import type { CreateSheetPayload, CreateSheetResponse, ApiError } from '@/types/sheet.types';
 
export const useCreateSheet = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<CreateSheetResponse, ApiError, CreateSheetPayload>({
    mutationFn: createSheetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetDetails'] });
    },
  });
 
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    createSheetMutation: mutation.mutateAsync,
  };
};