export default function Dashboard() {
    return (
        <div className="min-h-[70vh] rounded-3xl p-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                <Stat title="Total Users" value="3,420" color="indigo" />
                <Stat title="Total Payments" value="₹12.8L" color="emerald" />
                <Stat title="Contact Requests" value="186" color="amber" />
            </div>
        </div>
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
