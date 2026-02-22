"use client";


import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, accessToken, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // WAIT until auth check finishes
    if (isLoading) {
        return <div className='flex items-center justify-center w-full min-h-screen'>Loading...</div>;
    }
    return (
        <>
            <Navbar />
            <main className='p-4'>
                {children}
            </main>
        </>
    );
}