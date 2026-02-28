// src/hooks/profile/useUpdateUserProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateProfilePayload } from '@/types/auth.types';
import { updateUserProfile } from '@/services/auth.service';

export const USER_PROFILE_KEY = ['userProfile'] as const;


export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateUserProfile(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: USER_PROFILE_KEY });
      const previous = queryClient.getQueryData(USER_PROFILE_KEY);

      queryClient.setQueryData(USER_PROFILE_KEY, (old: { user?: Record<string, unknown> } | undefined) => {
        if (!old?.user) return old;
        return {
          ...old,
          user: {
            ...old.user,
            displayName: payload.name ?? old.user.displayName,
            bio: payload.bio ?? old.user.bio,
            location: payload.location ?? old.user.location,
            github: payload.githubUrl ?? old.user.github,
            twitter: payload.twitterUrl ?? old.user.twitter,
            website: payload.website ?? old.user.website,
          },
        };
      });

      return { previous };
    },

    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(USER_PROFILE_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
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
