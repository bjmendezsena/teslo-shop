import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { token } = req.cookies;

  let isValidToken = false;

  try {
    // await jose.jwtVerify(
    //   token || "",
    //   new TextEncoder().encode(process.env.JWT_SECRET)
    // );
    isValidToken = true;
    return NextResponse.next();
  } catch (error) {
    console.error(`JWT Invalid or not signed in`, { error });
    isValidToken = false;
  }

  // if (!isValidToken) {
  //   const { pathname } = req.nextUrl;
  //   return NextResponse.redirect(new URL(`/auth/login?p=${pathname}`, req.url));
  // }
}
