import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // ----- Types and Modules -----

  type Badge = {
    id : Nat;
    name : Text;
    description : Text;
    icon : Text;
    requirement : Text;
  };

  module Level {
    type Level = {
      id : Nat;
      name : Text;
      xpThreshold : Nat;
      description : Text;
    };

    public func compare(level1 : Level, level2 : Level) : Order.Order {
      Nat.compare(level1.id, level2.id);
    };
  };

  type XP = Nat;
  type UserId = Principal;

  public type UserRole = {
    #admin;
    #user;
  };

  // Persistent state types (containing mutable List)
  type PersistentUserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    xp : Nat;
    streak : Nat;
    lastActive : Time.Time;
    badges : List.List<Badge>;
    createdAt : Time.Time;
  };

  // Public API response types (immutable "View" types)
  public type BadgeView = {
    id : Nat;
    name : Text;
    description : Text;
    icon : Text;
    requirement : Text;
  };

  public type AchievementsResponse = {
    message : Text;
    xpEarned : XP;
    newBadge : BadgeView;
    allBadges : [BadgeView];
  };

  public type UserProfileView = {
    name : Text;
    email : Text;
    role : UserRole;
    xp : Nat;
    streak : Nat;
    lastActive : Time.Time;
    badges : [BadgeView];
    createdAt : Time.Time;
  };

  public type UserSummary = {
    name : Text;
    email : Text;
    xp : Nat;
    streak : Nat;
    role : UserRole;
  };

  public type LeaderboardEntry = {
    userId : UserId;
    name : Text;
    xp : Nat;
    streak : Nat;
  };

  // ----- Persistent State -----

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent user profiles
  let persistentUserProfiles = Map.empty<UserId, PersistentUserProfile>();

  // Global achievements, levels, and badges
  let globalLevels = List.empty<{ id : Nat; name : Text; xpThreshold : Nat }>();
  let globalBadges = List.empty<Badge>();

  // ----- Core Logic -----

  // Convert persistent profile to immutable view type
  func toUserProfileView(user : PersistentUserProfile) : UserProfileView {
    {
      name = user.name;
      email = user.email;
      role = user.role;
      xp = user.xp;
      streak = user.streak;
      lastActive = user.lastActive;
      badges = user.badges.toArray();
      createdAt = user.createdAt;
    };
  };

  // Convert badges list to array
  func toBadgeViews(badges : List.List<Badge>) : [BadgeView] {
    badges.toArray();
  };

  // Returns the global badge catalogue (immutable array)
  public query func getAchievements() : async [Badge] {
    globalBadges.toArray();
  };

  // Get the current user's own profile (immutable view)
  public query ({ caller }) func getCallerUserProfile() : async UserProfileView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };

    switch (persistentUserProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { toUserProfileView(user) };
    };
  };

  // Save or update the calling user's own profile (mutable -> immutable)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfileView) : async UserProfileView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };

    let badges = List.empty<Badge>();
    badges.add({
      id = 0;
      name = "Starter Badge";
      description = "Default badge";
      icon = "🏅";
      requirement = "No requirement";
    });

    let persistentProfile = {
      name = profile.name;
      email = profile.email;
      role = profile.role;
      xp = profile.xp;
      streak = profile.streak;
      lastActive = profile.lastActive;
      badges;
      createdAt = profile.createdAt;
    };

    persistentUserProfiles.add(caller, persistentProfile);
    toUserProfileView(persistentProfile);
  };

  // Fetch any user's public profile view (immutable)
  public query ({ caller }) func getUserProfile(user : UserId) : async UserProfileView {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view another user's profile");
    };

    switch (persistentUserProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { toUserProfileView(user) };
    };
  };

  // Check and update achievements, including new badges
  public shared ({ caller }) func checkAndUpdateAchievements(userId : UserId, newXP : XP) : async AchievementsResponse {
    // Only the owner of the profile or an admin may update it.
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own achievements");
    };

    // The caller (or admin acting on behalf of a user) must be a registered user.
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update achievements");
    };

    switch (persistentUserProfiles.get(userId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) {
        let newBadge = {
          id = 1;
          name = "New Badge";
          description = "Badge description";
          icon = "🏅";
          requirement = "Requirement description";
        };

        let persistentUserBadges = user.badges.clone();
        persistentUserBadges.add(newBadge);

        let updatedUser = {
          name = user.name;
          email = user.email;
          role = user.role;
          xp = user.xp + newXP;
          streak = user.streak;
          lastActive = user.lastActive;
          badges = persistentUserBadges;
          createdAt = user.createdAt;
        };

        persistentUserProfiles.add(userId, updatedUser);

        {
          message = "Success";
          xpEarned = newXP;
          newBadge;
          allBadges = persistentUserBadges.toArray();
        };
      };
    };
  };

  // Admin-only function to get all registered users as public view types.
  public shared ({ caller }) func adminGetAllUsers() : async [UserProfileView] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };

    persistentUserProfiles.values().toArray().map(toUserProfileView);
  };

  // Assign a role to a user (admin only).
  public shared ({ caller }) func adminAssignRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Static leaderboard function
  public query func getLeaderboard() : async [LeaderboardEntry] {
    let dummyData = [
      {
        userId = Principal.fromText("yjtcw-kwx73-ztb6u-qsy5z-zz5o-pci4s-3ri4y-gsonc-veqst-na53c-oa6");
        name = "John Doe";
        xp = 1500;
        streak = 7;
      },
      {
        userId = Principal.fromText("fscye-uxh2i-ielhy-rlvna-waz22-gl346-zino7-3ngwp-oi2yz-im47s-aae");
        name = "Jane Smith";
        xp = 1000;
        streak = 5;
      },
      {
        userId = Principal.fromText("dfhuw-3ozhb-2exgb-eggkb-jp4ro-eoye7-p5or4-sh5js-mzp3u-djvfk-6ae");
        name = "Robert Williams";
        xp = 800;
        streak = 4;
      },
      {
        userId = Principal.fromText("k5w4v-r4t2q-2rds6-7b2lg-rz5ye-dhpun-aese2-5hlew-6urpx-ypwyw-lqe");
        name = "Emily Brown";
        xp = 600;
        streak = 3;
      },
      {
        userId = Principal.fromText("a6bw2-pbqcd-uylyu-ntsvr-zlnpg-dskg5-tyxui-oqebn-l7h7l-53oje-yqe");
        name = "Michael Johnson";
        xp = 400;
        streak = 2;
      },
    ];
    dummyData;
  };

  // User summary function
  public query ({ caller }) func getUserSummary(userId : Principal) : async UserSummary {
    switch (persistentUserProfiles.get(userId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        {
          name = profile.name;
          email = profile.email;
          xp = profile.xp;
          streak = profile.streak;
          role = profile.role;
        };
      };
    };
  };
};
