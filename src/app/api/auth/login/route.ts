import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { loginSchema } from '@/lib/validators/auth';
import { comparePassword } from '@/lib/password';
import {
    signAccessToken,
    signRefreshToken,
} from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        await connectDB();

        /**
         * 1. Extract the json body from request
         */
        const body = await req.json();

        /**
         * 2. Validate the Request using zod schema
         */
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            )
        }

        /**
         * 3. Extract the email and password
         */
        const { email, password } = parsed.data

        /**
         * 4. Find the user in the database
         */
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        /**
         * 5. Compare the password
         */
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        /**
         * 6. Generate the access and refresh token
         */
        const accessToken = signAccessToken({ userId: `${user._id}`, role: user.role });
        const refreshToken = signRefreshToken({ userId: `${user._id}`, role: user.role });

        /**
         * 7. Add the current refresh token to the list of user refresh tokens(For Multiple devices support)
         */
        user.refreshTokens.push({
            token: refreshToken,
            createdAt: new Date()
        })
        await user.save();

        /**
         * 8. Add the refresh token to the cookies
         */
        const cookieStore = await cookies();
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        });

        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        return NextResponse.json(
            {
                user: safeUser,
                accessToken
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || "Server error" },
                { status: 500 }
            )
        }
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}