import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import config from "./config";

export function middleware(request: NextRequest) {
  const requestURL = new URL(request.url);
  const searchParams = new URLSearchParams(requestURL.search);
  const userID = searchParams.get("id") || uuid();

  if (request.nextUrl.pathname === config.url.base) {
    return NextResponse.rewrite(request.nextUrl.origin);
  } else if (request.nextUrl.pathname === "/") {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const userID = searchParams.get("id");

    // If ID redirect
    if (userID && userID.length !== 0) {
      const tokenBuffer = crypto.getRandomValues(new Int8Array(256));
      const token = btoa(String.fromCharCode(...tokenBuffer));
      const uri = encodeURIComponent(config.url.redirect);

      let rewriteURL = config.url.searchParams.replace("{uuid}", userID);
      rewriteURL = rewriteURL.replace("{token}", token);
      rewriteURL = rewriteURL.replace("{encodeURIComponent}", uri);
      rewriteURL = request.nextUrl.origin + config.url.base + rewriteURL;

      return NextResponse.redirect(rewriteURL);
    }
  }

  if (request.url.includes("/observer")) {
    console.log("Image Query");
  }

  return NextResponse.next();
}
