import { Component } from "react";
import { ShieldAlert, KeyRound, RefreshCw } from "lucide-react";

/**
 * ApiErrorBoundary
 * ─────────────────
 * Wraps any subtree that calls Groq AI services.
 * Catches two categories of runtime error:
 *   1. Missing API key  (VITE_GROQ_API_KEY not set)
 *   2. Rate-limit / 429 errors returned by the Groq API
 *
 * All other errors are re-thrown so they surface normally.
 */
export class ApiErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorType: null, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    const msg = error?.message ?? "";

    if (
      msg.includes("VITE_GROQ_API_KEY") ||
      msg.includes("AI service is unavailable")
    ) {
      return { hasError: true, errorType: "missing_key", errorMessage: msg };
    }

    if (
      msg.includes("429") ||
      msg.toLowerCase().includes("rate limit") ||
      msg.toLowerCase().includes("rate_limit_exceeded") ||
      msg.toLowerCase().includes("too many requests")
    ) {
      return { hasError: true, errorType: "quota", errorMessage: msg };
    }

    // Not an API/key error — let it propagate to the next boundary
    return null;
  }

  componentDidCatch(error, info) {
    console.error("[ApiErrorBoundary] caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorType: null, errorMessage: "" });
  };

  render() {
    const { hasError, errorType } = this.state;

    if (!hasError) return this.props.children;

    const isMissingKey = errorType === "missing_key";

    return (
      <div
        id="api-error-boundary-fallback"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "1rem",
          margin: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1.25rem",
            padding: "2.5rem 2rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: isMissingKey
                ? "rgba(239,68,68,0.15)"
                : "rgba(251,146,60,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              border: `1px solid ${isMissingKey ? "rgba(239,68,68,0.3)" : "rgba(251,146,60,0.3)"}`,
            }}
          >
            {isMissingKey ? (
              <KeyRound size={28} color="#ef4444" />
            ) : (
              <ShieldAlert size={28} color="#fb923c" />
            )}
          </div>

          {/* Headline */}
          <h2
            style={{
              color: "#f1f5f9",
              fontSize: "1.35rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            {isMissingKey ? "API Key Not Configured" : "Service Temporarily Unavailable"}
          </h2>

          {/* Sub-text */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              margin: "0 0 1.75rem",
            }}
          >
            {isMissingKey ? (
              <>
                The <code style={{ color: "#7dd3fc", background: "rgba(125,211,252,0.1)", padding: "0.1em 0.4em", borderRadius: 4 }}>VITE_GROQ_API_KEY</code>{" "}
                environment variable is missing. Create a{" "}
                <code style={{ color: "#7dd3fc", background: "rgba(125,211,252,0.1)", padding: "0.1em 0.4em", borderRadius: 4 }}>.env.local</code>{" "}
                file in the project root and add your Groq API key, then restart the dev server.
              </>
            ) : (
              "The Groq AI service has temporarily hit its rate limit. Please wait a moment and try again, or check your usage in the Groq console."
            )}
          </p>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {!isMissingKey && (
              <button
                id="api-error-retry-btn"
                onClick={this.handleRetry}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 1.25rem",
                  borderRadius: "0.6rem",
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <RefreshCw size={14} />
                Retry
              </button>
            )}

            <a
              id="api-error-studio-link"
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.55rem 1.25rem",
                borderRadius: "0.6rem",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "#cbd5e1",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              Open Groq Console
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ApiErrorBoundary;
