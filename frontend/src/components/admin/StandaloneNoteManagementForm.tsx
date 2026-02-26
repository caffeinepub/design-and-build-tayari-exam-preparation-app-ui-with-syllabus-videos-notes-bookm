import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { useStandaloneNoteManagement } from '@/hooks/useStandaloneNoteManagement';
import { toast } from 'sonner';

export default function StandaloneNoteManagementForm() {
  const { notes, addNote, deleteNote, isAdding, isDeleting } = useStandaloneNoteManagement();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    driveUrl: '',
  });

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(index);
        toast.success('Note deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete note');
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
      await addNote(formData);
      toast.success('Note added successfully!');
      setFormData({ title: '', description: '', driveUrl: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to add note');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Standalone Notes ({notes?.length || 0})
          </h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'outline' : 'default'}
            size="default"
            className="shrink-0 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Note'}
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
                placeholder="Enter note title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter note description"
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
                {isAdding ? 'Adding...' : 'Add Note'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {notes?.map((note, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {note.title}
                </h3>
                {note.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {note.description}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                  {note.driveUrl}
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
          {(!notes || notes.length === 0) && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No notes available.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
