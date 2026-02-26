import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIQManagement } from '@/hooks/useIQManagement';
import { toast } from 'sonner';

export default function IQManagementForm() {
  const {
    categories,
    videos,
    notes,
    addCategory,
    addVideo,
    addNote,
    deleteCategory,
    deleteVideo,
    isAddingCategory,
    isAddingVideo,
    isAddingNote,
    isDeletingCategory,
    isDeletingVideo,
  } = useIQManagement();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({ title: '', description: '' });
  const [videoFormData, setVideoFormData] = useState({ title: '', youtubeUrl: '' });
  const [noteFormData, setNoteFormData] = useState({ title: '', content: '' });

  const handleDeleteCategory = async (index: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(index);
        toast.success('Category deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete category');
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

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await addCategory(categoryFormData);
      toast.success('Category added successfully!');
      setCategoryFormData({ title: '', description: '' });
      setShowCategoryForm(false);
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFormData.title.trim() || !videoFormData.youtubeUrl.trim()) {
      toast.error('Title and YouTube URL are required');
      return;
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(videoFormData.youtubeUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    try {
      await addVideo(videoFormData);
      toast.success('Video added successfully!');
      setVideoFormData({ title: '', youtubeUrl: '' });
      setShowVideoForm(false);
    } catch (error) {
      toast.error('Failed to add video');
      console.error(error);
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteFormData.title.trim() || !noteFormData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      await addNote(noteFormData);
      toast.success('Note added successfully!');
      setNoteFormData({ title: '', content: '' });
      setShowNoteForm(false);
    } catch (error) {
      toast.error('Failed to add note');
      console.error(error);
    }
  };

  return (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="categories" className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              IQ Categories ({categories?.length || 0})
            </h2>
            <Button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              variant={showCategoryForm ? 'outline' : 'default'}
              size="default"
              className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCategoryForm ? 'Cancel' : 'Add Category'}
            </Button>
          </div>

          {showCategoryForm && (
            <form onSubmit={handleSubmitCategory} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
              <div>
                <Label htmlFor="category-title">Title *</Label>
                <Input
                  id="category-title"
                  value={categoryFormData.title}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                  placeholder="Enter category title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAddingCategory}>
                  {isAddingCategory ? 'Adding...' : 'Add Category'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCategoryForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {categories?.map((category, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(index)}
                  disabled={isDeletingCategory}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(!categories || categories.length === 0) && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No categories available.
              </p>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="videos" className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              IQ Videos ({videos?.length || 0})
            </h2>
            <Button
              onClick={() => setShowVideoForm(!showVideoForm)}
              variant={showVideoForm ? 'outline' : 'default'}
              size="default"
              className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showVideoForm ? 'Cancel' : 'Add Video'}
            </Button>
          </div>

          {showVideoForm && (
            <form onSubmit={handleSubmitVideo} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
              <div>
                <Label htmlFor="video-title">Topic Name *</Label>
                <Input
                  id="video-title"
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="Enter topic name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="video-url">YouTube URL *</Label>
                <Input
                  id="video-url"
                  value={videoFormData.youtubeUrl}
                  onChange={(e) => setVideoFormData({ ...videoFormData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAddingVideo}>
                  {isAddingVideo ? 'Adding...' : 'Add Video'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowVideoForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

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
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block truncate"
                  >
                    {video.youtubeUrl}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteVideo(index)}
                  disabled={isDeletingVideo}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              IQ Notes ({notes?.length || 0})
            </h2>
            <Button
              onClick={() => setShowNoteForm(!showNoteForm)}
              variant={showNoteForm ? 'outline' : 'default'}
              size="default"
              className="shrink-0 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showNoteForm ? 'Cancel' : 'Add Note'}
            </Button>
          </div>

          {showNoteForm && (
            <form onSubmit={handleSubmitNote} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
              <div>
                <Label htmlFor="note-title">Topic Name *</Label>
                <Input
                  id="note-title"
                  value={noteFormData.title}
                  onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
                  placeholder="Enter topic name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note-content">Content *</Label>
                <Textarea
                  id="note-content"
                  value={noteFormData.content}
                  onChange={(e) => setNoteFormData({ ...noteFormData, content: e.target.value })}
                  placeholder="Enter note content"
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAddingNote}>
                  {isAddingNote ? 'Adding...' : 'Add Note'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNoteForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {note.content}
                  </p>
                </div>
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
