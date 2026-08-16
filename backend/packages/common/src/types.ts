export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role?: Role;
  workspaceId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
  };
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
