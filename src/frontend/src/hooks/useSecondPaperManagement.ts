import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SecondPaperTopic, SecondPaperVideo, SecondPaperNote } from '../backend';

export function useSecondPaperManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const topicsQuery = useQuery<SecondPaperTopic[]>({
    queryKey: ['secondPaperTopics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSecondPaperTopics();
    },
    enabled: !!actor && !isFetching,
  });

  const videosQuery = useQuery<SecondPaperVideo[]>({
    queryKey: ['secondPaperVideos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSecondPaperVideos();
    },
    enabled: !!actor && !isFetching,
  });

  const notesQuery = useQuery<SecondPaperNote[]>({
    queryKey: ['secondPaperNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSecondPaperNotes();
    },
    enabled: !!actor && !isFetching,
  });

  const addTopicMutation = useMutation({
    mutationFn: async (topic: SecondPaperTopic) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSecondPaperTopic(topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondPaperTopics'] });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSecondPaperTopic(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondPaperTopics'] });
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (video: SecondPaperVideo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSecondPaperVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondPaperVideos'] });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSecondPaperVideo(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondPaperVideos'] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: SecondPaperNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSecondPaperNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondPaperNotes'] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSecondPaperNote(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondPaperNotes'] });
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
    deleteNote: deleteNoteMutation.mutateAsync,
    isAddingTopic: addTopicMutation.isPending,
    isAddingVideo: addVideoMutation.isPending,
    isAddingNote: addNoteMutation.isPending,
    isDeletingTopic: deleteTopicMutation.isPending,
    isDeletingVideo: deleteVideoMutation.isPending,
    isDeletingNote: deleteNoteMutation.isPending,
  };
}
