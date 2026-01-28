import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Users from "../components/Users";
import Payments from "../components/Payments";
import Contacts from "../components/Contacts";

export default function Home() {
    const [active, setActive] = useState("dashboard");

    return (
        <div className="min-h-screen flex bg-slate-100">
            <Sidebar active={active} setActive={setActive} />

            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold text-slate-800 mb-8 capitalize">
                    {active}
                </h2>

                {active === "dashboard" && <Dashboard />}
                {active === "users" && <Users />}
                {active === "payments" && <Payments />}
                {active === "contacts" && <Contacts />}
            </main>
        </div>
    );
}
