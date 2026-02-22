import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { useExamManagement } from '@/hooks/useExamManagement';
import { toast } from 'sonner';

export default function ExamManagementForm() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const { exams, addExam, deleteExam, isAdding, isDeleting } = useExamManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExam({
        title,
        duration: BigInt(parseInt(duration)),
        description,
        pdfUrl,
      });
      toast.success('Mock exam added successfully!');
      setTitle('');
      setDuration('');
      setDescription('');
      setPdfUrl('');
    } catch (error) {
      toast.error('Failed to add exam');
      console.error(error);
    }
  };

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
          Add Mock Exam
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">परीक्षा शीर्षक (Exam Title)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter exam title"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">अवधि (Duration in minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="150"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">विवरण (Description)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter exam description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="pdfUrl">PDF URL (Google Drive)</Label>
            <Input
              id="pdfUrl"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              required
            />
          </div>
          <Button type="submit" disabled={isAdding} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add Exam'}
          </Button>
        </form>
      </Card>

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
              No exams yet. Add your first exam above.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
