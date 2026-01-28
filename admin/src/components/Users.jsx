export default function Users() {
    return (
        <div className="min-h-[70vh] rounded-3xl p-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <h3 className="text-xl font-semibold mb-6">Registered Users</h3>

            <div className="bg-white rounded-2xl shadow-lg p-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-slate-500">
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-4">Rahul Sharma</td>
                            <td className="p-4">rahul@gmail.com</td>
                            <td className="p-4 text-green-600">Active</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
