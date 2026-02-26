import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOfflineLibrary } from '@/hooks/useOfflineLibrary';

export default function OfflineLibrary() {
  const navigate = useNavigate();
  const { items, removeItem } = useOfflineLibrary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Offline Library</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">No saved items yet.</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Download notes and question papers to access them offline.
            </p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{item.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => window.open(item.url, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
