import { useState, useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

interface VideoBookmark {
  id: string;
  title: string;
  url: string;
}

interface NoteBookmark {
  id: string;
  title: string;
}

const LOCAL_VIDEO_KEY = 'tayari_video_bookmarks';
const LOCAL_NOTE_KEY = 'tayari_note_bookmarks';

export function useBookmarks() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [videoBookmarks, setVideoBookmarks] = useState<VideoBookmark[]>([]);
  const [noteBookmarks, setNoteBookmarks] = useState<NoteBookmark[]>([]);
  const [syncing, setSyncing] = useState(false);
  const syncAttemptedRef = useRef(false);

  // Load local bookmarks on mount
  useEffect(() => {
    const localVideos = localStorage.getItem(LOCAL_VIDEO_KEY);
    const localNotes = localStorage.getItem(LOCAL_NOTE_KEY);
    
    if (localVideos) {
      try {
        setVideoBookmarks(JSON.parse(localVideos));
      } catch (e) {
        console.error('[Bookmarks] Failed to parse local video bookmarks:', e);
        localStorage.removeItem(LOCAL_VIDEO_KEY);
      }
    }
    
    if (localNotes) {
      try {
        setNoteBookmarks(JSON.parse(localNotes));
      } catch (e) {
        console.error('[Bookmarks] Failed to parse local note bookmarks:', e);
        localStorage.removeItem(LOCAL_NOTE_KEY);
      }
    }
  }, []);

  // Sync with backend when authenticated
  useEffect(() => {
    if (!actor || !identity || syncing || syncAttemptedRef.current) {
      return;
    }

    syncAttemptedRef.current = true;
    setSyncing(true);

    const syncBookmarks = async () => {
      try {
        console.log('[Bookmarks] Starting cloud sync...');
        
        const [serverVideos, serverNotes] = await Promise.all([
          actor.getVideoBookmarks().catch((err) => {
            console.error('[Bookmarks] Failed to fetch video bookmarks from backend:', err);
            return [];
          }),
          actor.getNoteBookmarks().catch((err) => {
            console.error('[Bookmarks] Failed to fetch note bookmarks from backend:', err);
            return [];
          }),
        ]);

        // Parse local bookmarks safely
        let localVideos: VideoBookmark[] = [];
        let localNotes: NoteBookmark[] = [];
        
        try {
          const localVideosRaw = localStorage.getItem(LOCAL_VIDEO_KEY);
          localVideos = localVideosRaw ? JSON.parse(localVideosRaw) : [];
        } catch (e) {
          console.error('[Bookmarks] Failed to parse local video bookmarks during sync:', e);
        }
        
        try {
          const localNotesRaw = localStorage.getItem(LOCAL_NOTE_KEY);
          localNotes = localNotesRaw ? JSON.parse(localNotesRaw) : [];
        } catch (e) {
          console.error('[Bookmarks] Failed to parse local note bookmarks during sync:', e);
        }

        // Merge: keep local entries and add server IDs that don't exist locally
        const mergedVideos = [...localVideos];
        serverVideos.forEach((id: string) => {
          if (!mergedVideos.find((v) => v.id === id)) {
            mergedVideos.push({ id, title: 'Bookmarked Video', url: '' });
          }
        });
        
        const mergedNotes = [...localNotes];
        serverNotes.forEach((id: string) => {
          if (!mergedNotes.find((n) => n.id === id)) {
            mergedNotes.push({ id, title: 'Bookmarked Note' });
          }
        });
        
        // Update state and localStorage only if merge succeeded
        setVideoBookmarks(mergedVideos);
        setNoteBookmarks(mergedNotes);
        localStorage.setItem(LOCAL_VIDEO_KEY, JSON.stringify(mergedVideos));
        localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(mergedNotes));
        
        console.log('[Bookmarks] Cloud sync completed successfully');
      } catch (err) {
        console.error('[Bookmarks] Unexpected error during sync:', err);
      } finally {
        setSyncing(false);
      }
    };

    syncBookmarks();

    // Reset sync flag on unmount or identity change
    return () => {
      syncAttemptedRef.current = false;
    };
  }, [actor, identity]);

  const toggleVideoBookmark = (id: string, title: string, url: string) => {
    const exists = videoBookmarks.find((b) => b.id === id);
    let newBookmarks: VideoBookmark[];
    
    if (exists) {
      newBookmarks = videoBookmarks.filter((b) => b.id !== id);
      if (actor && identity) {
        actor.unbookmarkVideo(id).catch((err) => {
          console.error('[Bookmarks] Failed to unbookmark video on backend:', err);
        });
      }
    } else {
      newBookmarks = [...videoBookmarks, { id, title, url }];
      if (actor && identity) {
        actor.bookmarkVideo(id).catch((err) => {
          console.error('[Bookmarks] Failed to bookmark video on backend:', err);
        });
      }
    }
    
    setVideoBookmarks(newBookmarks);
    localStorage.setItem(LOCAL_VIDEO_KEY, JSON.stringify(newBookmarks));
  };

  const toggleNoteBookmark = (id: string, title: string) => {
    const exists = noteBookmarks.find((b) => b.id === id);
    let newBookmarks: NoteBookmark[];
    
    if (exists) {
      newBookmarks = noteBookmarks.filter((b) => b.id !== id);
      if (actor && identity) {
        actor.unbookmarkNote(id).catch((err) => {
          console.error('[Bookmarks] Failed to unbookmark note on backend:', err);
        });
      }
    } else {
      newBookmarks = [...noteBookmarks, { id, title }];
      if (actor && identity) {
        actor.bookmarkNote(id).catch((err) => {
          console.error('[Bookmarks] Failed to bookmark note on backend:', err);
        });
      }
    }
    
    setNoteBookmarks(newBookmarks);
    localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(newBookmarks));
  };

  const isVideoBookmarked = (id: string) => {
    return videoBookmarks.some((b) => b.id === id);
  };

  const isNoteBookmarked = (id: string) => {
    return noteBookmarks.some((b) => b.id === id);
  };

  return {
    videoBookmarks,
    noteBookmarks,
    toggleVideoBookmark,
    toggleNoteBookmark,
    isVideoBookmarked,
    isNoteBookmarked,
  };
}
