import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfileView, AchievementsResponse, BadgeView } from '../backend';

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfileView | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfileView) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAdminGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfileView[]>({
    queryKey: ['adminAllUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllUsers();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCheckAndUpdateAchievements() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, xp }: { userId: string; xp: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.checkAndUpdateAchievements(Principal.fromText(userId), xp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLeaderboard();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAchievements() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAchievements();
    },
    enabled: !!actor && !actorFetching,
  });
}
