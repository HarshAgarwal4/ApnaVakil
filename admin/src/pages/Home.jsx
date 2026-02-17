import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Users from "../components/Users";
import Payments from "../components/Payments";
import Contacts from "../components/Contacts";
import Lawyer from "../components/Lawyers";

export default function Home() {
    const [active, setActive] = useState("dashboard");

    return (
        <div className="min-h-screen flex bg-slate-100">
            <Sidebar active={active} setActive={setActive} />

            <main className="flex-1 p-10">
                {active === "dashboard" && <Dashboard />}
                {active === "users" && <Users />}
                {active === "payments" && <Payments />}
                {active === "contacts" && <Contacts />}
                {active === "lawyers" && <Lawyer /> }
            </main>
        </div>
    );
}
