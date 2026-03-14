import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSheetRequest } from '@/services/sheets.service';
import type { DeleteSheetResponse, ApiError } from '@/types/sheet.types';
 
export const useDeleteSheet = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<DeleteSheetResponse, ApiError, string>({
    mutationFn: deleteSheetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetDetails'] });
    },
  });
 
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    deleteSheetMutation: mutation.mutateAsync,
  };
};