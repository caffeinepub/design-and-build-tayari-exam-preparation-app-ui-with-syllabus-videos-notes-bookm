import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import { useBookmarks } from '@/hooks/useBookmarks';
import AuthControls from '@/components/AuthControls';

export default function VideoBookmarks() {
  const navigate = useNavigate();
  const { videoBookmarks, toggleVideoBookmark } = useBookmarks();
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredBookmarks = videoBookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchKeyword.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen app-page-bg pb-20">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">भिडियो बुकमार्कहरू</h1>
          </div>
          <AuthControls />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {videoBookmarks.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="बुकमार्क खोज्नुहोस्..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {videoBookmarks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">अहिलेसम्म कुनै बुकमार्क गरिएको भिडियो छैन।</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              विषय पृष्ठहरूबाट भिडियोहरू बुकमार्क गर्नुहोस् यहाँ हेर्नको लागि।
            </p>
          </Card>
        ) : filteredBookmarks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">कुनै भिडियो भेटिएन।</p>
          </Card>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 dark:text-slate-100">{bookmark.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVideoBookmark(bookmark.id, bookmark.title, bookmark.url)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
