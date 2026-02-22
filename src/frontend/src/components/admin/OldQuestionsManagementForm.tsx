import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOldQuestionsManagement } from '@/hooks/useOldQuestionsManagement';
import { toast } from 'sonner';

export default function OldQuestionsManagementForm() {
  const { questions, addQuestion, deleteQuestion, isAdding, isDeleting } = useOldQuestionsManagement();

  const [showFirstForm, setShowFirstForm] = useState(false);
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [showThirdForm, setShowThirdForm] = useState(false);

  const [firstFormData, setFirstFormData] = useState({ title: '', pdfUrl: '', year: '' });
  const [secondFormData, setSecondFormData] = useState({ title: '', pdfUrl: '', year: '' });
  const [thirdFormData, setThirdFormData] = useState({ title: '', pdfUrl: '', year: '' });

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this question paper?')) {
      try {
        await deleteQuestion(index);
        toast.success('Question paper deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete question paper');
        console.error(error);
      }
    }
  };

  const handleSubmitFirst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstFormData.title.trim() || !firstFormData.pdfUrl.trim() || !firstFormData.year) {
      toast.error('All fields are required');
      return;
    }

    // Validate Google Drive URL
    if (!firstFormData.pdfUrl.includes('drive.google.com')) {
      toast.error('Please enter a valid Google Drive URL');
      return;
    }

    try {
      await addQuestion({
        title: firstFormData.title,
        paperType: 'First',
        pdfUrl: firstFormData.pdfUrl,
        year: BigInt(firstFormData.year),
      });
      toast.success('Question paper added successfully!');
      setFirstFormData({ title: '', pdfUrl: '', year: '' });
      setShowFirstForm(false);
    } catch (error) {
      toast.error('Failed to add question paper');
      console.error(error);
    }
  };

  const handleSubmitSecond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secondFormData.title.trim() || !secondFormData.pdfUrl.trim() || !secondFormData.year) {
      toast.error('All fields are required');
      return;
    }

    // Validate Google Drive URL
    if (!secondFormData.pdfUrl.includes('drive.google.com')) {
      toast.error('Please enter a valid Google Drive URL');
      return;
    }

    try {
      await addQuestion({
        title: secondFormData.title,
        paperType: 'Second',
        pdfUrl: secondFormData.pdfUrl,
        year: BigInt(secondFormData.year),
      });
      toast.success('Question paper added successfully!');
      setSecondFormData({ title: '', pdfUrl: '', year: '' });
      setShowSecondForm(false);
    } catch (error) {
      toast.error('Failed to add question paper');
      console.error(error);
    }
  };

  const handleSubmitThird = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thirdFormData.title.trim() || !thirdFormData.pdfUrl.trim() || !thirdFormData.year) {
      toast.error('All fields are required');
      return;
    }

    // Validate Google Drive URL
    if (!thirdFormData.pdfUrl.includes('drive.google.com')) {
      toast.error('Please enter a valid Google Drive URL');
      return;
    }

    try {
      await addQuestion({
        title: thirdFormData.title,
        paperType: 'Third',
        pdfUrl: thirdFormData.pdfUrl,
        year: BigInt(thirdFormData.year),
      });
      toast.success('Question paper added successfully!');
      setThirdFormData({ title: '', pdfUrl: '', year: '' });
      setShowThirdForm(false);
    } catch (error) {
      toast.error('Failed to add question paper');
      console.error(error);
    }
  };

  const firstPaperQuestions = questions?.filter((q) => q.paperType === 'First') || [];
  const secondPaperQuestions = questions?.filter((q) => q.paperType === 'Second') || [];
  const thirdPaperQuestions = questions?.filter((q) => q.paperType === 'Third') || [];

  return (
    <Tabs defaultValue="first" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="first">First Paper</TabsTrigger>
        <TabsTrigger value="second">Second Paper</TabsTrigger>
        <TabsTrigger value="third">Third Paper</TabsTrigger>
      </TabsList>

      <TabsContent value="first" className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              First Paper Questions ({firstPaperQuestions.length})
            </h2>
            <Button
              onClick={() => setShowFirstForm(!showFirstForm)}
              variant={showFirstForm ? 'outline' : 'default'}
              size="default"
              className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showFirstForm ? 'Cancel' : 'Add Question'}
            </Button>
          </div>

          {showFirstForm && (
            <form onSubmit={handleSubmitFirst} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
              <div>
                <Label htmlFor="first-title">Title *</Label>
                <Input
                  id="first-title"
                  value={firstFormData.title}
                  onChange={(e) => setFirstFormData({ ...firstFormData, title: e.target.value })}
                  placeholder="Enter question paper title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="first-year">Year *</Label>
                <Input
                  id="first-year"
                  type="number"
                  value={firstFormData.year}
                  onChange={(e) => setFirstFormData({ ...firstFormData, year: e.target.value })}
                  placeholder="Enter year (e.g., 2078)"
                  required
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <Label htmlFor="first-url">Google Drive URL *</Label>
                <Input
                  id="first-url"
                  value={firstFormData.pdfUrl}
                  onChange={(e) => setFirstFormData({ ...firstFormData, pdfUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Question'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowFirstForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {firstPaperQuestions.map((question, index) => {
              const actualIndex = questions?.findIndex((q) => q === question) ?? -1;
              return (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {question.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Year: {question.year.toString()}
                    </p>
                    <a
                      href={question.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block truncate"
                    >
                      {question.pdfUrl}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(actualIndex)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {firstPaperQuestions.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No question papers available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="second" className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Second Paper Questions ({secondPaperQuestions.length})
            </h2>
            <Button
              onClick={() => setShowSecondForm(!showSecondForm)}
              variant={showSecondForm ? 'outline' : 'default'}
              size="default"
              className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showSecondForm ? 'Cancel' : 'Add Question'}
            </Button>
          </div>

          {showSecondForm && (
            <form onSubmit={handleSubmitSecond} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
              <div>
                <Label htmlFor="second-title">Title *</Label>
                <Input
                  id="second-title"
                  value={secondFormData.title}
                  onChange={(e) => setSecondFormData({ ...secondFormData, title: e.target.value })}
                  placeholder="Enter question paper title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="second-year">Year *</Label>
                <Input
                  id="second-year"
                  type="number"
                  value={secondFormData.year}
                  onChange={(e) => setSecondFormData({ ...secondFormData, year: e.target.value })}
                  placeholder="Enter year (e.g., 2078)"
                  required
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <Label htmlFor="second-url">Google Drive URL *</Label>
                <Input
                  id="second-url"
                  value={secondFormData.pdfUrl}
                  onChange={(e) => setSecondFormData({ ...secondFormData, pdfUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Question'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowSecondForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {secondPaperQuestions.map((question, index) => {
              const actualIndex = questions?.findIndex((q) => q === question) ?? -1;
              return (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {question.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Year: {question.year.toString()}
                    </p>
                    <a
                      href={question.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block truncate"
                    >
                      {question.pdfUrl}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(actualIndex)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {secondPaperQuestions.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No question papers available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="third" className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Third Paper Questions ({thirdPaperQuestions.length})
            </h2>
            <Button
              onClick={() => setShowThirdForm(!showThirdForm)}
              variant={showThirdForm ? 'outline' : 'default'}
              size="default"
              className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showThirdForm ? 'Cancel' : 'Add Question'}
            </Button>
          </div>

          {showThirdForm && (
            <form onSubmit={handleSubmitThird} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
              <div>
                <Label htmlFor="third-title">Title *</Label>
                <Input
                  id="third-title"
                  value={thirdFormData.title}
                  onChange={(e) => setThirdFormData({ ...thirdFormData, title: e.target.value })}
                  placeholder="Enter question paper title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="third-year">Year *</Label>
                <Input
                  id="third-year"
                  type="number"
                  value={thirdFormData.year}
                  onChange={(e) => setThirdFormData({ ...thirdFormData, year: e.target.value })}
                  placeholder="Enter year (e.g., 2078)"
                  required
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <Label htmlFor="third-url">Google Drive URL *</Label>
                <Input
                  id="third-url"
                  value={thirdFormData.pdfUrl}
                  onChange={(e) => setThirdFormData({ ...thirdFormData, pdfUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Question'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowThirdForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {thirdPaperQuestions.map((question, index) => {
              const actualIndex = questions?.findIndex((q) => q === question) ?? -1;
              return (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {question.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Year: {question.year.toString()}
                    </p>
                    <a
                      href={question.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block truncate"
                    >
                      {question.pdfUrl}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(actualIndex)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {thirdPaperQuestions.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No question papers available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
