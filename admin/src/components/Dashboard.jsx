import { useStore } from "../zustand/store";

export default function Dashboard() {
    const store = useStore()
    return (
        <>
            <h2 className="text-3xl font-semibold text-slate-800 mb-8 capitalize">
                Dashboard
            </h2>
            <div className="min-h-[70vh] rounded-3xl p-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                    <Stat title="Total Users" value={store.allUsers.isloading ? "Calculating..." : store.allUsers.users.length} color="indigo" />
                    <Stat title="Total Payments" value={store.AllPayments.isloading ? "Calculating..." : store.AllPayments.payments.length} color="emerald" />
                    <Stat title="Contact Requests" value={store.contacts.isloading ? "Calculating..." : store.contacts.contacts.length} color="amber" />
                    <Stat title="Lawyers Added" value={store.Lawyers.isloading ? "Calculating..." : store.Lawyers.lawyers.length} color="amber" />
                </div>
            </div>
        </>
    );
}

function Stat({ title, value, color }) {
    return (
        <div className="bg-white rounded-2xl p-6 border shadow-md">
            <p className="text-sm text-slate-500">{title}</p>
            <h3 className={`text-3xl font-bold text-${color}-600 mt-3`}>
                {value}
            </h3>
        </div>
    );
}
