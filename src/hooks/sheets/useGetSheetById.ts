import { useQuery } from '@tanstack/react-query';
import { getSheetByIdRequest } from '@/services/sheets.service';
import type { GetSheetByIdResponse, ApiError } from '@/types/sheet.types';
 
export const useGetSheetById = (sheetId?: string) => {
  const query = useQuery<GetSheetByIdResponse, ApiError>({
    queryKey: ['sheet', sheetId],
    queryFn: () => getSheetByIdRequest(sheetId!),
    enabled: !!sheetId,
    staleTime: 5 * 60 * 1000,
  });
 
  return {
    ...query,
    // data.data is SheetDetail
    sheet: query.data?.data ?? null,
  };
};
 