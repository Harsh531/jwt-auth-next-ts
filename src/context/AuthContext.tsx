"use client";

import { authFetch } from "@/lib/authFetch";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    _id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    accessToken: string | null;
    user: User | null;
    setAccessToken: (token: string | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void
    isAuthenticated: boolean,
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathName = usePathname();

    const isAuthenticated = !!accessToken;

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setAccessToken(null);
        setUser(null);
    };

    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await fetch("/api/auth/refresh", {
                    method: "POST"
                });

                if (!res.ok) {
                    return;
                }

                const data = await res.json();
                setAccessToken(data.accessToken);
                // setUser(data.user);
                // console.log(data, "data")

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false); // IMPORTANT
            }
        }


        refresh();
    }, [accessToken]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await authFetch(
                    "/api/profile",
                    { method: "GET" },
                    accessToken,
                    setAccessToken
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch");
                }

                const result = await res.json();
                setUser(result.user);
                console.log(user, "user")
            } catch (error) {
                console.error(error);


            } finally {

            }

        }

        if (accessToken) {
            fetchUserData()
        }
    }, [accessToken])

    console.log(isAuthenticated, "isAuthenticated")
    console.log(user, "user")

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                setAccessToken,
                isAuthenticated,
                isLoading,
                setIsLoading,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider")
    }

    return context;
}