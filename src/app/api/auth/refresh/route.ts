import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/jwt';
import User from "@/models/User";

export async function POST() {
    try {
        /**
         * 1. Get the old refresh token from the cookie
         */
        const cookieStore = await cookies();
        const oldToken = cookieStore.get("refreshToken")?.value;
        if (!oldToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        /**
         * 2. Verify the old refresh token
         */
        const decoded = verifyRefreshToken(oldToken) as {
            userId: string;
        };

        if (!decoded?.userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        /**
         * 3. Find the user in the database
         */
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }


        /**
         * 4. Check if the old refresh token exists in the database
         */
        const tokenExists = user.refreshTokens.some((t) => t.token === oldToken);
        if (!tokenExists) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }


        /**
         * 5. Remove the old refresh token from the database
         */
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== oldToken);




        /**
         * 6. Generate a new access/ refresh token 
         */
        const newAccessToken = signAccessToken({ userId: `${user._id}`, role: user.role, });
        const newRefreshToken = signRefreshToken({ userId: `${user._id}`, role: user.role });


        /**
         * 7. Add the new refresh token to the database
         */
        user.refreshTokens.push({
            token: newRefreshToken,
            createdAt: new Date(),
        });
        await user.save();


        /**
         * 8. Set the new refresh token in the cookie
         */
        cookieStore.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        })


        return NextResponse.json(
            { accessToken: newAccessToken },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
}