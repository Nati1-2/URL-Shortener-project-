import { Role, User } from "./auth.types";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: "starter" | "pro" | "enterprise";
  currentUserRole: Role;
  membersCount: number;
  linksCount: number;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  user: User;
  role: Role;
  joinedAt: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: Role;
  invitedBy: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
}

export interface InviteMemberDto {
  email: string;
  role: Role;
}
