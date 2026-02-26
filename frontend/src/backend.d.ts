import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ThirdPaperVideo {
    title: string;
    youtubeUrl: string;
}
export interface SecondPaperVideo {
    title: string;
    youtubeUrl: string;
}
export interface SyllabusEntry {
    driveUrl: string;
    title: string;
    published: boolean;
    description: string;
}
export interface StandaloneVideo {
    title: string;
    description: string;
    youtubeUrl: string;
}
export interface StandaloneNote {
    driveUrl: string;
    title: string;
    description: string;
}
export interface SecondPaperTopic {
    title: string;
    description: string;
}
export interface SecondPaperNote {
    title: string;
    content: string;
}
export interface IQVideo {
    title: string;
    youtubeUrl: string;
}
export interface GKVideo {
    title: string;
    youtubeUrl: string;
}
export interface ThirdPaperTopic {
    title: string;
    description: string;
}
export interface IQCategory {
    title: string;
    description: string;
}
export interface GKTopic {
    title: string;
    description: string;
}
export interface IQNote {
    title: string;
    content: string;
}
export interface GKNote {
    title: string;
    content: string;
}
export type DocumentIdentifier = string;
export interface ThirdPaperNote {
    title: string;
    content: string;
}
export interface OldQuestion {
    title: string;
    year: bigint;
    paperType: string;
    pdfUrl: string;
}
export type NoteIdentifier = string;
export interface UserProfile {
    name: string;
}
export interface MockExam {
    title: string;
    duration: bigint;
    description: string;
    pdfUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / *********
     * /    * Comments *
     * /    ***********
     */
    addComment(comment: string, replyId: bigint): Promise<void>;
    addGKNote(note: GKNote): Promise<void>;
    addGKTopic(topic: GKTopic): Promise<void>;
    addGKVideo(video: GKVideo): Promise<void>;
    addIQCategory(category: IQCategory): Promise<void>;
    addIQNote(note: IQNote): Promise<void>;
    addIQVideo(video: IQVideo): Promise<void>;
    addMockExam(exam: MockExam): Promise<void>;
    addOldQuestion(question: OldQuestion): Promise<void>;
    addSecondPaperNote(note: SecondPaperNote): Promise<void>;
    addSecondPaperTopic(topic: SecondPaperTopic): Promise<void>;
    addSecondPaperVideo(video: SecondPaperVideo): Promise<void>;
    addStandaloneNote(note: StandaloneNote): Promise<void>;
    addStandaloneVideo(video: StandaloneVideo): Promise<void>;
    addSyllabusEntry(entry: SyllabusEntry): Promise<void>;
    addThirdPaperNote(note: ThirdPaperNote): Promise<void>;
    addThirdPaperTopic(topic: ThirdPaperTopic): Promise<void>;
    addThirdPaperVideo(video: ThirdPaperVideo): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkNote(noteId: NoteIdentifier): Promise<void>;
    bookmarkVideo(documentId: DocumentIdentifier): Promise<void>;
    deleteGKTopic(index: bigint): Promise<void>;
    deleteGKVideo(index: bigint): Promise<void>;
    deleteIQCategory(index: bigint): Promise<void>;
    deleteIQVideo(index: bigint): Promise<void>;
    deleteMockExam(index: bigint): Promise<void>;
    deleteOldQuestion(index: bigint): Promise<void>;
    deleteSecondPaperTopic(index: bigint): Promise<void>;
    deleteSecondPaperVideo(index: bigint): Promise<void>;
    deleteStandaloneNote(index: bigint): Promise<void>;
    deleteStandaloneVideo(index: bigint): Promise<void>;
    deleteSyllabusEntry(index: bigint): Promise<void>;
    deleteThirdPaperTopic(index: bigint): Promise<void>;
    deleteThirdPaperVideo(index: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(): Promise<Array<Array<string>>>;
    getGKNotes(): Promise<Array<GKNote>>;
    getGKTopics(): Promise<Array<GKTopic>>;
    getGKVideos(): Promise<Array<GKVideo>>;
    getIQCategories(): Promise<Array<IQCategory>>;
    getIQNotes(): Promise<Array<IQNote>>;
    getIQVideos(): Promise<Array<IQVideo>>;
    getMockExams(): Promise<Array<MockExam>>;
    getNoteBookmarks(): Promise<Array<NoteIdentifier>>;
    getOldQuestions(): Promise<Array<OldQuestion>>;
    getSecondPaperNotes(): Promise<Array<SecondPaperNote>>;
    getSecondPaperTopics(): Promise<Array<SecondPaperTopic>>;
    getSecondPaperVideos(): Promise<Array<SecondPaperVideo>>;
    getStandaloneNotes(): Promise<Array<StandaloneNote>>;
    getStandaloneVideos(): Promise<Array<StandaloneVideo>>;
    getSyllabusEntries(): Promise<Array<SyllabusEntry>>;
    getThirdPaperNotes(): Promise<Array<ThirdPaperNote>>;
    getThirdPaperTopics(): Promise<Array<ThirdPaperTopic>>;
    getThirdPaperVideos(): Promise<Array<ThirdPaperVideo>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoBookmarks(): Promise<Array<DocumentIdentifier>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unbookmarkNote(noteId: NoteIdentifier): Promise<void>;
    unbookmarkVideo(documentId: DocumentIdentifier): Promise<void>;
    updateSyllabusEntry(index: bigint, entry: SyllabusEntry): Promise<void>;
}
