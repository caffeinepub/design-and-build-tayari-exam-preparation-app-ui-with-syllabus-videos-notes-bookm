import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useSyllabusManagement } from '@/hooks/useSyllabusManagement';
import { toast } from 'sonner';

export default function SyllabusManagementForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [published, setPublished] = useState(true);

  const { entries, addEntry, deleteEntry, isAdding, isDeleting } = useSyllabusManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEntry({ title, description, driveUrl, published });
      toast.success('Syllabus entry added successfully!');
      setTitle('');
      setDescription('');
      setDriveUrl('');
      setPublished(true);
    } catch (error) {
      toast.error('Failed to add syllabus entry');
      console.error(error);
    }
  };

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(index);
        toast.success('Entry deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete entry');
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Add Syllabus Entry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">शीर्षक (Title)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">विवरण (Description)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="driveUrl">Google Drive URL</Label>
            <Input
              id="driveUrl"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked as boolean)}
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <Button type="submit" disabled={isAdding} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add Entry'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Existing Entries ({entries?.length || 0})
        </h2>
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
                <span
                  className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                    entry.published
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {entry.published ? 'Published' : 'Draft'}
                </span>
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
          {(!entries || entries.length === 0) && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No entries yet. Add your first entry above.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
