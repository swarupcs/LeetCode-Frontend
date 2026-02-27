import { useQuery } from '@tanstack/react-query';
import { getSheetByIdRequest } from '@/services/sheets.service';
import type {
  GetSheetByIdResponse,
  ApiErrorResponse,
} from '@/types/sheet.types';

export const useGetSheetById = (sheetId?: string) => {
  const query = useQuery<GetSheetByIdResponse, ApiErrorResponse>({
    queryKey: ['sheet', sheetId],
    queryFn: () => getSheetByIdRequest(sheetId!),
    enabled: !!sheetId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    sheet: query.data?.sdeSheet ?? null,
  };
};
