import { useQuery } from '@tanstack/react-query';


import { getAllSheetDetailsRequest } from '@/services/sheets.service';
import type { ApiErrorResponse, GetAllSheetDetailsResponse } from '@/types/sheet.types';

export const useGetAllSheetDetails = () => {
  const query = useQuery<GetAllSheetDetailsResponse, ApiErrorResponse>({
    queryKey: ['sheetDetails'],
    queryFn: () => getAllSheetDetailsRequest(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  console.log("query", query)

  return {
    ...query,
    sheets: query.data?.sdeSheets ?? [],
  };
};
