import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Bookmark, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import YouTubePlayer from '@/components/YouTubePlayer';
import TopicVideoList from '@/components/TopicVideoList';
import DriveViewer from '@/components/DriveViewer';
import { useBookmarks } from '@/hooks/useBookmarks';
import { SubjectConfig } from '@/types/content';
import { filterVideosByKeyword } from '@/utils/videoSearch';

interface SubjectContentProps {
  config: SubjectConfig;
}

export default function SubjectContent({ config }: SubjectContentProps) {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { isVideoBookmarked, toggleVideoBookmark, isNoteBookmarked, toggleNoteBookmark } = useBookmarks();

  const noteId = config.notesUrl ? `${config.id}-notes` : null;
  const filteredTopics = filterVideosByKeyword(config.topics, searchKeyword);

  return (
    <div className="min-h-screen app-page-bg">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{config.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
            <ResizablePanel defaultSize={62} minSize={40}>
              <div className="h-full p-6 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">भिडियोहरू</h2>
                </div>
                {/* Search Input */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="भिडियो खोज्नुहोस्..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-6">
                  {selectedVideo && (
                    <div className="mb-6">
                      <YouTubePlayer url={selectedVideo} />
                    </div>
                  )}
                  {filteredTopics.length === 0 ? (
                    <Card className="p-8 text-center text-slate-600 dark:text-slate-400">
                      <p>कुनै भिडियो भेटिएन।</p>
                    </Card>
                  ) : (
                    <TopicVideoList
                      topics={filteredTopics}
                      onVideoSelect={setSelectedVideo}
                      selectedVideo={selectedVideo}
                      isVideoBookmarked={isVideoBookmarked}
                      toggleVideoBookmark={toggleVideoBookmark}
                    />
                  )}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={38} minSize={30}>
              <div className="h-full p-6 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">नोटहरू</h2>
                  {noteId && config.notesUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNoteBookmark(noteId, config.title)}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isNoteBookmarked(noteId) ? 'fill-current text-emerald-600' : ''}`}
                      />
                    </Button>
                  )}
                </div>
                {config.notesUrl ? (
                  <DriveViewer urls={[config.notesUrl]} title={`${config.title} नोटहरू`} />
                ) : (
                  <Card className="p-8 text-center text-slate-600 dark:text-slate-400">
                    <p>यस विषयको लागि अहिलेसम्म कुनै नोटहरू उपलब्ध छैनन्।</p>
                  </Card>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos">भिडियोहरू</TabsTrigger>
              <TabsTrigger value="notes">नोटहरू</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="space-y-6 mt-6">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="भिडियो खोज्नुहोस्..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedVideo && (
                <div className="mb-6">
                  <YouTubePlayer url={selectedVideo} />
                </div>
              )}
              {filteredTopics.length === 0 ? (
                <Card className="p-8 text-center text-slate-600 dark:text-slate-400">
                  <p>कुनै भिडियो भेटिएन।</p>
                </Card>
              ) : (
                <TopicVideoList
                  topics={filteredTopics}
                  onVideoSelect={setSelectedVideo}
                  selectedVideo={selectedVideo}
                  isVideoBookmarked={isVideoBookmarked}
                  toggleVideoBookmark={toggleVideoBookmark}
                />
              )}
            </TabsContent>
            <TabsContent value="notes" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                {noteId && config.notesUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNoteBookmark(noteId, config.title)}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isNoteBookmarked(noteId) ? 'fill-current text-emerald-600' : ''}`}
                    />
                  </Button>
                )}
              </div>
              {config.notesUrl ? (
                <DriveViewer urls={[config.notesUrl]} title={`${config.title} नोटहरू`} />
              ) : (
                <Card className="p-8 text-center text-slate-600 dark:text-slate-400">
                  <p>यस विषयको लागि अहिलेसम्म कुनै नोटहरू उपलब्ध छैनन्।</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
