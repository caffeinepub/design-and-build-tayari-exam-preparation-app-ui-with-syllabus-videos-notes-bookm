import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { IQCategory, IQVideo, IQNote } from '../backend';

export function useIQManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery<IQCategory[]>({
    queryKey: ['iqCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIQCategories();
    },
    enabled: !!actor && !isFetching,
  });

  const videosQuery = useQuery<IQVideo[]>({
    queryKey: ['iqVideos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIQVideos();
    },
    enabled: !!actor && !isFetching,
  });

  const notesQuery = useQuery<IQNote[]>({
    queryKey: ['iqNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIQNotes();
    },
    enabled: !!actor && !isFetching,
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (category: IQCategory) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addIQCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iqCategories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteIQCategory(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iqCategories'] });
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (video: IQVideo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addIQVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iqVideos'] });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteIQVideo(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iqVideos'] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: IQNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addIQNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iqNotes'] });
    },
  });

  return {
    categories: categoriesQuery.data,
    videos: videosQuery.data,
    notes: notesQuery.data,
    addCategory: addCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    addVideo: addVideoMutation.mutateAsync,
    deleteVideo: deleteVideoMutation.mutateAsync,
    addNote: addNoteMutation.mutateAsync,
    isAddingCategory: addCategoryMutation.isPending,
    isAddingVideo: addVideoMutation.isPending,
    isAddingNote: addNoteMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
    isDeletingVideo: deleteVideoMutation.isPending,
  };
}
