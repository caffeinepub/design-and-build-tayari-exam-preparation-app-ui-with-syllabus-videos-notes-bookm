import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bookmark, FileText } from "lucide-react";

function isDriveLink(url: string) {
  return url.includes("drive.google.com");
}

interface Video {
  id: string;
  title: string;
  url: string;
}

interface Topic {
  title: string;
  videos: Video[];
}

interface TopicVideoListProps {
  topics: Topic[];
  onVideoSelect: (url: string) => void;
  selectedVideo: string | null;
  isVideoBookmarked: (id: string) => boolean;
  toggleVideoBookmark: (id: string, title: string, url: string) => void;
}

export default function TopicVideoList({
  topics,
  onVideoSelect,
  selectedVideo,
  isVideoBookmarked,
  toggleVideoBookmark,
}: TopicVideoListProps) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-6">
        {topics.map((topic) => (
          <div key={topic.title}>
            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-100">
              {topic.title}
            </h3>
            <div className="space-y-2">
              {topic.videos.map((video, videoIndex) => (
                <Card
                  key={video.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedVideo === video.url
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex-1 text-left"
                      onClick={() => {
                        if (isDriveLink(video.url)) {
                          window.open(video.url, "_blank");
                        } else {
                          onVideoSelect(video.url);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-semibold">
                          {isDriveLink(video.url) ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            videoIndex + 1
                          )}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {video.title}
                        </span>
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVideoBookmark(video.id, video.title, video.url);
                      }}
                    >
                      <Bookmark
                        className={cn(
                          "w-4 h-4",
                          isVideoBookmarked(video.id) &&
                            "fill-current text-emerald-600",
                        )}
                      />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
