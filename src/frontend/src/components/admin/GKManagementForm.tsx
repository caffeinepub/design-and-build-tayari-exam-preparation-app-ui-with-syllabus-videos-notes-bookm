import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGKManagement } from '@/hooks/useGKManagement';
import { toast } from 'sonner';

export default function GKManagementForm() {
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const {
    topics,
    videos,
    addTopic,
    deleteTopic,
    addVideo,
    deleteVideo,
    isAddingTopic,
    isAddingVideo,
    isDeletingTopic,
    isDeletingVideo,
  } = useGKManagement();

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTopic({ title: topicTitle, description: topicDescription });
      toast.success('GK topic added successfully!');
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
      toast.success('GK video added successfully!');
      setVideoTitle('');
      setVideoDescription('');
      setYoutubeUrl('');
    } catch (error) {
      toast.error('Failed to add video');
      console.error(error);
    }
  };

  const handleDeleteTopic = async (index: number) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(index);
        toast.success('Topic deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete topic');
        console.error(error);
      }
    }
  };

  const handleDeleteVideo = async (index: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(index);
        toast.success('Video deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete video');
        console.error(error);
      }
    }
  };

  return (
    <Tabs defaultValue="topics" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="topics">Topics</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
      </TabsList>

      <TabsContent value="topics" className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Add GK Topic
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
                  onClick={() => handleDeleteTopic(index)}
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
            Add GK Video
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
                  onClick={() => handleDeleteVideo(index)}
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
    </Tabs>
  );
}
