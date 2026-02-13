interface YouTubePlayerProps {
  url: string;
}

export default function YouTubePlayer({ url }: YouTubePlayerProps) {
  const getEmbedUrl = (videoUrl: string) => {
    let videoId = '';
    
    if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (videoUrl.includes('youtube.com/watch')) {
      videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
    } else if (videoUrl.includes('youtube.com/live/')) {
      videoId = videoUrl.split('live/')[1]?.split('?')[0] || '';
    } else if (videoUrl.includes('youtube.com/playlist')) {
      const listId = videoUrl.split('list=')[1]?.split('&')[0] || '';
      return `https://www.youtube.com/embed/videoseries?list=${listId}`;
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-slate-900">
      <iframe
        src={getEmbedUrl(url)}
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
      />
    </div>
  );
}
