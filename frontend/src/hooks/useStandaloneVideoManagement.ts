import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StandaloneVideo } from '../backend';

export function useStandaloneVideoManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const videosQuery = useQuery<StandaloneVideo[]>({
    queryKey: ['standaloneVideos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStandaloneVideos();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (video: StandaloneVideo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addStandaloneVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standaloneVideos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStandaloneVideo(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standaloneVideos'] });
    },
  });

  return {
    videos: videosQuery.data,
    isLoading: videosQuery.isLoading,
    addVideo: addMutation.mutateAsync,
    deleteVideo: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
