# Security Audit Report

**Project:** SSO Next.js — Client Server & Admin Zone  
**Date:** 29 April 2026  
**Scope:** Authentication, authorisation, token handling, routing, secrets management  

---

## Summary

| Severity | Found | Fixed | Outstanding |
|---|---|---|---|
| 🔴 Critical | 1 | 1 | 0 |
| 🟠 High | 1 | 1 | 0 |
| 🟡 Medium | 1 | 1 | 0 |
| ✅ Passing | 13 | — | — |

All identified vulnerabilities have been remediated.

---

## Vulnerabilities Found & Fixed

### 🔴 CVE-1 — Unverified JWT Fallback (Critical)

**File:** `src/lib/token-utils.ts`  
**OWASP:** A07:2021 – Identification and Authentication Failures

**Description:**  
`decodeIdToken()` caught exceptions thrown by `jose.jwtVerify()` and silently fell back to `jose.decodeJwt()`, which performs **no signature validation**. An attacker could craft a token with forged `groups`, `oid`, and `email` claims (e.g. declaring themselves a member of the admin group) and it would be accepted as legitimate.

**Vulnerable code:**
```ts
} catch (error) {
  // INSECURE: decodeJwt does not verify the signature
  const decoded = jose.decodeJwt(idToken);
  return decoded as TokenPayload;
}
```

**Fix:**  
Removed the fallback entirely. A failed `jwtVerify` now returns `null` and the request is rejected with 400/401.

```ts
} catch (error) {
  console.error("Error verifying ID token:", error);
  // Never fall back to unverified decode — a failed signature check means
  // the token must be rejected outright.
  return null;
}
```

---

### 🟠 CVE-2 — Unauthenticated POST `/api/verify-token` (High)

**File:** `src/app/api/verify-token/route.ts`  
**OWASP:** A01:2021 – Broken Access Control

**Description:**  
A `POST` handler on the verify-token endpoint accepted an arbitrary `idToken` and `accessToken` directly from the request body with no authentication gate. Any internet client could submit a valid Microsoft token for any Entra user and receive back their group membership, effectively turning the endpoint into a group enumeration oracle.

**Vulnerable code:**
```ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { idToken, accessToken } = body;
  // No session check — processes any token from any caller
  ...
}
```

**Fix:**  
Removed the POST handler entirely. The GET endpoint (session-cookie gated via `auth()`) is the only interface the admin zone needs.

---

### 🟡 CVE-3 — Trailing Character in `VIEW_GROUP_ID` (Medium)

**File:** `nextjs-client-server/.env.local`  
**OWASP:** A05:2021 – Security Misconfiguration

**Description:**  
`VIEW_GROUP_ID` had a trailing `-` appended to the UUID, causing `groups.includes(viewGroupId)` to never match. All users were silently denied the viewer role regardless of their actual group membership.

**Vulnerable value:**
```
VIEW_GROUP_ID=ce14a8be-bbc4-4314-a5aa-940c1a1f1913-
```

**Fix:**
```
VIEW_GROUP_ID=ce14a8be-bbc4-4314-a5aa-940c1a1f1913
```

---

## Passing Controls

### Authentication & Token Security

| Control | Detail |
|---|---|
| JWT signature verification | Every ID token is verified against Microsoft's JWKS endpoint with issuer and audience checks (`jose.jwtVerify`) |
| Token expiry checked independently | `isTokenExpired()` validates `exp` claim server-side after signature verification |
| Refresh token rotation | `refreshAccessToken()` stores the new `refresh_token` returned by Entra ID on each refresh |
| Session strategy | `jwt` strategy — no database dependency; session is HMAC-signed with `NEXTAUTH_SECRET` |
| Debug mode | `debug` is gated to `NODE_ENV === 'development'` — no token details logged in production |

### Authorisation

| Control | Detail |
|---|---|
| Admin check is server-side only | `verifyAdminSession()` in `admin-session.ts` is a server function; the result is never trusted from the client |
| Group membership verified on every request | Admin-zone dashboard uses `export const dynamic = "force-dynamic"` — no cached auth decisions |
| Role checks on all protected pages | Both `/admin` and `/view` routes check `roles.isAdmin` / `roles.isViewer` before rendering |
| Microsoft Graph API fallback | If groups are not embedded in the token, they are fetched from `https://graph.microsoft.com/v1.0/me/memberOf` using the user's access token |

### Routing & Middleware

| Control | Detail |
|---|---|
| All routes protected by middleware | `auth()` middleware in `nextjs-client-server` guards every route except `/login` and `/api/auth` |
| Admin-zone has its own middleware | Cookie presence checked before serving any admin-zone page |
| Open redirect prevention | `redirect` callback in `auth.ts` restricts `callbackUrl` to same origin only |
| Session expiry handled | `RefreshAccessTokenError` triggers immediate redirect to `/login?error=SessionExpired` |

### Cookie & Transport Security

| Control | Detail |
|---|---|
| Chunked session cookies forwarded | All `authjs.session-token.*` chunks are collected and forwarded to `/api/verify-token` |
| `cache: "no-store"` on auth calls | Prevents stale authorisation responses being served from any cache layer |
| `__Secure-` prefix in production | NextAuth uses the `__Secure-authjs.session-token` prefix automatically when served over HTTPS |

### Secrets Management

| Control | Detail |
|---|---|
| `.env.local` not committed | `.gitignore` explicitly excludes `.env.local` and `.env*.local` |
| `.env.example` provided | Template committed without real values for onboarding |
| `NEXTAUTH_SECRET` shared correctly | Both apps use the same secret (admin-zone needs it to verify the shared session cookie) |

---

## Production Recommendations

These are not current vulnerabilities but should be addressed before production deployment:

1. **Force HTTPS** — Set `NEXTAUTH_URL=https://yourdomain.com`. NextAuth automatically switches to `__Secure-` prefixed cookies, which are HTTPS-only.

2. **Set `sameSite: strict` on session cookies** — Add a `cookies` override in `authConfig` to harden against CSRF:
   ```ts
   cookies: {
     sessionToken: {
       options: { sameSite: "strict", secure: true, httpOnly: true }
     }
   }
   ```

3. **Restrict CORS on `/api/verify-token`** — Add a check that the `Host` header matches the expected domain to prevent DNS rebinding attacks in internal network deployments.

4. **Rotate `NEXTAUTH_SECRET` periodically** — All active sessions will be invalidated on rotation; plan for a maintenance window.

5. **Enable token binding / PKCE** — Already supported by `MicrosoftEntraID` provider; verify it is enabled in the Azure App Registration.
