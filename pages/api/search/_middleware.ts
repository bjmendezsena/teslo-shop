import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const q = req.page.params?.q;

  if (!q) {
    return new Response(
      JSON.stringify({
        message: "Necesita un query válido",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return NextResponse.next();
}
