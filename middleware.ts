import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { url } from "./backend/config";
import { v4 as uuid } from "uuid";

export async function middleware(request: NextRequest) {
  const requestURL = new URL(request.url);
  const searchParams = new URLSearchParams(requestURL.search);
  const ID = searchParams.get("id") || searchParams.get("client_id") || uuid();

  if (requestURL.pathname === url.base) {
    return NextResponse.rewrite(requestURL.origin);
  } else if (requestURL.pathname === "/") {
    // If ID redirect
    if (ID && ID.length !== 0) {
      const tokenBuffer = crypto.getRandomValues(new Uint8Array(256));
      let binary = "";

      // Generate random base64 URL safe token
      tokenBuffer.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      const token = btoa(binary);
      const uri = encodeURIComponent(url.redirect);

      let rewriteURL = url.searchParams.replace("{uuid}", ID);
      rewriteURL = rewriteURL.replace("{token}", token);
      rewriteURL = rewriteURL.replace("{encodeURIComponent}", uri);
      rewriteURL = requestURL.origin + url.base + rewriteURL;

      return NextResponse.redirect(rewriteURL);
    }
  }

  // Check if the request is for an image resource in the path "/observer"
  if (/\/observer\.(png|jpg|svg|ico|jpeg|.{4})$/i.test(request.nextUrl.pathname)) {
    await fetch(requestURL.origin + "/api/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ID }),
    });
  }

  return NextResponse.next();
}
