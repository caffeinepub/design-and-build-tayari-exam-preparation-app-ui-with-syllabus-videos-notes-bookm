import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SyllabusEntry } from '../backend';

export function useSyllabusManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const entriesQuery = useQuery<SyllabusEntry[]>({
    queryKey: ['syllabusEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSyllabusEntries();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (entry: SyllabusEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSyllabusEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusEntries'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSyllabusEntry(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusEntries'] });
    },
  });

  return {
    entries: entriesQuery.data,
    isLoading: entriesQuery.isLoading,
    addEntry: addMutation.mutateAsync,
    deleteEntry: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
