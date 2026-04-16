// Type definitions for the application

export interface UserRole {
  isAdmin: boolean;
  isViewer: boolean;
  groups: string[];
}

export interface TokenPayload {
  oid?: string;
  sub?: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  groups?: string[];
  roles?: string[];
  exp?: number;
  iat?: number;
  aud?: string;
  iss?: string;
  tid?: string;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  idToken?: string;
  roles?: UserRole;
  tokenExpiry?: number;
}

export interface ExtendedSession {
  user: SessionUser;
  expires: string;
  accessToken?: string;
  idToken?: string;
  error?: string;
}

export interface GroupCheckResponse {
  isAdmin: boolean;
  isViewer: boolean;
  groups: string[];
  userInfo: {
    name?: string;
    email?: string;
    oid?: string;
  };
}
