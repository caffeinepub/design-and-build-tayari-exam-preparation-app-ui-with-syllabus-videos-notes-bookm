import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StandaloneNote } from '../backend';

export function useStandaloneNoteManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const notesQuery = useQuery<StandaloneNote[]>({
    queryKey: ['standaloneNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStandaloneNotes();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (note: StandaloneNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addStandaloneNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standaloneNotes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStandaloneNote(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standaloneNotes'] });
    },
  });

  return {
    notes: notesQuery.data,
    isLoading: notesQuery.isLoading,
    addNote: addMutation.mutateAsync,
    deleteNote: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
