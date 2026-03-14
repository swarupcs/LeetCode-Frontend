import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSheetRequest } from '@/services/sheets.service';
import type { UpdateSheetPayload, UpdateSheetResponse, ApiError } from '@/types/sheet.types';
 
export const useUpdateSheet = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<
    UpdateSheetResponse,
    ApiError,
    { sheetId: string; payload: UpdateSheetPayload }
  >({
    mutationFn: ({ sheetId, payload }) => updateSheetRequest(sheetId, payload),
    onSuccess: (_, { sheetId }) => {
      queryClient.invalidateQueries({ queryKey: ['sheetDetails'] });
      queryClient.invalidateQueries({ queryKey: ['sheet', sheetId] });
    },
  });
 
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    updateSheetMutation: mutation.mutateAsync,
  };
};