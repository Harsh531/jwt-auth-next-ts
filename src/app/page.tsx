import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 py-32 px-16 bg-white dark:bg-black ">


        <h1> JWT Auth - Next.ts </h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-50 text-black hover:bg-gray-100 rounded-sm">
            <Link href="/login">Login</Link>
          </button>

          <button className="px-4 py-2 outline-1 hover:bg-gray-900 rounded-sm">
            <Link href="/signup">SignUp</Link>
          </button>
        </div>


      </main>
    </div>
  );
}
