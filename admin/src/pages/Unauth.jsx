import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";

export default function Unauthorized() {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);

    const handleLogoutAndLogin = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const handleLogoutAndHome = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-black px-4">
            <div className="max-w-md w-full text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">

                {/* Icon */}
                <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-3xl shadow-lg">
                    ⛔
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">
                    Access Denied
                </h1>

                <p className="text-sm text-gray-300 mb-8">
                    You don’t have permission to view this page.
                    Please login with the correct account or contact the administrator.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleLogoutAndLogin}
                        className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
                    >
                        Go to Login
                    </button>

                    <button
                        onClick={handleLogoutAndHome}
                        className="py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
                    >
                        Back to Home
                    </button>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    Error code: 403 – Unauthorized Access
                </p>
            </div>
        </div>
    );
}
