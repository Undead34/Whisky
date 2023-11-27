import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import config from "./config";

export async function middleware(request: NextRequest) {
  const requestURL = new URL(request.url);
  const searchParams = new URLSearchParams(requestURL.search);
  const ID = searchParams.get("id") || searchParams.get("client_id") || uuid();

  if (requestURL.pathname === config.url.base && request.url.includes(".")) {
    await fetch(requestURL.origin + "/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ID }),
    });

    return NextResponse.rewrite(requestURL.origin);
  } else if (requestURL.pathname === "/") {
    // If ID redirect
    if (ID && ID.length !== 0) {
      const tokenBuffer = crypto.getRandomValues(new Uint8Array(256));
      let binary = "";
      tokenBuffer.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      const token = btoa(binary);
      const uri = encodeURIComponent(config.url.redirect);

      let rewriteURL = config.url.searchParams.replace("{uuid}", ID);
      rewriteURL = rewriteURL.replace("{token}", token);
      rewriteURL = rewriteURL.replace("{encodeURIComponent}", uri);
      rewriteURL = requestURL.origin + config.url.base + rewriteURL;

      return NextResponse.redirect(rewriteURL);
    }
  }

  // Verifica si la solicitud es para un recurso de imagen en la ruta "/observer"
  if (/\/observer\.(png|jpg|svg|ico|jpeg|.{4})$/i.test(request.url)) {
    await fetch(requestURL.origin + "/api/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ID }),
    });
  }

  return NextResponse.next();
}
