import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


  if (!session) {
    
    const requestedPage = req.page.name || "";
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = `?p=${requestedPage}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
