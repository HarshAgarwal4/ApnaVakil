import React, { useState } from "react";

const SubscriptionPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Monthly ₹20",
    transactionId: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., save to DB or send email
    // For file uploads, you'll typically use FormData
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("plan", form.plan);
    formData.append("transactionId", form.transactionId);
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    // Example of how you might log the FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    alert(
      "Subscription details submitted! We will verify your payment and activate your subscription shortly."
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Subscribe to Our Service
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Payment Information */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 1: Complete Your Payment
            </h2>
            <p className="text-gray-600 mb-4">
              Scan the QR code below with your favorite UPI app to complete the
              payment.
            </p>
            <div className="flex flex-col items-center">
              <img
                src="/path-to-your-qr-code.png" // Replace with your actual QR code path
                alt="UPI QR Code"
                className="w-56 h-56 mb-4 border rounded-lg"
              />
              <p className="text-lg font-medium text-gray-800">
                Amount: ₹20 (Monthly)
              </p>
              <p className="text-sm text-gray-500">
                Please ensure you save a screenshot of the payment confirmation.
              </p>
            </div>
          </div>

          {/* Right Side: Subscription Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Step 2: Submit Your Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="plan"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Subscription Plan
                </label>
                <select
                  id="plan"
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Monthly ₹20">Monthly - ₹20</option>
                  <option value="Yearly ₹200">Yearly - ₹200</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="transactionId"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  UPI Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="screenshot"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  required
                  className="w-full p-3 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {screenshotPreview && (
                  <div className="mt-4">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot Preview"
                      className="w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Submit and Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;