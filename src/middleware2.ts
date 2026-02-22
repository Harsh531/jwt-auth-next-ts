import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server.js';
import { verifyAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
        // return NextResponse.redirect(new URL("/login", request.url))
    }

    const token = authHeader?.split(" ")[1];

    try {
        verifyAccessToken(token!);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};