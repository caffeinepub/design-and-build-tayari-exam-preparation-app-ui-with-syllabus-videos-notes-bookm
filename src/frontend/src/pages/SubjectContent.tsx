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
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useSubjectBackend } from "@/hooks/useSubjectBackend";
import type { SubjectConfig } from "@/types/content";
import { filterVideosByKeyword } from "@/utils/videoSearch";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  FileText,
  Loader2,
  LogIn,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SubjectContentProps {
  config: SubjectConfig;
}

export default function SubjectContent({ config }: SubjectContentProps) {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [selectedNoteUrl, setSelectedNoteUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteUrl, setNoteUrl] = useState("");

  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const {
    isVideoBookmarked,
    toggleVideoBookmark,
    isNoteBookmarked,
    toggleNoteBookmark,
  } = useBookmarks();

  const backendData = useSubjectBackend(config.id);

  const noteId =
    config.notesUrl || (config.notesUrls && config.notesUrls.length > 0)
      ? `${config.id}-notes`
      : null;

  const staticNotesUrls =
    config.notesUrls && config.notesUrls.length > 0
      ? config.notesUrls
      : config.notesUrl
        ? [config.notesUrl]
        : [];

  const allStaticUrls =
    config.notesUrl && config.notesUrls && config.notesUrls.length > 0
      ? [config.notesUrl, ...config.notesUrls]
      : staticNotesUrls;

  const backendNotes = backendData.notes ?? [];
  const backendNotesUrls = backendNotes.map((n) => n.content);
  const allNotesUrls = [...allStaticUrls, ...backendNotesUrls];

  const filteredTopics = filterVideosByKeyword(config.topics, searchKeyword);
  const backendVideos = backendData.videos ?? [];

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      toast.error("शीर्षक र YouTube URL भर्नुहोस्");
      return;
    }
    try {
      await backendData.addVideo({
        title: videoTitle.trim(),
        youtubeUrl: videoUrl.trim(),
      });
      toast.success("भिडियो सफलतापूर्वक थपियो!");
      setShowAddVideoForm(false);
      setVideoTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      toast.error("भिडियो थप्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteUrl.trim()) {
      toast.error("शीर्षक र Google Drive URL भर्नुहोस्");
      return;
    }
    try {
      await backendData.addNote({
        title: noteTitle.trim(),
        content: noteUrl.trim(),
      });
      toast.success("नोट/PDF सफलतापूर्वक थपियो!");
      setShowAddNoteForm(false);
      setNoteTitle("");
      setNoteUrl("");
    } catch (err) {
      console.error(err);
      toast.error("नोट थप्न सकिएन। पुनः प्रयास गर्नुहोस्।");
    }
  };

  const getNoteLabel = (url: string, index: number) => {
    const backendNote = backendNotes.find((n) => n.content === url);
    if (backendNote) return backendNote.title;
    return `${config.title} - नोट ${index + 1}`;
  };

  const videoSection = (
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
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedVideo === video.youtubeUrl
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
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

      {/* Video Add Button — always visible, login required to submit */}
      <div className="pt-2">
        {!isLoggedIn ? (
          <Card className="p-3 flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <LogIn className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400 flex-1">
              भिडियो थप्न Login गर्नुहोस्
            </p>
            <Button
              size="sm"
              onClick={() => login()}
              data-ocid="subject.login.button"
              className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-xs"
            >
              Login
            </Button>
          </Card>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => setShowAddVideoForm((v) => !v)}
              data-ocid="subject.add_video.button"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 border-0 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />+ भिडियो थप्नुहोस्
            </Button>
            {showAddVideoForm && (
              <form onSubmit={handleAddVideo}>
                <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mt-3 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      भिडियो शीर्षक
                    </Label>
                    <Input
                      placeholder="भिडियोको शीर्षक लेख्नुहोस्..."
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
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
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      data-ocid="subject.video_url.input"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={backendData.isAddingVideo}
                    data-ocid="subject.add_video.submit_button"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold border-0"
                  >
                    {backendData.isAddingVideo ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {backendData.isAddingVideo ? "सेव गर्दैछ..." : "भिडियो थप्नुहोस्"}
                  </Button>
                </Card>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );

  const notesSection = (
    <div className="space-y-4">
      {noteId && (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleNoteBookmark(noteId, config.title)}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isNoteBookmarked(noteId) ? "fill-current text-emerald-600" : ""
              }`}
            />
          </Button>
        </div>
      )}

      {allNotesUrls.length > 0 ? (
        <div className="space-y-3">
          <div className="space-y-2">
            {allNotesUrls.map((url, idx) => (
              <Card
                key={url}
                className={`p-3 cursor-pointer transition-all hover:shadow-md flex items-center gap-3 ${
                  selectedNoteUrl === url
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
                onClick={() =>
                  setSelectedNoteUrl(selectedNoteUrl === url ? null : url)
                }
                data-ocid={`subject.item.${idx + 1}`}
              >
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">
                  {getNoteLabel(url, idx)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(url, "_blank");
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Card>
            ))}
          </div>

          {selectedNoteUrl && (
            <DriveViewer
              urls={[selectedNoteUrl]}
              title={getNoteLabel(
                selectedNoteUrl,
                allNotesUrls.indexOf(selectedNoteUrl),
              )}
            />
          )}
        </div>
      ) : (
        <Card
          className="p-8 text-center text-slate-600 dark:text-slate-400"
          data-ocid="subject.empty_state"
        >
          <p>यस विषयको लागि अहिलेसम्म कुनै नोटहरू उपलब्ध छैनन्।</p>
        </Card>
      )}

      {/* Note Add Button — always visible, login required to submit */}
      <div className="pt-2">
        {!isLoggedIn ? (
          <Card className="p-3 flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <LogIn className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400 flex-1">
              नोट थप्न Login गर्नुहोस्
            </p>
            <Button
              size="sm"
              onClick={() => login()}
              data-ocid="subject.login_note.button"
              className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-xs"
            >
              Login
            </Button>
          </Card>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => setShowAddNoteForm((v) => !v)}
              data-ocid="subject.add_note.button"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 border-0 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />+ नोट/PDF थप्नुहोस्
            </Button>
            {showAddNoteForm && (
              <form onSubmit={handleAddNote}>
                <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mt-3 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      नोटको शीर्षक
                    </Label>
                    <Input
                      placeholder="नोटको शीर्षक लेख्नुहोस्..."
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
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
                      value={noteUrl}
                      onChange={(e) => setNoteUrl(e.target.value)}
                      data-ocid="subject.note_url.input"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={backendData.isAddingNote}
                    data-ocid="subject.add_note.submit_button"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold border-0"
                  >
                    {backendData.isAddingNote ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {backendData.isAddingNote ? "सेव गर्दैछ..." : "नोट/PDF थप्नुहोस्"}
                  </Button>
                </Card>
              </form>
            )}
          </>
        )}
      </div>
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
                {videoSection}
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
                {notesSection}
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
              {videoSection}
            </TabsContent>
            <TabsContent value="notes" className="mt-6">
              {notesSection}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
