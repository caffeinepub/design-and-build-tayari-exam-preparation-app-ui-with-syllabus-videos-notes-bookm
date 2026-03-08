import BottomNav from "@/components/BottomNav";
import DriveViewer from "@/components/DriveViewer";
import SoundPlayer from "@/components/SoundPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { examSets } from "@/content/exams";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useExamManagement } from "@/hooks/useExamManagement";
import { useIsAdmin } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Clock, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddExamForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (
    title: string,
    duration: number,
    description: string,
    pdfUrl: string,
  ) => Promise<void>;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !duration.trim() || !pdfUrl.trim()) {
      toast.error("शीर्षक, अवधि र PDF URL भर्नुहोस्");
      return;
    }
    const durationNum = Number.parseInt(duration, 10);
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      toast.error("सही अवधि (मिनेट) राख्नुहोस्");
      return;
    }
    await onSubmit(
      title.trim(),
      durationNum,
      description.trim(),
      pdfUrl.trim(),
    );
    setTitle("");
    setDuration("");
    setDescription("");
    setPdfUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mt-3 space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            परीक्षाको शीर्षक
          </Label>
          <Input
            placeholder="परीक्षाको शीर्षक लेख्नुहोस्..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-ocid="exam.input"
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            अवधि (मिनेटमा)
          </Label>
          <Input
            type="number"
            placeholder="45"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            विवरण (ऐच्छिक)
          </Label>
          <Input
            placeholder="परीक्षाको बारेमा संक्षिप्त विवरण..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Google Drive URL / PDF Link
          </Label>
          <Input
            placeholder="https://drive.google.com/file/d/..."
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          data-ocid="exam.submit_button"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold border-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "सेव गर्दैछ..." : "परीक्षा थप्नुहोस्"}
        </Button>
      </Card>
    </form>
  );
}

export default function Exam() {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<{
    title: string;
    urls: string[];
    duration: number;
  } | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: isAdmin } = useIsAdmin();
  const { exams: backendExams, addExam, isAdding } = useExamManagement();

  const {
    timeLeft: _timeLeft,
    formattedTime,
    startTimer,
    resetTimer,
  } = useCountdownTimer({
    onComplete: () => {
      setExamFinished(true);
      setPlaySound(true);
    },
  });

  const handleStartExam = (exam: {
    title: string;
    urls: string[];
    duration: number;
  }) => {
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

  const handleAddExam = async (
    title: string,
    duration: number,
    description: string,
    pdfUrl: string,
  ) => {
    try {
      await addExam({ title, duration: BigInt(duration), description, pdfUrl });
      toast.success("परीक्षा सफलतापूर्वक थपियो!");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      toast.error("परीक्षा थप्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
  };

  if (examFinished) {
    return (
      <div className="min-h-screen app-page-bg pb-20">
        <SoundPlayer play={playSound} onEnded={() => setPlaySound(false)} />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-6">
          <CheckCircle className="w-24 h-24 text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            परीक्षा समाप्त भयो!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            समय सकियो! परीक्षा पूरा गर्नुभएकोमा बधाई छ।
          </p>
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
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {selectedExam.title}
              </h1>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {formattedTime}
              </span>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            मक परीक्षा
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* Admin: Add Exam Button */}
        {isAdmin && (
          <div className="mb-2">
            <Button
              onClick={() => setShowAddForm((v) => !v)}
              data-ocid="exam.primary_button"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 border-0"
            >
              <Plus className="w-4 h-4 mr-2" />+ परीक्षा थप्नुहोस्
            </Button>
            {showAddForm && (
              <AddExamForm onSubmit={handleAddExam} isLoading={isAdding} />
            )}
          </div>
        )}

        {/* Static exam sets */}
        {examSets.map((exam) => (
          <Card
            key={exam.id}
            className={`p-6 ${exam.comingSoon ? "opacity-60" : "cursor-pointer hover:shadow-lg"} transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {exam.title}
                </h3>
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

        {/* Backend-added exams */}
        {(backendExams ?? []).map((exam, idx) => (
          <Card
            key={`backend-exam-${exam.title}`}
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            data-ocid={`exam.item.${idx + 1}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {exam.title}
                </h3>
                {exam.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {exam.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{Number(exam.duration)} मिनेट</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() =>
                  handleStartExam({
                    title: exam.title,
                    urls: [exam.pdfUrl],
                    duration: Number(exam.duration),
                  })
                }
              >
                परीक्षा सुरु गर्नुहोस्
              </Button>
            </div>
          </Card>
        ))}

        {examSets.length === 0 && (backendExams ?? []).length === 0 && (
          <Card
            className="p-8 text-center text-slate-500"
            data-ocid="exam.empty_state"
          >
            <p>कुनै परीक्षा उपलब्ध छैन।</p>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
