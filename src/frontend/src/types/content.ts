export interface Video {
  id: string;
  title: string;
  url: string;
}

export interface Topic {
  title: string;
  videos: Video[];
}

export interface SubjectConfig {
  id: string;
  title: string;
  topics: Topic[];
  notesUrl?: string;
}
