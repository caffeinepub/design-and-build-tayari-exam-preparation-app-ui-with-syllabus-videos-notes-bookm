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
  const { exams, addExam, deleteExam, isAdding, isDeleting } = useExamManagement();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    description: '',
    pdfUrl: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.duration || !formData.pdfUrl.trim()) {
      toast.error('Title, duration, and PDF URL are required');
      return;
    }

    try {
      await addExam({
        title: formData.title,
        duration: BigInt(formData.duration),
        description: formData.description,
        pdfUrl: formData.pdfUrl,
      });
      toast.success('Exam added successfully!');
      setFormData({ title: '', duration: '', description: '', pdfUrl: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to add exam');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Mock Exams ({exams?.length || 0})
          </h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'outline' : 'default'}
            size="default"
            className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Exam'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter exam title"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Enter duration in minutes"
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter exam description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="pdfUrl">PDF URL *</Label>
              <Input
                id="pdfUrl"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="Enter PDF URL"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Exam'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

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
                {exam.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {exam.description}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Duration: {exam.duration.toString()} minutes
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                  {exam.pdfUrl}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(index)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
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
