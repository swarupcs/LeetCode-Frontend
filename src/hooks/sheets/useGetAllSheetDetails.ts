import { useQuery } from '@tanstack/react-query';
import { getAllSheetDetailsRequest } from '@/services/sheets.service';
import type { GetAllSheetsResponse, ApiError } from '@/types/sheet.types';
 
export const useGetAllSheetDetails = () => {
  const query = useQuery<GetAllSheetsResponse, ApiError>({
    queryKey: ['sheetDetails'],
    queryFn: getAllSheetDetailsRequest,
    staleTime: 5 * 60 * 1000,
  });
 
  return {
    ...query,
    // data.data is Sheet[]
    sheets: query.data?.data ?? [],
  };
};