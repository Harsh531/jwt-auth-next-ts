"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/register', {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();
            if (!res.ok) {
                setError(JSON.stringify(data.error) || "Something went wrong");
                return;
            }

            setSuccess("Account created successfully");
            setEmail("");
            setPassword("");
            setError("");
        } catch (error) {
            setError("Something went wrong")
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center ">
            <form
                onSubmit={handleSubmit}
                className=" p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded mb-4"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded mb-4"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-red-600 text-sm mb-3">{error}</p>
                )}


                {success && (
                    <p className="text-green-600 text-sm mb-3">{success}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                    Register
                </button>
            </form>
        </main>
    )
}