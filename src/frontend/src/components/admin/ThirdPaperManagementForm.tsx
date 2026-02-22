import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThirdPaperManagement } from '@/hooks/useThirdPaperManagement';
import { toast } from 'sonner';

export default function ThirdPaperManagementForm() {
  const {
    topics,
    videos,
    notes,
    deleteTopic,
    deleteVideo,
    deleteNote,
    isDeletingTopic,
    isDeletingVideo,
    isDeletingNote,
  } = useThirdPaperManagement();

  return (
    <Tabs defaultValue="topics" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="topics">Topics</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="topics" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Existing Topics ({topics?.length || 0})
          </h2>
          <div className="space-y-3">
            {topics?.map((topic, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {topic.title}
                  </h3>
                  {topic.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {topic.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this topic?')) {
                      deleteTopic(index).then(() => toast.success('Topic deleted!'));
                    }
                  }}
                  disabled={isDeletingTopic}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(!topics || topics.length === 0) && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No topics available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="videos" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Existing Videos ({videos?.length || 0})
          </h2>
          <div className="space-y-3">
            {videos?.map((video, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {video.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                    {video.youtubeUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this video?')) {
                      deleteVideo(index).then(() => toast.success('Video deleted!'));
                    }
                  }}
                  disabled={isDeletingVideo}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(!videos || videos.length === 0) && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No videos available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Existing Notes ({notes?.length || 0})
          </h2>
          <div className="space-y-3">
            {notes?.map((note, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {note.title}
                  </h3>
                  {note.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {note.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                    {note.driveUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this note?')) {
                      deleteNote(index).then(() => toast.success('Note deleted!'));
                    }
                  }}
                  disabled={isDeletingNote}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(!notes || notes.length === 0) && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No notes available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
