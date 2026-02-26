import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  CreateSheetPayload,
  CreateSheetResponse,
  ApiErrorResponse,
} from '@/types/sheet.types';
import { createSheetRequest } from '@/services/sheets.service';

export const useCreateSheet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateSheetResponse,
    ApiErrorResponse,
    CreateSheetPayload
  >({
    mutationFn: (payload) => createSheetRequest(payload),
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
