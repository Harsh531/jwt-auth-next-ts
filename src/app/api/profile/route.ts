import { requireAuth } from "@/lib/requireAuth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        /**
         * 1. Get the user id
         */
        const { userId } = requireAuth(request);

        /**
         * 2. Find the user in the database
         */
        const user = await User.findById(userId);

        /**
         * 3. Return the user
         */
        const safeUser = {
            _id: user?._id,
            email: user?.email,
            role: user?.role,
        };

        return NextResponse.json({ user: safeUser, });
    } catch (error) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 400 }
        )
    }
}