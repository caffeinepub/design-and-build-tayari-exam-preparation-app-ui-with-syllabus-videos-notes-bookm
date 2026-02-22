import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useStandaloneNoteManagement } from '@/hooks/useStandaloneNoteManagement';
import { toast } from 'sonner';

export default function StandaloneNoteManagementForm() {
  const { notes, deleteNote, isDeleting } = useStandaloneNoteManagement();

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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Existing Notes ({notes?.length || 0})
        </h2>
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
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
