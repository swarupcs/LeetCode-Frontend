import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSheetRequest } from '@/services/sheets.service';
import type { ApiErrorResponse } from '@/types/sheet.types';

export const useDeleteSheet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string },
    ApiErrorResponse,
    string
  >({
    mutationFn: (sheetId: string) => deleteSheetRequest(sheetId),
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