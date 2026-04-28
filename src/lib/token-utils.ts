import * as jose from "jose";
import type { TokenPayload, GroupCheckResponse } from "@/types/auth";

// JWKS client for verifying Microsoft tokens
const JWKS_URL = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/discovery/v2.0/keys`;

let jwks: jose.JWTVerifyGetKey | null = null;

async function getJWKS() {
  if (!jwks) {
    jwks = jose.createRemoteJWKSet(new URL(JWKS_URL));
  }
  return jwks;
}

/**
 * Decode and verify the ID token from Microsoft Entra ID
 */
export async function decodeIdToken(idToken: string): Promise<TokenPayload | null> {
  try {
    const JWKS = await getJWKS();

    const { payload } = await jose.jwtVerify(idToken, JWKS, {
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
      audience: process.env.AZURE_AD_CLIENT_ID,
    });

    return payload as TokenPayload;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    // Never fall back to unverified decode — a failed signature check means
    // the token must be rejected outright.
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(tokenPayload: TokenPayload): boolean {
  if (!tokenPayload.exp) return true;
  return Date.now() >= tokenPayload.exp * 1000;
}

/**
 * Get user groups from decoded token and check admin/viewer access
 */
export function checkUserGroups(tokenPayload: TokenPayload): GroupCheckResponse {
  const groups = tokenPayload.groups || [];
  const adminGroupId = process.env.ADMIN_GROUP_ID || "";
  const viewGroupId = process.env.VIEW_GROUP_ID || "";

  const isAdmin = groups.includes(adminGroupId);
  const isViewer = groups.includes(viewGroupId) || isAdmin; // Admin also has viewer access

  return {
    isAdmin,
    isViewer,
    groups,
    userInfo: {
      name: tokenPayload.name,
      email: tokenPayload.preferred_username || tokenPayload.email,
      oid: tokenPayload.oid,
    },
  };
}

/**
 * Fetch user groups from Microsoft Graph API
 * Use this if groups are not included in the token claims
 */
export async function fetchUserGroups(accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/memberOf",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.status}`);
    }

    const data = await response.json();
    const groups: string[] = data.value
      .filter((item: { "@odata.type": string }) => item["@odata.type"] === "#microsoft.graph.group")
      .map((group: { id: string }) => group.id);

    return groups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
}
