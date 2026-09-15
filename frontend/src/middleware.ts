import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  console.log("🚀 Middleware executing for:", req.nextUrl.pathname);

  if (
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const response = NextResponse.next();

  // Add comprehensive security headers
  addSecurityHeaders(response, req);

  return response;
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse, req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const isLocalhost =
    req.nextUrl.hostname === "localhost" ||
    req.nextUrl.hostname === "127.0.0.1";

  // Content Security Policy
  // Extract API URL from environment for production
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const apiHost = new URL(apiUrl).origin; // Gets https://inventario-egl-ajj0.onrender.com

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http://localhost:3001",
    "media-src 'self' data: blob:",
    // Allow connections to backend API (both dev and production)
    `connect-src 'self' http://localhost:3001 ${apiHost} wss: data:`,
    "frame-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  // Relax CSP for development
  if (isDev || isLocalhost) {
    cspDirectives[1] = "script-src 'self' 'unsafe-eval' 'unsafe-inline'";
  }

  // Log CSP for debugging
  const cspHeader = cspDirectives.join("; ");
  console.log("🔒 CSP Header being applied:", cspHeader);
  console.log("🌍 Request URL:", req.nextUrl.href);
  console.log("🔧 Environment:", process.env.NODE_ENV);

  // Security headers
  const headers = {
    // Content Security Policy
    "Content-Security-Policy": cspHeader,

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Prevent clickjacking
    "X-Frame-Options": "DENY",

    // XSS Protection (legacy but still useful)
    "X-XSS-Protection": "1; mode=block",

    // Strict Transport Security (HTTPS only)
    "Strict-Transport-Security": isDev
      ? ""
      : "max-age=31536000; includeSubDomains; preload",

    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions Policy (Feature Policy)
    "Permissions-Policy": [
      "camera=(self), microphone=(), geolocation=()",
      "interest-cohort=(), browsing-topics=()",
      "accelerometer=(), autoplay=(), encrypted-media=(), gyroscope=(), picture-in-picture=()",
    ].join(", "),

    // Cross-Origin Policies
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Resource-Policy": "cross-origin",

    // Cache Control for sensitive pages
    "Cache-Control": req.nextUrl.pathname.includes("/dashboard")
      ? "no-cache, no-store, must-revalidate, private"
      : "public, max-age=31536000, immutable",

    // Custom security headers
    "X-Robots-Tag": req.nextUrl.pathname.includes("/dashboard")
      ? "noindex, nofollow"
      : "index, follow",
    "X-Powered-By": "", // Remove X-Powered-By header
  };

  // Apply headers
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    } else {
      response.headers.delete(key);
    }
  });

  // Add HSTS only in production HTTPS
  if (!isDev && req.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Rate limiting headers (informational)
  response.headers.set("X-RateLimit-Limit", "100");
  response.headers.set("X-RateLimit-Window", "15m");
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
