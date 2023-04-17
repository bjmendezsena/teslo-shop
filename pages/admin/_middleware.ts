import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = req.nextUrl.clone();

  if (!session) {
    const requestedPage = req.page.name || "";
    url.pathname = "/auth/login";
    url.search = `?p=${requestedPage}`;
    return NextResponse.redirect(url);
  }

  const validRoles = ["admin"];

  if (!validRoles.includes(session.user.role)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
