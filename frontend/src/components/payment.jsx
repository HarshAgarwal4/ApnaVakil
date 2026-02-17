import React, { useContext, useState, useEffect } from "react";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";

export default function PricingBox() {
    const {
        user,
        showPricingBox,
        setShowPricingBox,
        setUser,
        isPaid,
        setIsPaid,
        plan,
        setPlan,
    } = useStore()

    const navigate = useNavigate();
    const [showDashboard, setShowDashboard] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        if (showDashboard) fetchHistory();
    }, [showDashboard]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get("/getPayments");
            if (res.status === 200 && res.data.status === 1) {
                const payments = res.data.payments;
                setPaymentHistory(Array.isArray(payments) && payments.length > 0 ? payments.reverse() : []);
            }
        } catch (err) {
            console.error("🚨 Error fetching payments:", err);
        }
    };

    const handlePayment = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const { data } = await axios.post("/payment", {
                amount: 20,
                currency: "INR",
            });

            const { order } = data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Apna Vakil",
                description: "Basic Plan Purchase",
                order_id: order.id,
                handler: async (response) => {
                    const verifyRes = await axios.post("/verifyPayment", response);
                    if (verifyRes.data.success) {
                        alert("Payment successful!");
                        setUser((prev) => ({ ...prev, plan: "Basic" }));
                        setShowPricingBox(false);
                        setIsPaid(true);
                        setPlan("Basic");

                        let i = 0;
                        while (i < 3) {
                            try {
                                const save = await axios.post("/savePayment", {
                                    userId: user._id,
                                    amount: 20,
                                    plan: "Basic",
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    signature: response.razorpay_signature,
                                });

                                if (save.data.status === 1) break;
                            } catch (err) {
                                console.error(err.message || err);
                            }
                            i++;
                            if (i === 3) console.warn("❌ Failed to save payment after 3 attempts.");
                        }
                    } else {
                        alert("Payment verification failed!");
                    }
                },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Error initiating payment:", err);
        }
    };

    return (
        <>
            {/* Main Pricing Box */}
            <div
                className="
                    bg-white rounded-2xl shadow-2xl p-6
                    fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw]
                    text-center border border-gray-200 z-50
                    transition-all duration-300
                "
            >
                <nav className="flex justify-between items-center mb-4">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Apna Vakil</h1>
                    <button
                        onClick={() => setShowPricingBox(false)}
                        className="text-gray-600 hover:text-red-600 text-lg sm:text-xl"
                    >
                        ❌
                    </button>
                </nav>

                <p className="text-gray-500 mb-6 text-sm sm:text-base">
                    Your personal legal assistant chatbot
                </p>

                <div className="border-t border-b border-gray-100 py-6 mb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">₹20</h2>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">One-time access</p>
                </div>

                <ul className="text-gray-600 text-sm sm:text-base space-y-2 mb-6 text-left px-4 sm:px-8">
                    <li>✔ Ask unlimited legal questions</li>
                    <li>✔ Instant AI-powered answers</li>
                    <li>✔ 24/7 availability</li>
                </ul>

                <button
                    onClick={() => {
                        if (isPaid && plan === "Basic") {
                            alert("Monthly plan already activated");
                        } else {
                            handlePayment();
                        }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-base transition-all duration-300 mb-3"
                >
                    {isPaid && plan === "Basic" ? "Already Activated" : "Pay ₹20"}
                </button>

                <button
                    onClick={() => setShowDashboard(true)}
                    className="w-full border border-blue-500 text-blue-600 hover:bg-blue-50 py-2 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300"
                >
                    View Past Payments
                </button>

                <p className="text-xs sm:text-sm text-gray-400 mt-4">
                    Secure payment powered by Razorpay
                </p>
            </div>

            {/* Dashboard Modal */}
            {showDashboard && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50 p-4 sm:p-0 overflow-auto">
                    <div className="bg-white w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40vw] rounded-2xl shadow-2xl p-5 relative max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setShowDashboard(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-lg sm:text-xl"
                        >
                            ❌
                        </button>

                        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
                            Past Payments
                        </h2>

                        {paymentHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm sm:text-base border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-700">
                                            <th className="py-2 px-2 sm:px-4 text-left">Date</th>
                                            <th className="py-2 px-2 sm:px-4 text-left">Amount</th>
                                            <th className="py-2 px-2 sm:px-4 text-left">Plan</th>
                                            <th className="py-2 px-2 sm:px-4 text-left">Expiry</th>
                                            <th className="py-2 px-2 sm:px-4 text-left">Payment Id</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((p, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-2 sm:px-4">
                                                    {new Date(p.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-2 px-2 sm:px-4">₹{p.amount}</td>
                                                <td className="py-2 px-2 sm:px-4">{p.plan}</td>
                                                <td
                                                    className={`py-2 px-2 sm:px-4 font-medium ${
                                                        p.status === "paid"
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {new Date(Number(p.expiryDate)).toLocaleDateString()}
                                                </td>
                                                <td className="py-2 px-2 sm:px-4 break-all">{p.paymentId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">
                                No payment history found.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
