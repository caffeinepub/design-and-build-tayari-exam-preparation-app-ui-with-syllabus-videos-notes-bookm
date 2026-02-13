import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DriveViewer from '@/components/DriveViewer';
import { oldQuestionsData } from '@/content/oldQuestions';

export default function OldQuestions() {
  const navigate = useNavigate();
  const [selectedPaper, setSelectedPaper] = useState<{ title: string; urls: string[] } | null>(null);

  return (
    <div className="min-h-screen app-page-bg">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">पुराना प्रश्नहरू</h1>
        </div>
      </header>

      {selectedPaper ? (
        <div className="container mx-auto px-4 py-6">
          <Button variant="outline" onClick={() => setSelectedPaper(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            सूचीमा फर्कनुहोस्
          </Button>
          <DriveViewer urls={selectedPaper.urls} title={selectedPaper.title} />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="first" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="first">पहिलो पेपर</TabsTrigger>
              <TabsTrigger value="second">दोस्रो पेपर</TabsTrigger>
              <TabsTrigger value="third">तेस्रो पेपर</TabsTrigger>
            </TabsList>

            <TabsContent value="first" className="space-y-3 mt-6">
              {oldQuestionsData.firstPaper.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 ${item.comingSoon || !item.urls ? 'opacity-60' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  onClick={() => {
                    if (!item.comingSoon && item.urls) {
                      setSelectedPaper({ title: item.title, urls: item.urls });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                    {item.comingSoon && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">चाँडै आउँदैछ</span>
                    )}
                    {!item.comingSoon && !item.urls && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">लिंक कन्फिगर गरिएको छैन</span>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="second" className="space-y-3 mt-6">
              {oldQuestionsData.secondPaper.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 ${item.comingSoon ? 'opacity-60' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  onClick={() => {
                    if (!item.comingSoon && item.urls) {
                      setSelectedPaper({ title: item.title, urls: item.urls });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                    {item.comingSoon && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">चाँडै आउँदैछ</span>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="third" className="space-y-3 mt-6">
              {oldQuestionsData.thirdPaper.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 ${item.comingSoon ? 'opacity-60' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  onClick={() => {
                    if (!item.comingSoon && item.urls) {
                      setSelectedPaper({ title: item.title, urls: item.urls });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                    {item.comingSoon && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">चाँडै आउँदैछ</span>
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
}
