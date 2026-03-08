import DriveViewer from "@/components/DriveViewer";
import TopicVideoList from "@/components/TopicVideoList";
import YouTubePlayer from "@/components/YouTubePlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useIsAdmin } from "@/hooks/useQueries";
import { useSubjectBackend } from "@/hooks/useSubjectBackend";
import type { SubjectConfig } from "@/types/content";
import { filterVideosByKeyword } from "@/utils/videoSearch";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SubjectContentProps {
  config: SubjectConfig;
}

function AddVideoForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (title: string, url: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error("शीर्षक र YouTube URL भर्नुहोस्");
      return;
    }
    await onSubmit(title.trim(), url.trim());
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mt-3 space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            भिडियो शीर्षक
          </Label>
          <Input
            placeholder="भिडियोको शीर्षक लेख्नुहोस्..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-ocid="subject.video_title.input"
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            YouTube URL
          </Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            data-ocid="subject.video_url.input"
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          data-ocid="subject.add_video.submit_button"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold border-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "सेव गर्दैछ..." : "भिडियो थप्नुहोस्"}
        </Button>
      </Card>
    </form>
  );
}

function AddNoteForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (title: string, url: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.error("शीर्षक र Google Drive URL भर्नुहोस्");
      return;
    }
    await onSubmit(title.trim(), url.trim());
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mt-3 space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            नोटको शीर्षक
          </Label>
          <Input
            placeholder="नोटको शीर्षक लेख्नुहोस्..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-ocid="subject.note_title.input"
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Google Drive URL / PDF Link
          </Label>
          <Input
            placeholder="https://drive.google.com/file/d/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            data-ocid="subject.note_url.input"
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          data-ocid="subject.add_note.submit_button"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold border-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "सेव गर्दैछ..." : "नोट/PDF थप्नुहोस्"}
        </Button>
      </Card>
    </form>
  );
}

export default function SubjectContent({ config }: SubjectContentProps) {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);

  const {
    isVideoBookmarked,
    toggleVideoBookmark,
    isNoteBookmarked,
    toggleNoteBookmark,
  } = useBookmarks();

  const { data: isAdmin } = useIsAdmin();
  const backendData = useSubjectBackend(config.id);

  const noteId =
    config.notesUrl || (config.notesUrls && config.notesUrls.length > 0)
      ? `${config.id}-notes`
      : null;

  // Combine static notes URLs with backend notes (using content field as URL)
  const staticNotesUrls =
    config.notesUrls && config.notesUrls.length > 0
      ? config.notesUrls
      : config.notesUrl
        ? [config.notesUrl]
        : [];

  const backendNotesUrls = (backendData.notes ?? []).map((n) => n.content);
  const allNotesUrls = [...staticNotesUrls, ...backendNotesUrls];

  const filteredTopics = filterVideosByKeyword(config.topics, searchKeyword);

  // Backend videos as additional topics
  const backendVideos = backendData.videos ?? [];

  const handleAddVideo = async (title: string, url: string) => {
    try {
      await backendData.addVideo({ title, youtubeUrl: url });
      toast.success("भिडियो सफलतापूर्वक थपियो!");
      setShowAddVideoForm(false);
    } catch (err) {
      console.error(err);
      toast.error("भिडियो थप्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
  };

  const handleAddNote = async (title: string, url: string) => {
    try {
      await backendData.addNote({ title, content: url });
      toast.success("नोट/PDF सफलतापूर्वक थपियो!");
      setShowAddNoteForm(false);
    } catch (err) {
      console.error(err);
      toast.error("नोट थप्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
  };

  const VideoSection = () => (
    <div className="space-y-6">
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
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <YouTubePlayer url={selectedVideo} />
        </div>
      )}

      {filteredTopics.length === 0 && backendVideos.length === 0 ? (
        <Card
          className="p-8 text-center text-slate-600 dark:text-slate-400"
          data-ocid="subject.empty_state"
        >
          <p>कुनै भिडियो भेटिएन।</p>
        </Card>
      ) : (
        <>
          {filteredTopics.length > 0 && (
            <TopicVideoList
              topics={filteredTopics}
              onVideoSelect={setSelectedVideo}
              selectedVideo={selectedVideo}
              isVideoBookmarked={isVideoBookmarked}
              toggleVideoBookmark={toggleVideoBookmark}
            />
          )}

          {/* Backend-added videos */}
          {backendVideos.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                अतिरिक्त भिडियोहरू
              </h3>
              <div className="space-y-2">
                {backendVideos.map((video, idx) => (
                  <Card
                    key={`backend-video-${video.title}-${idx}`}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${selectedVideo === video.youtubeUrl ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"}`}
                    onClick={() => setSelectedVideo(video.youtubeUrl)}
                    data-ocid={`subject.item.${idx + 1}`}
                  >
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {video.title}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Admin: Add Video Button */}
      {isAdmin && (
        <div className="pt-2">
          <Button
            onClick={() => setShowAddVideoForm((v) => !v)}
            data-ocid="subject.add_video.button"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 border-0"
          >
            <Plus className="w-4 h-4 mr-2" />+ भिडियो थप्नुहोस्
          </Button>
          {showAddVideoForm && (
            <AddVideoForm
              onSubmit={handleAddVideo}
              isLoading={backendData.isAddingVideo}
            />
          )}
        </div>
      )}
    </div>
  );

  const NotesSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {noteId && config.notesUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleNoteBookmark(noteId, config.title)}
          >
            <Bookmark
              className={`w-4 h-4 ${isNoteBookmarked(noteId) ? "fill-current text-emerald-600" : ""}`}
            />
          </Button>
        )}
      </div>

      {allNotesUrls.length > 0 ? (
        <DriveViewer urls={allNotesUrls} title={`${config.title} नोटहरू`} />
      ) : (
        <Card
          className="p-8 text-center text-slate-600 dark:text-slate-400"
          data-ocid="subject.empty_state"
        >
          <p>यस विषयको लागि अहिलेसम्म कुनै नोटहरू उपलब्ध छैनन्।</p>
        </Card>
      )}

      {/* Admin: Add Note Button */}
      {isAdmin && (
        <div className="pt-2">
          <Button
            onClick={() => setShowAddNoteForm((v) => !v)}
            data-ocid="subject.add_note.button"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 border-0"
          >
            <Plus className="w-4 h-4 mr-2" />+ नोट/PDF थप्नुहोस्
          </Button>
          {showAddNoteForm && (
            <AddNoteForm
              onSubmit={handleAddNote}
              isLoading={backendData.isAddingNote}
            />
          )}
        </div>
      )}
    </div>
  );

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
            {config.title}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[600px] rounded-lg border"
          >
            <ResizablePanel defaultSize={62} minSize={40}>
              <div className="h-full p-6 bg-white dark:bg-slate-900 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    भिडियोहरू
                  </h2>
                </div>
                <VideoSection />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={38} minSize={30}>
              <div className="h-full p-6 bg-slate-50 dark:bg-slate-800 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    नोटहरू
                  </h2>
                </div>
                <NotesSection />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos" data-ocid="subject.tab">
                भिडियोहरू
              </TabsTrigger>
              <TabsTrigger value="notes" data-ocid="subject.tab">
                नोटहरू
              </TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="space-y-6 mt-6">
              <VideoSection />
            </TabsContent>
            <TabsContent value="notes" className="mt-6">
              <NotesSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
