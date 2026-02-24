"use client";

import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { accessToken, setAccessToken, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const fetchDataUsingFetch = async () => {
      try {
        const res = await authFetch(
          "/api/dashboard",
          { method: "GET" },
          accessToken,
          setAccessToken,
          logout
        );


        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error(error);
        router.push('/login');

      } finally {
        setLoading(false);
      }


    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/dashboard");

        if (res.status !== 200) {
          throw new Error("Failed to fetch");
        } else {
          setData(res.data);
        }
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            router.push('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();


  }, []);



  // useEffect(() => {

  //   const fetch = async () => {

  //     const res = await authFetch("/api/auth/dashboard", )

  //   }

  //   fetch();

  // }, [])

  if (loading) return <div>Loading...</div>;

  return (
    <main className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
      <h1 className="text-3xl font-bold">
        Protected Dashboard
      </h1>

      <div className="flex flex-col w-fit border rounded-sm p-4">
        <code>{JSON.stringify(data, null, 2)}</code>
      </div>

    </main>
  );
}