"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const getErrorMessage = (error: string | null): string | null => {
    if (!error) return null;

    const errorMessages: Record<string, string> = {
      SessionExpired: "Your session has expired. Please sign in again.",
      OAuthSignin: "Error starting the authentication process.",
      OAuthCallback: "Error during authentication callback.",
      OAuthCreateAccount: "Error creating your account.",
      EmailCreateAccount: "Error creating your account.",
      Callback: "Authentication error. Please try again.",
      OAuthAccountNotLinked: "This account is already linked to another user.",
      SessionRequired: "Please sign in to access this page.",
      Default: "An authentication error occurred. Please try again.",
    };

    return errorMessages[error] || errorMessages.Default;
  };

  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("microsoft-entra-id", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🔐</div>
        <h1 className="login-title">Welcome</h1>
        <p className="login-subtitle">
          Sign in with your Microsoft account to continue
        </p>

        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}

        <button
          onClick={handleSSOLogin}
          disabled={isLoading}
          className="sso-button"
        >
          {isLoading ? (
            <>
              <span className="spinner" style={{ width: 20, height: 20 }}></span>
              Signing in...
            </>
          ) : (
            <>
              <svg className="microsoft-icon" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Sign in with Microsoft SSO
            </>
          )}
        </button>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.75rem",
            color: "#999",
          }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="login-container">
          <div className="login-card">
            <div className="spinner"></div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
