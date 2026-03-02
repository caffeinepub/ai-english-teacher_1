import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface LeaderboardEntry {
    xp: bigint;
    streak: bigint;
    userId: UserId;
    name: string;
}
export type Time = bigint;
export interface BadgeView {
    id: bigint;
    icon: string;
    name: string;
    description: string;
    requirement: string;
}
export type XP = bigint;
export interface UserSummary {
    xp: bigint;
    streak: bigint;
    name: string;
    role: UserRole;
    email: string;
}
export interface UserProfileView {
    xp: bigint;
    streak: bigint;
    name: string;
    createdAt: Time;
    badges: Array<BadgeView>;
    role: UserRole;
    email: string;
    lastActive: Time;
}
export interface AchievementsResponse {
    allBadges: Array<BadgeView>;
    message: string;
    xpEarned: XP;
    newBadge: BadgeView;
}
export interface Badge {
    id: bigint;
    icon: string;
    name: string;
    description: string;
    requirement: string;
}
export enum UserRole {
    admin = "admin",
    user = "user"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminAssignRole(user: Principal, role: UserRole__1): Promise<void>;
    adminGetAllUsers(): Promise<Array<UserProfileView>>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    checkAndUpdateAchievements(userId: UserId, newXP: XP): Promise<AchievementsResponse>;
    getAchievements(): Promise<Array<Badge>>;
    getCallerUserProfile(): Promise<UserProfileView>;
    getCallerUserRole(): Promise<UserRole__1>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getUserProfile(user: UserId): Promise<UserProfileView>;
    getUserSummary(userId: Principal): Promise<UserSummary>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfileView): Promise<UserProfileView>;
}
