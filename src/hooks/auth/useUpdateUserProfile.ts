// src/hooks/profile/useUpdateUserProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateProfilePayload, UserProfile } from '@/types/auth.types';
import { updateUserProfile } from '@/services/auth.service';
import { CURRENT_USER_QUERY_KEY } from './useGetUserProfile';

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateUserProfile(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      const previous = queryClient.getQueryData<UserProfile>(
        CURRENT_USER_QUERY_KEY,
      );

      if (previous) {
        queryClient.setQueryData<UserProfile>(CURRENT_USER_QUERY_KEY, {
          ...previous,
          displayName: payload.name ?? previous.displayName,
          bio: payload.bio ?? previous.bio,
          location: payload.location ?? previous.location,
          github: payload.githubUrl ?? previous.github,
          twitter: payload.twitterUrl ?? previous.twitter,
          website: payload.website ?? previous.website,
        });
      }

      return { previous };
    },

    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });

  return {
    updateProfile: mutateAsync,
    isPending,
    isError,
    isSuccess,
    error,
  };
}
