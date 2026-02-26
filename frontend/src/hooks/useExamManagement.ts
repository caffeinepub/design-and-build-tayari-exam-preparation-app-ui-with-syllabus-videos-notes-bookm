import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MockExam } from '../backend';

export function useExamManagement() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const examsQuery = useQuery<MockExam[]>({
    queryKey: ['mockExams'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMockExams();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (exam: MockExam) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMockExam(exam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockExams'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMockExam(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockExams'] });
    },
  });

  return {
    exams: examsQuery.data,
    isLoading: examsQuery.isLoading,
    addExam: addMutation.mutateAsync,
    deleteExam: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
