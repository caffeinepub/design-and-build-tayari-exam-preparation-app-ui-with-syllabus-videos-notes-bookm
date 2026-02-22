import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OldQuestion } from '../backend';

export function useOldQuestionsManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const questionsQuery = useQuery<OldQuestion[]>({
    queryKey: ['oldQuestions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOldQuestions();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (question: OldQuestion) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOldQuestion(question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oldQuestions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteOldQuestion(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oldQuestions'] });
    },
  });

  return {
    questions: questionsQuery.data,
    isLoading: questionsQuery.isLoading,
    addQuestion: addMutation.mutateAsync,
    deleteQuestion: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
