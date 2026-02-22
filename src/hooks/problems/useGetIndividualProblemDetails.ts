import { useQuery } from '@tanstack/react-query';
import { getIndividualProblemRequest } from '@/services/problem.service';
import type { Problem, ApiError } from '@/types/problem.types';

export const useProblem = (problemId: string) => {
  const query = useQuery<Problem, ApiError>({
    queryKey: ['problem', problemId],
    queryFn: () => getIndividualProblemRequest(problemId),
    enabled: !!problemId, // prevents call if undefined
  });

  return {
    ...query,
    problem: query.data,
  };
};
