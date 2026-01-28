const menu = ["dashboard", "users", "payments", "contacts","lawyers" ,"admin-app"];

export default function Sidebar({ active, setActive }) {
    const openApnaVakilAsAdmin = () => {
        window.open("https://apnavakil.in?mode=admin", "_blank");
    };

    return (
        <aside className="w-72 min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 flex flex-col shadow-[8px_0_30px_rgba(0,0,0,0.4)]">

            {/* LOGO */}
            <div className="flex items-center gap-4 mb-12">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 flex items-center justify-center font-bold shadow-lg">
                    AV
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-amber-400">
                        Apna Vakil
                    </h1>
                    <p className="text-xs text-slate-400">Admin Panel</p>
                </div>
            </div>

            {/* MENU */}
            <nav className="flex-1 space-y-3">
                {menu.map((item) => {
                    const isActive = active === item;

                    return (
                        <button
                            key={item}
                            onClick={() =>
                                item === "admin-app"
                                    ? openApnaVakilAsAdmin()
                                    : setActive(item)
                            }
                            className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all font-medium
                            ${isActive
                                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-lg"
                                    : "text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            <span className={`h-2 w-2 rounded-full ${isActive ? "bg-slate-900" : "bg-slate-500"}`}></span>
                            <span className="text-sm">
                                {item === "admin-app"
                                    ? "USE APNA VAKIL (ADMIN)"
                                    : item.toUpperCase()}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
