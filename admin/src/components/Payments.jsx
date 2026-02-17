import { useEffect } from "react"
import { useStore } from "../zustand/store"

export default function Payments() {
  const { AllPayments, fetchPayments } = useStore()

  return (
    <div className="min-h-[70vh] rounded-3xl p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <h3 className="text-2xl font-bold mb-6 text-slate-700">
        💳 Payment Transactions
      </h3>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Plan</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment ID</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Expiry</th>
              </tr>
            </thead>
            
            <tbody>
              {/* LOADING */}
              {AllPayments.isloading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    Loading payments...
                  </td>
                </tr>
              )}

              {/* EMPTY */}
              {!AllPayments.isloading && AllPayments.payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No payment records found
                  </td>
                </tr>
              )}

              {/* DATA */}
              {AllPayments.payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  {/* EMAIL */}
                  <td className="p-4 font-medium text-slate-700">
                    {payment.email}
                  </td>

                  {/* PLAN */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.plan === "Premium"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {payment.plan}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="p-4 font-semibold text-green-600">
                    ₹{payment.amount}
                  </td>

                  {/* PAYMENT ID */}
                  <td className="p-4 text-slate-600">
                    {payment.paymentId}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-slate-600">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>

                  {/* EXPIRY */}
                  <td className="p-4 text-slate-600">
                    {new Date(Number(payment.expiryDate)).toLocaleDateString()}
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
