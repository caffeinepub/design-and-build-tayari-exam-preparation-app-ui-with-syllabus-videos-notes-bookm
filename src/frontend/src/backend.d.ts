import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type NoteIdentifier = string;
export type DocumentIdentifier = string;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkNote(noteId: NoteIdentifier): Promise<void>;
    bookmarkVideo(documentId: DocumentIdentifier): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNoteBookmarks(): Promise<Array<NoteIdentifier>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoBookmarks(): Promise<Array<DocumentIdentifier>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unbookmarkNote(noteId: NoteIdentifier): Promise<void>;
    unbookmarkVideo(documentId: DocumentIdentifier): Promise<void>;
}
