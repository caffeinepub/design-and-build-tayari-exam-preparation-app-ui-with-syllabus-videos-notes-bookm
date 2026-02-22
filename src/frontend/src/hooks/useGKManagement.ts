import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GKTopic, GKVideo, GKNote } from '../backend';

export function useGKManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const topicsQuery = useQuery<GKTopic[]>({
    queryKey: ['gkTopics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGKTopics();
    },
    enabled: !!actor && !isFetching,
  });

  const videosQuery = useQuery<GKVideo[]>({
    queryKey: ['gkVideos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGKVideos();
    },
    enabled: !!actor && !isFetching,
  });

  const notesQuery = useQuery<GKNote[]>({
    queryKey: ['gkNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGKNotes();
    },
    enabled: !!actor && !isFetching,
  });

  const addTopicMutation = useMutation({
    mutationFn: async (topic: GKTopic) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGKTopic(topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gkTopics'] });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGKTopic(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gkTopics'] });
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (video: GKVideo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGKVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gkVideos'] });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGKVideo(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gkVideos'] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: GKNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGKNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gkNotes'] });
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
