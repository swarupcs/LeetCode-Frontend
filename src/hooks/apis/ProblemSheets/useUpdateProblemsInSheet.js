import { updateProblemsInSheetRequest } from '@/apis/ProblemSheet/updateProblemsInSheet';
import { useMutation } from '@tanstack/react-query';

export const useUpdateProblemsInSheet = () => {
  const {
    isLoading,
    isSucess,
    error,
    mutateAsync: updateProblemsInSheetMutation,
  } = useMutation({
    mutationFn: ({ sheetId, problemIds }) =>
      updateProblemsInSheetRequest({ sheetId, problemIds }),

    onSuccess: (data) => {
      console.log('Successfully updated problem to sheet', data);
    },
    onError: (error) => {
      console.error('Failed to updated problem to sheet', error);
      console.log('error.message', error.message);
    },
  });

  return {
    isLoading,
    isSucess,
    error,
    updateProblemsInSheetMutation,
  };
};
