interface Video {
  id: string;
  title: string;
  url: string;
}

interface Topic {
  title: string;
  videos: Video[];
}

/**
 * Filters topics and videos by a search keyword (case-insensitive).
 * Returns only topics that have matching videos or a matching topic title.
 */
export function filterVideosByKeyword(topics: Topic[], keyword: string): Topic[] {
  if (!keyword.trim()) {
    return topics;
  }

  const lowerKeyword = keyword.toLowerCase().trim();

  return topics
    .map((topic) => {
      const topicMatches = topic.title.toLowerCase().includes(lowerKeyword);
      const matchingVideos = topic.videos.filter((video) =>
        video.title.toLowerCase().includes(lowerKeyword)
      );

      // Include topic if title matches or if it has matching videos
      if (topicMatches) {
        return topic;
      } else if (matchingVideos.length > 0) {
        return { ...topic, videos: matchingVideos };
      }
      return null;
    })
    .filter((topic): topic is Topic => topic !== null);
}
