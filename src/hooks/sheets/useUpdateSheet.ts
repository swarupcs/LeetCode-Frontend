import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSheetRequest } from '@/services/sheets.service';
import type {
  CreateSheetPayload,
  CreateSheetResponse,
  ApiErrorResponse,
} from '@/types/sheet.types';

export const useUpdateSheet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateSheetResponse,
    ApiErrorResponse,
    { sheetId: string; payload: CreateSheetPayload }
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