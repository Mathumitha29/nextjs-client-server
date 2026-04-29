import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  decodeIdToken,
  checkUserGroups,
  fetchUserGroups,
  isTokenExpired,
} from "@/lib/token-utils";
import type { GroupCheckResponse } from "@/types/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth();

    if (!session || !session.idToken) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      );
    }

    // Decode the ID token
    const tokenPayload = await decodeIdToken(session.idToken);

    if (!tokenPayload) {
      return NextResponse.json(
        { error: "Failed to decode ID token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(tokenPayload)) {
      return NextResponse.json(
        { error: "Token expired", code: "TOKEN_EXPIRED" },
        { status: 401 }
      );
    }

    // Check groups from token
    let groupResponse = checkUserGroups(tokenPayload);

    // If no groups in token, try fetching from Graph API
    if (groupResponse.groups.length === 0 && session.accessToken) {
      const fetchedGroups = await fetchUserGroups(session.accessToken);
      if (fetchedGroups.length > 0) {
        const adminGroupId = process.env.ADMIN_GROUP_ID || "";
        const viewGroupId = process.env.VIEW_GROUP_ID || "";

        groupResponse = {
          ...groupResponse,
          groups: fetchedGroups,
          isAdmin: fetchedGroups.includes(adminGroupId),
          isViewer:
            fetchedGroups.includes(viewGroupId) ||
            fetchedGroups.includes(adminGroupId),
        };
      }
    }

    return NextResponse.json({
      ...groupResponse,
      accessToken: session.accessToken,
    });
  } catch (error) {
    console.error("Error in verify-token API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

