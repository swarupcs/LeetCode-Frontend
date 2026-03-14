// src/hooks/auth/useUpdateUserProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/services/auth.service';
import type {
  UpdateProfilePayload,
  UpdateUserProfileResponse,
  GetUserProfileResponse,
  ApiError,
} from '@/types/auth.types';
import { CURRENT_USER_QUERY_KEY } from './useGetUserProfile';

// Explicit context shape so onError can safely access context.previous
interface MutationContext {
  previous: GetUserProfileResponse | undefined;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateUserProfileResponse,
    ApiError,
    UpdateProfilePayload,
    MutationContext          // ← 4th generic: context type
  >({
    mutationFn: updateUserProfile,

    onMutate: async (payload): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      const previous = queryClient.getQueryData<GetUserProfileResponse>(CURRENT_USER_QUERY_KEY);

      if (previous?.data) {
        const p = payload;
        queryClient.setQueryData<GetUserProfileResponse>(CURRENT_USER_QUERY_KEY, {
          ...previous,
          data: {
            ...previous.data,
            displayName: p.name       !== undefined ? p.name       : previous.data.displayName,
            bio:         p.bio        !== undefined ? p.bio        : previous.data.bio,
            location:    p.location   !== undefined ? p.location   : previous.data.location,
            github:      p.githubUrl  !== undefined ? p.githubUrl  : previous.data.github,
            twitter:     p.twitterUrl !== undefined ? p.twitterUrl : previous.data.twitter,
            website:     p.website    !== undefined ? p.website    : previous.data.website,
          },
        });
      }

      return { previous };
    },

    onError: (_err, _payload, context) => {
      // context is now typed as MutationContext | undefined — no more '{}'
      if (context?.previous) {
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};