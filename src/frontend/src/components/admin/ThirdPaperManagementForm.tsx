import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThirdPaperManagement } from '@/hooks/useThirdPaperManagement';
import { toast } from 'sonner';

export default function ThirdPaperManagementForm() {
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [driveUrl, setDriveUrl] = useState('');

  const {
    topics,
    videos,
    notes,
    addTopic,
    deleteTopic,
    addVideo,
    deleteVideo,
    addNote,
    deleteNote,
    isAddingTopic,
    isAddingVideo,
    isAddingNote,
    isDeletingTopic,
    isDeletingVideo,
    isDeletingNote,
  } = useThirdPaperManagement();

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTopic({ title: topicTitle, description: topicDescription });
      toast.success('Third Paper topic added successfully!');
      setTopicTitle('');
      setTopicDescription('');
    } catch (error) {
      toast.error('Failed to add topic');
      console.error(error);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVideo({ title: videoTitle, description: videoDescription, youtubeUrl });
      toast.success('Third Paper video added successfully!');
      setVideoTitle('');
      setVideoDescription('');
      setYoutubeUrl('');
    } catch (error) {
      toast.error('Failed to add video');
      console.error(error);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNote({ title: noteTitle, description: noteDescription, driveUrl });
      toast.success('Third Paper note added successfully!');
      setNoteTitle('');
      setNoteDescription('');
      setDriveUrl('');
    } catch (error) {
      toast.error('Failed to add note');
      console.error(error);
    }
  };

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
            Add Third Paper Topic
          </h2>
          <form onSubmit={handleAddTopic} className="space-y-4">
            <div>
              <Label htmlFor="topic-title">शीर्षक (Title)</Label>
              <Input
                id="topic-title"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Enter topic title"
                required
              />
            </div>
            <div>
              <Label htmlFor="topic-description">विवरण (Description)</Label>
              <Textarea
                id="topic-description"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                placeholder="Enter topic description"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={isAddingTopic} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {isAddingTopic ? 'Adding...' : 'Add Topic'}
            </Button>
          </form>
        </Card>

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
                No topics yet. Add your first topic above.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="videos" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Add Third Paper Video
          </h2>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div>
              <Label htmlFor="video-title">शीर्षक (Title)</Label>
              <Input
                id="video-title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>
            <div>
              <Label htmlFor="video-description">विवरण (Description)</Label>
              <Textarea
                id="video-description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Enter video description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtu.be/..."
                required
              />
            </div>
            <Button type="submit" disabled={isAddingVideo} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {isAddingVideo ? 'Adding...' : 'Add Video'}
            </Button>
          </form>
        </Card>

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
                No videos yet. Add your first video above.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Add Third Paper Note
          </h2>
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <Label htmlFor="note-title">शीर्षक (Title)</Label>
              <Input
                id="note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter note title"
                required
              />
            </div>
            <div>
              <Label htmlFor="note-description">विवरण (Description)</Label>
              <Textarea
                id="note-description"
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                placeholder="Enter note description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="drive-url">Google Drive URL</Label>
              <Input
                id="drive-url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                required
              />
            </div>
            <Button type="submit" disabled={isAddingNote} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {isAddingNote ? 'Adding...' : 'Add Note'}
            </Button>
          </form>
        </Card>

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
                No notes yet. Add your first note above.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
