import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from "@/models/User";
import { registerSchema } from '@/lib/validators/auth';
import { hashPassword } from '@/lib/password';

export async function POST(req: Request, res: Response) {
    try {
        await connectDB();

        /**
         * 1. Extract the json body from request
         */
        const body = await req.json();

        /**
         * 2. Validate the request body using zod schema
         */
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error || "Invalid data" }, { status: 400 })
        }

        /**
         * 3. Extract the email and password from request body
         */
        const { email, password } = parsed.data;

        /**
         * 4. Check if user already exists 
         */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        /**
         * 5. Creates a hashed password using bcrypt
         */
        const hashedPassword = await hashPassword(password);

        /**
         * 6. Create a new user
         */
        await User.create({
            email,
            password: hashedPassword
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        )
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