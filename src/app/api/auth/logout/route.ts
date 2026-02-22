import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import { verifyRefreshToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";

export async function POST() {

    try {
        await connectDB();

        /**
         * 1. Get the refresh token from the cookie
         */
        const cookieStore = await cookies();
        const token = cookieStore.get("refreshToken")?.value;

        if (token) {
            /**
             * 2. Verify the refresh token
             */
            const decoded = verifyRefreshToken(token) as { userId: string }

            /**
             * 3. Find the user in the database
             */
            const user = await User.findById(decoded.userId);
            if (user) {
                /**
                 * 4. Remove the current refresh token from the user refresh token list in thedatabase
                 */
                user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
                await user.save();
            }

        }

        /**
         * 5. Delete the refresh token cookie
         */
        cookieStore.set("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/"
        });

        return NextResponse.json(
            { message: "Logout successfully" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { error: "Error" },
            { status: 500 }
        )
    }

}