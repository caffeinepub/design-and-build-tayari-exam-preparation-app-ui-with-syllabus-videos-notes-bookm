import { useGKManagement } from "./useGKManagement";
import { useIQManagement } from "./useIQManagement";
import { useSecondPaperManagement } from "./useSecondPaperManagement";
import { useThirdPaperManagement } from "./useThirdPaperManagement";

// Prefix used to tag which subject a video/note belongs to
const SUBJECT_PREFIX_SEP = "|||";

function makeTag(subjectId: string) {
  return `[${subjectId}]${SUBJECT_PREFIX_SEP}`;
}

function tagTitle(subjectId: string, title: string) {
  return `${makeTag(subjectId)}${title}`;
}

function untagTitle(subjectId: string, title: string) {
  const tag = makeTag(subjectId);
  if (title.startsWith(tag)) return title.slice(tag.length);
  return title;
}

function belongsToSubject(subjectId: string, title: string) {
  return title.startsWith(makeTag(subjectId));
}

const SECOND_PAPER_IDS = ["office-management", "constitution", "maths"];
const THIRD_PAPER_IDS = ["service-management", "accounting", "law"];

export function useSubjectBackend(subjectId: string) {
  // Always call all hooks unconditionally (React rules of hooks)
  const gk = useGKManagement();
  const iq = useIQManagement();
  const second = useSecondPaperManagement();
  const third = useThirdPaperManagement();

  if (subjectId === "gk") {
    return {
      videos: gk.videos ?? [],
      notes: gk.notes ?? [],
      addVideo: gk.addVideo,
      addNote: gk.addNote,
      isAddingVideo: gk.isAddingVideo,
      isAddingNote: gk.isAddingNote,
    };
  }

  if (subjectId === "iq") {
    return {
      videos: iq.videos ?? [],
      notes: iq.notes ?? [],
      addVideo: iq.addVideo,
      addNote: iq.addNote,
      isAddingVideo: iq.isAddingVideo,
      isAddingNote: iq.isAddingNote,
    };
  }

  if (SECOND_PAPER_IDS.includes(subjectId)) {
    // Filter videos/notes that belong to this specific subject
    const allVideos = second.videos ?? [];
    const allNotes = second.notes ?? [];

    const filteredVideos = allVideos
      .filter((v) => belongsToSubject(subjectId, v.title))
      .map((v) => ({ ...v, title: untagTitle(subjectId, v.title) }));

    const filteredNotes = allNotes
      .filter((n) => belongsToSubject(subjectId, n.title))
      .map((n) => ({ ...n, title: untagTitle(subjectId, n.title) }));

    return {
      videos: filteredVideos,
      notes: filteredNotes,
      addVideo: async (video: { title: string; youtubeUrl: string }) => {
        return second.addVideo({
          ...video,
          title: tagTitle(subjectId, video.title),
        });
      },
      addNote: async (note: { title: string; content: string }) => {
        return second.addNote({
          ...note,
          title: tagTitle(subjectId, note.title),
        });
      },
      isAddingVideo: second.isAddingVideo,
      isAddingNote: second.isAddingNote,
    };
  }

  if (THIRD_PAPER_IDS.includes(subjectId)) {
    const allVideos = third.videos ?? [];
    const allNotes = third.notes ?? [];

    const filteredVideos = allVideos
      .filter((v) => belongsToSubject(subjectId, v.title))
      .map((v) => ({ ...v, title: untagTitle(subjectId, v.title) }));

    const filteredNotes = allNotes
      .filter((n) => belongsToSubject(subjectId, n.title))
      .map((n) => ({ ...n, title: untagTitle(subjectId, n.title) }));

    return {
      videos: filteredVideos,
      notes: filteredNotes,
      addVideo: async (video: { title: string; youtubeUrl: string }) => {
        return third.addVideo({
          ...video,
          title: tagTitle(subjectId, video.title),
        });
      },
      addNote: async (note: { title: string; content: string }) => {
        return third.addNote({
          ...note,
          title: tagTitle(subjectId, note.title),
        });
      },
      isAddingVideo: third.isAddingVideo,
      isAddingNote: third.isAddingNote,
    };
  }

  // Fallback for unknown subject IDs
  return {
    videos: [] as Array<{ title: string; youtubeUrl: string }>,
    notes: [] as Array<{ title: string; content: string }>,
    addVideo: async (_video: { title: string; youtubeUrl: string }) => {},
    addNote: async (_note: { title: string; content: string }) => {},
    isAddingVideo: false,
    isAddingNote: false,
  };
}
