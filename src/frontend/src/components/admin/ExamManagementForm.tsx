import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useExamManagement } from '@/hooks/useExamManagement';
import { toast } from 'sonner';

export default function ExamManagementForm() {
  const { exams, deleteExam, isDeleting } = useExamManagement();

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(index);
        toast.success('Exam deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete exam');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Existing Exams ({exams?.length || 0})
        </h2>
        <div className="space-y-3">
          {exams?.map((exam, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {exam.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Duration: {exam.duration.toString()} minutes
                </p>
                {exam.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {exam.description}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                  {exam.pdfUrl}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(index)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(!exams || exams.length === 0) && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No exams available.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
