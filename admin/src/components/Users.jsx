import { useEffect } from "react"
import { useStore } from "../zustand/store"

export default function Users() {
  const { allUsers, fetchAllUsers } = useStore()

  useEffect(() => {
    fetchAllUsers()
  }, [])

  return (
    <div className="min-h-[70vh] rounded-3xl p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <h3 className="text-2xl font-bold mb-6 text-slate-700">
        👥 Registered Users
      </h3>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Plan</th>
              </tr>
            </thead>

            <tbody>
              {allUsers.isloading && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              )}

              {!allUsers.isloading && allUsers.users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}

              {allUsers.users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  {/* USER */}
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">
                      {user.name}
                    </span>
                  </td>

                  {/* EMAIL */}
                  <td className="p-4 text-slate-600">{user.email}</td>

                  {/* ROLE */}
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {user.role}
                    </span>
                  </td>

                  {/* PLAN */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.plan === "premium"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
