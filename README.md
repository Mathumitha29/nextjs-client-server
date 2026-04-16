# Next.js SSO Application with Microsoft Entra ID

A Next.js application with Microsoft Entra ID (Azure AD) Single Sign-On (SSO) authentication, role-based access control, and session management.

## Features

- 🔐 **Microsoft Entra ID SSO** - OAuth 2.0 authentication with Microsoft identity platform
- 🎫 **Token Management** - Access token and ID token handling with automatic refresh
- 👥 **Role-Based Access Control** - Admin and Viewer roles based on Azure AD groups
- ⏱️ **Session Expiry Handling** - Automatic session refresh and expiry warnings
- 🔒 **Protected Routes** - Middleware-based route protection
- 🎨 **Modern UI** - Clean, responsive design with dark mode support

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Microsoft Azure subscription with access to Microsoft Entra ID
- Azure AD App Registration

## Azure AD Setup

### 1. Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** > **App registrations**
3. Click **New registration**
4. Enter a name for your application
5. Set **Supported account types** (typically "Accounts in this organizational directory only")
6. Add **Redirect URI**: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
7. Click **Register**

### 2. Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Platform configurations**, ensure Web is configured with:
   - Redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
3. Enable **ID tokens** and **Access tokens** under Implicit grant and hybrid flows
4. Click **Save**

### 3. Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description and select expiry
4. Copy the **Value** (you won't be able to see it again!)

### 4. Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Delegated permissions**
4. Add the following permissions:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
   - `GroupMember.Read.All` (for group membership)
5. Click **Grant admin consent** (requires admin privileges)

### 5. Configure Group Claims (Optional but Recommended)

1. Go to **Token configuration**
2. Click **Add groups claim**
3. Select **Security groups** or **Groups assigned to the application**
4. For ID token, select **Group ID**
5. Click **Add**

### 6. Create Azure AD Groups

1. Go to **Microsoft Entra ID** > **Groups**
2. Create an **Admin Group** for admin users
3. Create a **Viewer Group** for read-only users
4. Copy the **Object ID** of each group

## Installation

1. Clone the repository and navigate to the project:

```bash
cd nextjs-client-server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Azure AD configuration:

```env
# Microsoft Entra ID Configuration
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Group IDs for RBAC
ADMIN_GROUP_ID=your-admin-group-object-id
VIEW_GROUP_ID=your-viewer-group-object-id

# Session Configuration (in seconds)
SESSION_MAX_AGE=3600
```

5. Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth API routes
│   │   └── verify-token/route.ts         # Token verification & group check API
│   ├── admin/page.tsx                    # Admin-only page
│   ├── dashboard/page.tsx                # Main dashboard
│   ├── login/page.tsx                    # Login page with SSO button
│   ├── view/page.tsx                     # Viewer access page
│   ├── globals.css                       # Global styles
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Root redirect
├── components/
│   ├── providers/auth-provider.tsx       # Session provider wrapper
│   ├── AccessDenied.tsx                  # Access denied component
│   ├── Header.tsx                        # Header with navigation
│   └── Loading.tsx                       # Loading spinner
├── hooks/
│   ├── useSessionExpiry.ts               # Session expiry hook
│   └── useUserRoles.ts                   # User roles hook
├── lib/
│   ├── auth.ts                           # NextAuth configuration
│   └── token-utils.ts                    # Token decoding utilities
├── types/
│   └── auth.ts                           # TypeScript type definitions
└── middleware.ts                         # Route protection middleware
```

## Authentication Flow

1. User clicks "Sign in with Microsoft SSO" on the login page
2. User is redirected to Microsoft login
3. After successful authentication, Microsoft redirects back with authorization code
4. NextAuth exchanges the code for access token, ID token, and refresh token
5. Tokens are stored in an encrypted JWT session cookie
6. The `/api/verify-token` endpoint decodes the ID token and checks group memberships
7. User is granted access based on their group membership (Admin or Viewer)

## API Endpoints

### GET /api/verify-token

Returns the current user's group membership and access level.

**Response:**
```json
{
  "isAdmin": true,
  "isViewer": true,
  "groups": ["group-id-1", "group-id-2"],
  "userInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "oid": "user-object-id"
  }
}
```

### POST /api/verify-token

Verify a specific ID token (useful for manual token verification).

**Request Body:**
```json
{
  "idToken": "eyJ...",
  "accessToken": "eyJ..." // Optional, for fetching groups from Graph API
}
```

## Session Management

- Sessions are stored as encrypted JWTs in cookies
- Access tokens are automatically refreshed when they expire
- Session expiry warnings appear 5 minutes before expiration
- Users can extend their session or will be automatically signed out

## Role-Based Access Control

| Role | Dashboard | View Page | Admin Page |
|------|-----------|-----------|------------|
| No Role | ❌ | ❌ | ❌ |
| Viewer | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ |

## Troubleshooting

### "Groups not appearing in token"

- Ensure group claims are configured in **Token configuration**
- If you have more than 200 groups, Azure uses an overage claim instead
- The app will fallback to fetching groups via Microsoft Graph API

### "Invalid redirect URI"

- Ensure the redirect URI in Azure exactly matches: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
- For production, add the production URL as well

### "AADSTS700016: Application not found"

- Verify the Client ID in your `.env.local` matches Azure
- Ensure the app registration is in the correct tenant

### "Session expired immediately"

- Check that `SESSION_MAX_AGE` is set correctly
- Verify system time is synchronized

## Production Deployment

1. Add production redirect URI in Azure AD:
   `https://your-domain.com/api/auth/callback/microsoft-entra-id`

2. Update environment variables:
   ```env
   NEXTAUTH_URL=https://your-domain.com
   ```

3. Deploy to your preferred platform (Vercel, Azure, AWS, etc.)

## Security Considerations

- Always use HTTPS in production
- Keep client secrets secure and rotate them periodically
- Use minimal required permissions
- Enable MFA in Azure AD for enhanced security
- Monitor sign-in logs in Azure AD

## License

MIT