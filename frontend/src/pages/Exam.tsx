import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import DriveViewer from '@/components/DriveViewer';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import SoundPlayer from '@/components/SoundPlayer';
import { examSets } from '@/content/exams';

export default function Exam() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<{ title: string; urls: string[]; duration: number } | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [playSound, setPlaySound] = useState(false);

  const { timeLeft, formattedTime, startTimer, resetTimer } = useCountdownTimer({
    onComplete: () => {
      setExamFinished(true);
      setPlaySound(true);
    },
  });

  const handleStartExam = (exam: { title: string; urls: string[]; duration: number }) => {
    setSelectedExam(exam);
    setExamStarted(true);
    setExamFinished(false);
    setPlaySound(false);
    startTimer(exam.duration);
  };

  const handleResetExam = () => {
    setSelectedExam(null);
    setExamStarted(false);
    setExamFinished(false);
    setPlaySound(false);
    resetTimer();
  };

  if (examFinished) {
    return (
      <div className="min-h-screen app-page-bg pb-20">
        <SoundPlayer play={playSound} onEnded={() => setPlaySound(false)} />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-6">
          <CheckCircle className="w-24 h-24 text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">परीक्षा समाप्त भयो!</h1>
          <p className="text-slate-600 dark:text-slate-400">समय सकियो! परीक्षा पूरा गर्नुभएकोमा बधाई छ।</p>
          <Button onClick={handleResetExam} size="lg">
            परीक्षा चयनमा फर्कनुहोस्
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (examStarted && selectedExam) {
    return (
      <div className="min-h-screen app-page-bg pb-20">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleResetExam}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedExam.title}</h1>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{formattedTime}</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <DriveViewer urls={selectedExam.urls} title={selectedExam.title} />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen app-page-bg pb-20">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">मक परीक्षा</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {examSets.map((exam) => (
          <Card
            key={exam.id}
            className={`p-6 ${exam.comingSoon ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'} transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{exam.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration} मिनेट</span>
                  </div>
                </div>
              </div>
              {exam.comingSoon ? (
                <Badge variant="secondary">चाँडै आउँदैछ</Badge>
              ) : (
                <Button onClick={() => handleStartExam(exam)}>
                  परीक्षा सुरु गर्नुहोस्
                </Button>
              )}
            </div>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
