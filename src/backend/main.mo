import Set "mo:core/Set";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  /*********************
   * Types & Structures *
   *********************/

  // General Types
  public type DocumentIdentifier = Text;
  public type NoteIdentifier = Text;

  // Syllabus Section Types
  public type SyllabusEntry = {
    title : Text;
    description : Text;
    driveUrl : Text;
    published : Bool;
  };

  // General Knowledge (GK) Types
  public type GKTopic = {
    title : Text;
    description : Text;
  };

  public type GKVideo = {
    title : Text;
    description : Text;
    youtubeUrl : Text;
  };

  // IQ Types
  public type IQCategory = {
    title : Text;
    description : Text;
  };

  public type IQVideo = {
    title : Text;
    description : Text;
    youtubeUrl : Text;
  };

  // Second Paper Types (Office Management & Constitution)
  public type SecondPaperTopic = {
    title : Text;
    description : Text;
  };

  public type SecondPaperVideo = {
    title : Text;
    description : Text;
    youtubeUrl : Text;
  };

  public type SecondPaperNote = {
    title : Text;
    description : Text;
    driveUrl : Text;
  };

  // Third Paper Types (Service Management)
  public type ThirdPaperTopic = {
    title : Text;
    description : Text;
  };

  public type ThirdPaperVideo = {
    title : Text;
    description : Text;
    youtubeUrl : Text;
  };

  public type ThirdPaperNote = {
    title : Text;
    description : Text;
    driveUrl : Text;
  };

  // Exam Types
  public type MockExam = {
    title : Text;
    duration : Nat;
    description : Text;
    pdfUrl : Text;
  };

  // Video & Notes Types
  public type StandaloneVideo = {
    title : Text;
    description : Text;
    youtubeUrl : Text;
  };

  public type StandaloneNote = {
    title : Text;
    description : Text;
    driveUrl : Text;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Storage
  let syllabusEntries = List.empty<SyllabusEntry>();
  let gkTopics = List.empty<GKTopic>();
  let gkVideos = List.empty<GKVideo>();
  let iqCategories = List.empty<IQCategory>();
  let iqVideos = List.empty<IQVideo>();
  let secondPaperTopics = List.empty<SecondPaperTopic>();
  let secondPaperVideos = List.empty<SecondPaperVideo>();
  let secondPaperNotes = List.empty<SecondPaperNote>();
  let thirdPaperTopics = List.empty<ThirdPaperTopic>();
  let thirdPaperVideos = List.empty<ThirdPaperVideo>();
  let thirdPaperNotes = List.empty<ThirdPaperNote>();
  let mockExams = List.empty<MockExam>();
  let standaloneVideos = List.empty<StandaloneVideo>();
  let standaloneNotes = List.empty<StandaloneNote>();

  let videoBookmarks = Map.empty<Principal, Set.Set<DocumentIdentifier>>();
  let noteBookmarks = Map.empty<Principal, Set.Set<NoteIdentifier>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  /***********
   * Authorization *
   ************/

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var commentsList : List.List<List.List<Text>> = List.empty<List.List<Text>>();

  public shared ({ caller }) func addComment(comment : Text, replyId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add comments");
    };

    let newReplies = List.empty<Text>();
    newReplies.add(comment);

    let iter = commentsList.enumerate();
    let newCommentsList = List.empty<List.List<Text>>();

    switch (commentsList.size(), replyId) {
      case (0, _) {
        newCommentsList.add(newReplies);
      };
      case (_, 0) {
        newCommentsList.add(newReplies);
        for ((index, rest) in iter.drop(1)) {
          newCommentsList.add(rest);
        };
      };
      case (_, _) {
        var currentIndex = 0;
        for (comments in commentsList.values()) {
          if (currentIndex == replyId) {
            let tempList = List.empty<Text>();
            for (entry in comments.values()) {
              tempList.add(entry);
            };
            for (entry in newReplies.values()) {
              tempList.add(entry);
            };
            newCommentsList.add(tempList);
          } else {
            newCommentsList.add(comments);
          };
          currentIndex += 1;
        };
      };
    };

    commentsList := newCommentsList;
  };

  public query func getComments() : async [[Text]] {
    let entries = commentsList.toArray();
    entries.map<List.List<Text>, [Text]>(func(comment) { comment.toArray() });
  };

  //----------------------------
  // Syllabus Section Functions
  //----------------------------

  public shared ({ caller }) func addSyllabusEntry(entry : SyllabusEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add syllabus entries");
    };
    syllabusEntries.add(entry);
  };

  public shared ({ caller }) func updateSyllabusEntry(index : Nat, entry : SyllabusEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update syllabus entries");
    };
    let iter = syllabusEntries.enumerate();
    syllabusEntries.clear();
    for ((i, currentEntry) in iter) {
      if (i == index) {
        let temp = List.empty<SyllabusEntry>();
        temp.add(entry);
        syllabusEntries.addAll(temp.values());
      } else {
        let temp = List.empty<SyllabusEntry>();
        temp.add(currentEntry);
        syllabusEntries.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func deleteSyllabusEntry(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete syllabus entries");
    };
    let iter = syllabusEntries.enumerate();
    syllabusEntries.clear();
    for ((i, currentEntry) in iter) {
      if (i != index) {
        let temp = List.empty<SyllabusEntry>();
        temp.add(currentEntry);
        syllabusEntries.addAll(temp.values());
      };
    };
  };

  // General Knowledge (GK) Functions
  public shared ({ caller }) func addGKTopic(topic : GKTopic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add GK topics");
    };
    gkTopics.add(topic);
  };

  public shared ({ caller }) func deleteGKTopic(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete GK topics");
    };
    let iter = gkTopics.enumerate();
    gkTopics.clear();
    for ((i, currentTopic) in iter) {
      if (i != index) {
        let temp = List.empty<GKTopic>();
        temp.add(currentTopic);
        gkTopics.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addGKVideo(video : GKVideo) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add GK videos");
    };
    gkVideos.add(video);
  };

  public shared ({ caller }) func deleteGKVideo(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete GK videos");
    };
    let iter = gkVideos.enumerate();
    gkVideos.clear();
    for ((i, currentVideo) in iter) {
      if (i != index) {
        let temp = List.empty<GKVideo>();
        temp.add(currentVideo);
        gkVideos.addAll(temp.values());
      };
    };
  };

  // IQ Section Functions
  public shared ({ caller }) func addIQCategory(category : IQCategory) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add IQ categories");
    };
    iqCategories.add(category);
  };

  public shared ({ caller }) func deleteIQCategory(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete IQ categories");
    };
    let iter = iqCategories.enumerate();
    iqCategories.clear();
    for ((i, currentCategory) in iter) {
      if (i != index) {
        let temp = List.empty<IQCategory>();
        temp.add(currentCategory);
        iqCategories.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addIQVideo(video : IQVideo) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add IQ videos");
    };
    iqVideos.add(video);
  };

  public shared ({ caller }) func deleteIQVideo(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete IQ videos");
    };
    let iter = iqVideos.enumerate();
    iqVideos.clear();
    for ((i, currentVideo) in iter) {
      if (i != index) {
        let temp = List.empty<IQVideo>();
        temp.add(currentVideo);
        iqVideos.addAll(temp.values());
      };
    };
  };

  // Second Paper Functions
  public shared ({ caller }) func addSecondPaperTopic(topic : SecondPaperTopic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add Second Paper topics");
    };
    secondPaperTopics.add(topic);
  };

  public shared ({ caller }) func deleteSecondPaperTopic(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete Second Paper topics");
    };
    let iter = secondPaperTopics.enumerate();
    secondPaperTopics.clear();
    for ((i, currentTopic) in iter) {
      if (i != index) {
        let temp = List.empty<SecondPaperTopic>();
        temp.add(currentTopic);
        secondPaperTopics.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addSecondPaperVideo(video : SecondPaperVideo) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add Second Paper videos");
    };
    secondPaperVideos.add(video);
  };

  public shared ({ caller }) func deleteSecondPaperVideo(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete Second Paper videos");
    };
    let iter = secondPaperVideos.enumerate();
    secondPaperVideos.clear();
    for ((i, currentVideo) in iter) {
      if (i != index) {
        let temp = List.empty<SecondPaperVideo>();
        temp.add(currentVideo);
        secondPaperVideos.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addSecondPaperNote(note : SecondPaperNote) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add Second Paper notes");
    };
    secondPaperNotes.add(note);
  };

  public shared ({ caller }) func deleteSecondPaperNote(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete Second Paper notes");
    };
    let iter = secondPaperNotes.enumerate();
    secondPaperNotes.clear();
    for ((i, currentNote) in iter) {
      if (i != index) {
        let temp = List.empty<SecondPaperNote>();
        temp.add(currentNote);
        secondPaperNotes.addAll(temp.values());
      };
    };
  };

  // Third Paper Functions
  public shared ({ caller }) func addThirdPaperTopic(topic : ThirdPaperTopic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add Third Paper topics");
    };
    thirdPaperTopics.add(topic);
  };

  public shared ({ caller }) func deleteThirdPaperTopic(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete Third Paper topics");
    };
    let iter = thirdPaperTopics.enumerate();
    thirdPaperTopics.clear();
    for ((i, currentTopic) in iter) {
      if (i != index) {
        let temp = List.empty<ThirdPaperTopic>();
        temp.add(currentTopic);
        thirdPaperTopics.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addThirdPaperVideo(video : ThirdPaperVideo) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add Third Paper videos");
    };
    thirdPaperVideos.add(video);
  };

  public shared ({ caller }) func deleteThirdPaperVideo(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete Third Paper videos");
    };
    let iter = thirdPaperVideos.enumerate();
    thirdPaperVideos.clear();
    for ((i, currentVideo) in iter) {
      if (i != index) {
        let temp = List.empty<ThirdPaperVideo>();
        temp.add(currentVideo);
        thirdPaperVideos.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addThirdPaperNote(note : ThirdPaperNote) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add Third Paper notes");
    };
    thirdPaperNotes.add(note);
  };

  public shared ({ caller }) func deleteThirdPaperNote(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete Third Paper notes");
    };
    let iter = thirdPaperNotes.enumerate();
    thirdPaperNotes.clear();
    for ((i, currentNote) in iter) {
      if (i != index) {
        let temp = List.empty<ThirdPaperNote>();
        temp.add(currentNote);
        thirdPaperNotes.addAll(temp.values());
      };
    };
  };

  // Exam Functions
  public shared ({ caller }) func addMockExam(exam : MockExam) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add mock exams");
    };
    mockExams.add(exam);
  };

  public shared ({ caller }) func deleteMockExam(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete mock exams");
    };
    let iter = mockExams.enumerate();
    mockExams.clear();
    for ((i, currentExam) in iter) {
      if (i != index) {
        let temp = List.empty<MockExam>();
        temp.add(currentExam);
        mockExams.addAll(temp.values());
      };
    };
  };

  // Videos & Notes Functions
  public shared ({ caller }) func addStandaloneVideo(video : StandaloneVideo) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add standalone videos");
    };
    standaloneVideos.add(video);
  };

  public shared ({ caller }) func deleteStandaloneVideo(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete standalone videos");
    };
    let iter = standaloneVideos.enumerate();
    standaloneVideos.clear();
    for ((i, currentVideo) in iter) {
      if (i != index) {
        let temp = List.empty<StandaloneVideo>();
        temp.add(currentVideo);
        standaloneVideos.addAll(temp.values());
      };
    };
  };

  public shared ({ caller }) func addStandaloneNote(note : StandaloneNote) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add standalone notes");
    };
    standaloneNotes.add(note);
  };

  public shared ({ caller }) func deleteStandaloneNote(index : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete standalone notes");
    };
    let iter = standaloneNotes.enumerate();
    standaloneNotes.clear();
    for ((i, currentNote) in iter) {
      if (i != index) {
        let temp = List.empty<StandaloneNote>();
        temp.add(currentNote);
        standaloneNotes.addAll(temp.values());
      };
    };
  };

  //------------------------
  // User Profile Functions
  //------------------------

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

  //-----------------
  // Bookmarking
  //-----------------

  // Bookmark Video
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

  // Unbookmark Video
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

  // Get Video Bookmarks
  public query ({ caller }) func getVideoBookmarks() : async [DocumentIdentifier] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access video bookmarks");
    };
    switch (videoBookmarks.get(caller)) {
      case (null) { [] };
      case (?currentSet) { currentSet.toArray() };
    };
  };

  // Bookmark Note
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

  // Get Note Bookmarks
  public query ({ caller }) func getNoteBookmarks() : async [NoteIdentifier] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access note bookmarks");
    };
    switch (noteBookmarks.get(caller)) {
      case (null) { [] };
      case (?currentSet) { currentSet.toArray() };
    };
  };

  // Unbookmark Note
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

  //----------------
  // Getter Functions
  //----------------

  public query func getSyllabusEntries() : async [SyllabusEntry] {
    syllabusEntries.toArray();
  };

  public query func getGKTopics() : async [GKTopic] {
    gkTopics.toArray();
  };

  public query func getGKVideos() : async [GKVideo] {
    gkVideos.toArray();
  };

  public query func getIQCategories() : async [IQCategory] {
    iqCategories.toArray();
  };

  public query func getIQVideos() : async [IQVideo] {
    iqVideos.toArray();
  };

  public query func getSecondPaperTopics() : async [SecondPaperTopic] {
    secondPaperTopics.toArray();
  };

  public query func getSecondPaperVideos() : async [SecondPaperVideo] {
    secondPaperVideos.toArray();
  };

  public query func getSecondPaperNotes() : async [SecondPaperNote] {
    secondPaperNotes.toArray();
  };

  public query func getThirdPaperTopics() : async [ThirdPaperTopic] {
    thirdPaperTopics.toArray();
  };

  public query func getThirdPaperVideos() : async [ThirdPaperVideo] {
    thirdPaperVideos.toArray();
  };

  public query func getThirdPaperNotes() : async [ThirdPaperNote] {
    thirdPaperNotes.toArray();
  };

  public query func getMockExams() : async [MockExam] {
    mockExams.toArray();
  };

  public query func getStandaloneVideos() : async [StandaloneVideo] {
    standaloneVideos.toArray();
  };

  public query func getStandaloneNotes() : async [StandaloneNote] {
    standaloneNotes.toArray();
  };
};
