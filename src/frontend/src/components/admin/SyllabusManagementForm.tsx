import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { useSyllabusManagement } from '@/hooks/useSyllabusManagement';
import { toast } from 'sonner';

export default function SyllabusManagementForm() {
  const { entries, addEntry, deleteEntry, isAdding, isDeleting } = useSyllabusManagement();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    driveUrl: '',
    published: true,
  });

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this syllabus entry?')) {
      try {
        await deleteEntry(index);
        toast.success('Syllabus entry deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete syllabus entry');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.driveUrl.trim()) {
      toast.error('Title and Drive URL are required');
      return;
    }

    try {
      await addEntry(formData);
      toast.success('Syllabus entry added successfully!');
      setFormData({ title: '', description: '', driveUrl: '', published: true });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to add syllabus entry');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Syllabus Entries ({entries?.length || 0})
          </h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'outline' : 'default'}
            size="default"
            className="shrink-0 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Entry'}
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
                placeholder="Enter syllabus title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter syllabus description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="driveUrl">Drive URL *</Label>
              <Input
                id="driveUrl"
                value={formData.driveUrl}
                onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                placeholder="Enter Google Drive URL"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Entry'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {entries?.map((entry, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {entry.title}
                </h3>
                {entry.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {entry.description}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                  {entry.driveUrl}
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
          {(!entries || entries.length === 0) && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No syllabus entries available.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
