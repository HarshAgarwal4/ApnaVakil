import { useEffect } from "react"
import { useStore } from "../zustand/store"

export default function Contacts() {
  const { contacts, fetchContacts } = useStore()

  return (
    <>
      {/* <h2 className="text-3xl font-semibold text-slate-800 mb-8 capitalize">
        {"Contacts"}
      </h2> */}
      <div className="min-h-[70vh] rounded-3xl p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <h3 className="text-2xl font-bold mb-6 text-slate-700">
          📩 Contact Requests
        </h3>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 text-left">Sender</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Message</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {/* LOADING */}
                {contacts?.isloading && (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-500">
                      Loading messages...
                    </td>
                  </tr>
                )}

                {/* EMPTY */}
                {!contacts?.isloading && contacts?.messages?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-500">
                      No contact requests found
                    </td>
                  </tr>
                )}

                {/* DATA */}
                {contacts?.contacts?.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-b hover:bg-indigo-50 transition"
                  >
                    {/* SENDER */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                        {contact.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-700">
                        {contact.name}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 text-slate-600">
                      {contact.email}
                    </td>

                    {/* MESSAGE */}
                    <td className="p-4 text-slate-700 max-w-md truncate">
                      {contact.message}
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-slate-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}