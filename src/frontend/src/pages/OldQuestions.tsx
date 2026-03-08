import DriveViewer from "@/components/DriveViewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { oldQuestionsData } from "@/content/oldQuestions";
import { useOldQuestionsManagement } from "@/hooks/useOldQuestionsManagement";
import { useIsAdmin } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddQuestionForm({
  defaultPaperType,
  onSubmit,
  isLoading,
}: {
  defaultPaperType: string;
  onSubmit: (
    title: string,
    year: number,
    paperType: string,
    pdfUrl: string,
  ) => Promise<void>;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [paperType, setPaperType] = useState(defaultPaperType);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !year.trim() || !pdfUrl.trim()) {
      toast.error("सबै फिल्ड भर्नुहोस्");
      return;
    }
    const yearNum = Number.parseInt(year, 10);
    if (Number.isNaN(yearNum)) {
      toast.error("सही वर्ष नम्बर राख्नुहोस्");
      return;
    }
    await onSubmit(title.trim(), yearNum, paperType, pdfUrl.trim());
    setTitle("");
    setYear("");
    setPdfUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mt-3 space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            शीर्षक
          </Label>
          <Input
            placeholder="प्रश्नपत्रको शीर्षक..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-ocid="old_questions.input"
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            वर्ष (Year)
          </Label>
          <Input
            type="number"
            placeholder="2080"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            पेपर प्रकार
          </Label>
          <Select value={paperType} onValueChange={setPaperType}>
            <SelectTrigger
              data-ocid="old_questions.select"
              className="bg-white dark:bg-slate-900"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">पहिलो पेपर</SelectItem>
              <SelectItem value="second">दोस्रो पेपर</SelectItem>
              <SelectItem value="third">तेस्रो पेपर</SelectItem>
            </SelectContent>
          </Select>
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
          data-ocid="old_questions.submit_button"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold border-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "सेव गर्दैछ..." : "प्रश्नपत्र थप्नुहोस्"}
        </Button>
      </Card>
    </form>
  );
}

export default function OldQuestions() {
  const navigate = useNavigate();
  const [selectedPaper, setSelectedPaper] = useState<{
    title: string;
    urls: string[];
  } | null>(null);

  const [showAddFirst, setShowAddFirst] = useState(false);
  const [showAddSecond, setShowAddSecond] = useState(false);
  const [showAddThird, setShowAddThird] = useState(false);

  const { data: isAdmin } = useIsAdmin();
  const {
    questions: backendQuestions,
    addQuestion,
    isAdding,
  } = useOldQuestionsManagement();

  const backendFirst = (backendQuestions ?? []).filter(
    (q) => q.paperType === "first",
  );
  const backendSecond = (backendQuestions ?? []).filter(
    (q) => q.paperType === "second",
  );
  const backendThird = (backendQuestions ?? []).filter(
    (q) => q.paperType === "third",
  );

  const handleAddQuestion = async (
    title: string,
    year: number,
    paperType: string,
    pdfUrl: string,
  ) => {
    try {
      await addQuestion({ title, year: BigInt(year), paperType, pdfUrl });
      toast.success("प्रश्नपत्र सफलतापूर्वक थपियो!");
      setShowAddFirst(false);
      setShowAddSecond(false);
      setShowAddThird(false);
    } catch (err) {
      console.error(err);
      toast.error("प्रश्नपत्र थप्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
  };

  return (
    <div className="min-h-screen app-page-bg">
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
            पुराना प्रश्नहरू
          </h1>
        </div>
      </header>

      {selectedPaper ? (
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="outline"
            onClick={() => setSelectedPaper(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            सूचीमा फर्कनुहोस्
          </Button>
          <DriveViewer urls={selectedPaper.urls} title={selectedPaper.title} />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="first" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="first" data-ocid="old_questions.tab">
                पहिलो पेपर
              </TabsTrigger>
              <TabsTrigger value="second" data-ocid="old_questions.tab">
                दोस्रो पेपर
              </TabsTrigger>
              <TabsTrigger value="third" data-ocid="old_questions.tab">
                तेस्रो पेपर
              </TabsTrigger>
            </TabsList>

            {/* First Paper */}
            <TabsContent value="first" className="space-y-3 mt-6">
              {/* Admin Add Button */}
              {isAdmin && (
                <div className="mb-3">
                  <Button
                    onClick={() => setShowAddFirst((v) => !v)}
                    data-ocid="old_questions.primary_button"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 border-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />+ प्रश्नपत्र थप्नुहोस्
                  </Button>
                  {showAddFirst && (
                    <AddQuestionForm
                      defaultPaperType="first"
                      onSubmit={handleAddQuestion}
                      isLoading={isAdding}
                    />
                  )}
                </div>
              )}

              {oldQuestionsData.firstPaper.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 ${item.comingSoon || !item.urls ? "opacity-60" : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  onClick={() => {
                    if (!item.comingSoon && item.urls) {
                      setSelectedPaper({ title: item.title, urls: item.urls });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h3>
                    {item.comingSoon && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        चाँडै आउँदैछ
                      </span>
                    )}
                    {!item.comingSoon && !item.urls && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        लिंक कन्फिगर गरिएको छैन
                      </span>
                    )}
                  </div>
                </Card>
              ))}

              {/* Backend questions for first paper */}
              {backendFirst.map((q, idx) => (
                <Card
                  key={`backend-first-${q.title}-${String(q.year)}`}
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() =>
                    setSelectedPaper({ title: q.title, urls: [q.pdfUrl] })
                  }
                  data-ocid={`old_questions.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {q.title}
                    </h3>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      {Number(q.year)} BS
                    </span>
                  </div>
                </Card>
              ))}

              {oldQuestionsData.firstPaper.length === 0 &&
                backendFirst.length === 0 && (
                  <Card
                    className="p-8 text-center text-slate-500"
                    data-ocid="old_questions.empty_state"
                  >
                    <p>कुनै प्रश्नपत्र उपलब्ध छैन।</p>
                  </Card>
                )}
            </TabsContent>

            {/* Second Paper */}
            <TabsContent value="second" className="space-y-3 mt-6">
              {/* Admin Add Button */}
              {isAdmin && (
                <div className="mb-3">
                  <Button
                    onClick={() => setShowAddSecond((v) => !v)}
                    data-ocid="old_questions.primary_button"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 border-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />+ प्रश्नपत्र थप्नुहोस्
                  </Button>
                  {showAddSecond && (
                    <AddQuestionForm
                      defaultPaperType="second"
                      onSubmit={handleAddQuestion}
                      isLoading={isAdding}
                    />
                  )}
                </div>
              )}

              {oldQuestionsData.secondPaper.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 ${item.comingSoon ? "opacity-60" : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  onClick={() => {
                    if (!item.comingSoon && item.urls) {
                      setSelectedPaper({ title: item.title, urls: item.urls });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h3>
                    {item.comingSoon && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        चाँडै आउँदैछ
                      </span>
                    )}
                  </div>
                </Card>
              ))}

              {/* Backend questions for second paper */}
              {backendSecond.map((q, idx) => (
                <Card
                  key={`backend-second-${q.title}-${String(q.year)}`}
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() =>
                    setSelectedPaper({ title: q.title, urls: [q.pdfUrl] })
                  }
                  data-ocid={`old_questions.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {q.title}
                    </h3>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      {Number(q.year)} BS
                    </span>
                  </div>
                </Card>
              ))}

              {oldQuestionsData.secondPaper.length === 0 &&
                backendSecond.length === 0 && (
                  <Card
                    className="p-8 text-center text-slate-500"
                    data-ocid="old_questions.empty_state"
                  >
                    <p>कुनै प्रश्नपत्र उपलब्ध छैन।</p>
                  </Card>
                )}
            </TabsContent>

            {/* Third Paper */}
            <TabsContent value="third" className="space-y-3 mt-6">
              {/* Admin Add Button */}
              {isAdmin && (
                <div className="mb-3">
                  <Button
                    onClick={() => setShowAddThird((v) => !v)}
                    data-ocid="old_questions.primary_button"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 border-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />+ प्रश्नपत्र थप्नुहोस्
                  </Button>
                  {showAddThird && (
                    <AddQuestionForm
                      defaultPaperType="third"
                      onSubmit={handleAddQuestion}
                      isLoading={isAdding}
                    />
                  )}
                </div>
              )}

              {oldQuestionsData.thirdPaper.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 ${item.comingSoon ? "opacity-60" : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  onClick={() => {
                    if (!item.comingSoon && item.urls) {
                      setSelectedPaper({ title: item.title, urls: item.urls });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h3>
                    {item.comingSoon && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        चाँडै आउँदैछ
                      </span>
                    )}
                  </div>
                </Card>
              ))}

              {/* Backend questions for third paper */}
              {backendThird.map((q, idx) => (
                <Card
                  key={`backend-third-${q.title}-${String(q.year)}`}
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() =>
                    setSelectedPaper({ title: q.title, urls: [q.pdfUrl] })
                  }
                  data-ocid={`old_questions.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {q.title}
                    </h3>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      {Number(q.year)} BS
                    </span>
                  </div>
                </Card>
              ))}

              {oldQuestionsData.thirdPaper.length === 0 &&
                backendThird.length === 0 && (
                  <Card
                    className="p-8 text-center text-slate-500"
                    data-ocid="old_questions.empty_state"
                  >
                    <p>कुनै प्रश्नपत्र उपलब्ध छैन।</p>
                  </Card>
                )}
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
}
