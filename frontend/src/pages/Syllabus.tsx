import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DriveViewer from '@/components/DriveViewer';
import { syllabusLinks } from '@/content/syllabus';

export default function Syllabus() {
  const navigate = useNavigate();
  const [selectedSyllabus, setSelectedSyllabus] = useState<{ title: string; urls: string[] } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Syllabus</h1>
        </div>
      </header>

      {selectedSyllabus ? (
        <div className="container mx-auto px-4 py-6">
          <Button variant="outline" onClick={() => setSelectedSyllabus(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <DriveViewer urls={selectedSyllabus.urls} title={selectedSyllabus.title} />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6 space-y-4">
          {syllabusLinks.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'p-6 cursor-pointer transition-all duration-200',
                item.comingSoon
                  ? 'bg-slate-100 dark:bg-slate-800 opacity-60'
                  : 'hover:scale-[1.02] bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              )}
              onClick={() => {
                if (!item.comingSoon && item.urls) {
                  setSelectedSyllabus({ title: item.title, urls: item.urls });
                }
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.comingSoon && (
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Coming Soon</span>
                )}
              </div>
            </Card>
          ))}
        </main>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
