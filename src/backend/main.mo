import Set "mo:core/Set";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State types
  public type DocumentIdentifier = Text;
  public type NoteIdentifier = Text;
  public type NoteIdentifiers = [NoteIdentifier];

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Persistent storage
  let videoBookmarks = Map.empty<Principal, Set.Set<DocumentIdentifier>>();
  let noteBookmarks = Map.empty<Principal, Set.Set<NoteIdentifier>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Bookmark video
  public shared ({ caller }) func bookmarkVideo(documentId : DocumentIdentifier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can bookmark videos");
    };
    switch (videoBookmarks.get(caller)) {
      case (null) {
        let newSet = Set.singleton(documentId);
        videoBookmarks.add(caller, newSet);
      };
      case (?currentSet) {
        currentSet.add(documentId);
      };
    };
  };

  // Unbookmark video
  public shared ({ caller }) func unbookmarkVideo(documentId : DocumentIdentifier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unbookmark videos");
    };
    switch (videoBookmarks.get(caller)) {
      case (null) { () };
      case (?currentSet) {
        currentSet.remove(documentId);
      };
    };
  };

  // Get video bookmarks
  public query ({ caller }) func getVideoBookmarks() : async [DocumentIdentifier] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access video bookmarks");
    };
    switch (videoBookmarks.get(caller)) {
      case (null) { [] };
      case (?currentSet) { currentSet.toArray() };
    };
  };

  // Bookmark note
  public shared ({ caller }) func bookmarkNote(noteId : NoteIdentifier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can bookmark notes");
    };
    switch (noteBookmarks.get(caller)) {
      case (null) {
        let newSet = Set.singleton(noteId);
        noteBookmarks.add(caller, newSet);
      };
      case (?currentSet) {
        currentSet.add(noteId);
      };
    };
  };

  // Get note bookmarks
  public query ({ caller }) func getNoteBookmarks() : async [NoteIdentifier] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access note bookmarks");
    };
    switch (noteBookmarks.get(caller)) {
      case (null) { [] };
      case (?currentSet) { currentSet.toArray() };
    };
  };

  // Unbookmark note
  public shared ({ caller }) func unbookmarkNote(noteId : NoteIdentifier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unbookmark notes");
    };
    switch (noteBookmarks.get(caller)) {
      case (null) { () };
      case (?currentSet) {
        currentSet.remove(noteId);
      };
    };
  };
};
