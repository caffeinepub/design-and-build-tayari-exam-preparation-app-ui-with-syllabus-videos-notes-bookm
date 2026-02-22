import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ThirdPaperTopic, ThirdPaperVideo, ThirdPaperNote } from '../backend';

export function useThirdPaperManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const topicsQuery = useQuery<ThirdPaperTopic[]>({
    queryKey: ['thirdPaperTopics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThirdPaperTopics();
    },
    enabled: !!actor && !isFetching,
  });

  const videosQuery = useQuery<ThirdPaperVideo[]>({
    queryKey: ['thirdPaperVideos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThirdPaperVideos();
    },
    enabled: !!actor && !isFetching,
  });

  const notesQuery = useQuery<ThirdPaperNote[]>({
    queryKey: ['thirdPaperNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThirdPaperNotes();
    },
    enabled: !!actor && !isFetching,
  });

  const addTopicMutation = useMutation({
    mutationFn: async (topic: ThirdPaperTopic) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addThirdPaperTopic(topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thirdPaperTopics'] });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteThirdPaperTopic(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thirdPaperTopics'] });
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (video: ThirdPaperVideo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addThirdPaperVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thirdPaperVideos'] });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteThirdPaperVideo(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thirdPaperVideos'] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: ThirdPaperNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addThirdPaperNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thirdPaperNotes'] });
    },
  });

  return {
    topics: topicsQuery.data,
    videos: videosQuery.data,
    notes: notesQuery.data,
    addTopic: addTopicMutation.mutateAsync,
    deleteTopic: deleteTopicMutation.mutateAsync,
    addVideo: addVideoMutation.mutateAsync,
    deleteVideo: deleteVideoMutation.mutateAsync,
    addNote: addNoteMutation.mutateAsync,
    isAddingTopic: addTopicMutation.isPending,
    isAddingVideo: addVideoMutation.isPending,
    isAddingNote: addNoteMutation.isPending,
    isDeletingTopic: deleteTopicMutation.isPending,
    isDeletingVideo: deleteVideoMutation.isPending,
  };
}
