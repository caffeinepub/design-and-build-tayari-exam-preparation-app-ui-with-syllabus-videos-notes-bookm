import { useGKManagement } from "./useGKManagement";
import { useIQManagement } from "./useIQManagement";
import { useSecondPaperManagement } from "./useSecondPaperManagement";
import { useThirdPaperManagement } from "./useThirdPaperManagement";

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
    return {
      videos: second.videos ?? [],
      notes: second.notes ?? [],
      addVideo: second.addVideo,
      addNote: second.addNote,
      isAddingVideo: second.isAddingVideo,
      isAddingNote: second.isAddingNote,
    };
  }

  if (THIRD_PAPER_IDS.includes(subjectId)) {
    return {
      videos: third.videos ?? [],
      notes: third.notes ?? [],
      addVideo: third.addVideo,
      addNote: third.addNote,
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
