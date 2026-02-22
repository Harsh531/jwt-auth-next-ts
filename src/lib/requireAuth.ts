import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";

interface DecodedToken {
    userId: string;
}

export function requireAuth(request: NextRequest): DecodedToken {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new Error('Token missing'); 
    }

    try {
        const decoded = verifyAccessToken(token) as DecodedToken;
        return decoded
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}