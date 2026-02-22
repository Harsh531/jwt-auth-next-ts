import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            {/* Left Side */}
            <div className="flex gap-6 items-center">
                <Link
                    href="/dashboard"
                    className="hover:text-blue-400 transition"
                >
                    Dashboard
                </Link>

                <Link
                    href="/settings"
                    className="hover:text-blue-400 transition"
                >
                    Settings
                </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {user && (
                    <div className="text-sm text-gray-300 border rounded-full px-4 ">
                        <p>{user.email}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
