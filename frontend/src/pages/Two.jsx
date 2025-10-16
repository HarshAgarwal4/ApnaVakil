import React, { useState, useEffect, useRef } from "react";

const Dashboard = () => {
  const [history] = useState([
    "What is IPC 302?",
    "Explain Evidence Act.",
    "BNS 2023 vs IPC 1860",
  ]);

  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hello, I am Apna Vakil. How can I assist you today?", time: "10:30 AM" },
    { role: "user", text: "Hi", time: "10:31 AM" },
  ]);

  const [input, setInput] = useState("");
  const [article, setArticle] = useState("IPC Section 302");
  const [lawyer, setLawyer] = useState({
    name: "Adv. Rohan Mehta",
    specialty: "Criminal Law",
    contact: "rohanmehta@example.com",
    avatar: "https://i.pravatar.cc/100?img=12",
  });

  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Demo bot reply to "Hi"
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user" && lastMessage.text.toLowerCase() === "hi") {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: "bot", text: "Hello! How can I help you today?", time: "10:32 AM" }
        ]);
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input, time: "10:35 AM" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Bot auto-reply
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Thank you for your message! How can I assist further?", time: "10:36 AM" }
      ]);
      setIsTyping(false);
    }, 1000);

    setArticle("Evidence Act, Section 65");
    setLawyer({
      name: "Adv. Priya Sharma",
      specialty: "Civil Law",
      contact: "priyasharma@example.com",
      avatar: "https://i.pravatar.cc/100?img=32",
    });
  };

  return (
    <div className="h-screen flex flex-col font-[Inter] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-lg bg-gradient-to-r from-indigo-900 to-blue-700 text-white rounded-b-2xl">
        <h1 className="text-2xl font-bold tracking-wide">⚖️ Apna Vakil</h1>
        <div className="space-x-3">
          <button className="bg-white text-indigo-950 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition shadow-md">
            Login
          </button>
          <button className="bg-yellow-500 text-indigo-950 px-5 py-2 rounded-lg font-medium hover:bg-yellow-400 transition shadow-md">
            Signup
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden mt-4">
        {/* Sidebar (History 20%) */}
        <aside className="w-1/5 bg-gradient-to-b from-indigo-950 to-indigo-800 text-white p-6 flex flex-col justify-between border-r border-gray-700 rounded-tr-2xl rounded-br-2xl shadow-xl">
          {/* History Section */}
          <div>
            <h2 className="font-semibold mb-6 text-lg flex items-center gap-2 border-b border-indigo-600 pb-2">📜 History</h2>
            <ul className="space-y-3 overflow-y-auto max-h-[calc(100%-120px)]">
              {history.map((item, i) => (
                <li
                  key={i}
                  className="p-3 hover:bg-indigo-700 cursor-pointer transition rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <span>📄</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Account Section */}
          <div className="flex items-center gap-3 mt-4 p-3 bg-indigo-900 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
            <img
              src="https://i.pravatar.cc/40?img=5"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-white"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-sm">Harsh Jain</p>
              <p className="text-xs text-gray-200">harsh@example.com</p>
            </div>
            <button className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition">
              Logout
            </button>
          </div>
        </aside>

        {/* Chat Area (60%) */}
        <main className="w-3/5 p-6 flex flex-col">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto rounded-3xl p-6 bg-white shadow-2xl mb-4 border flex flex-col backdrop-blur-sm bg-opacity-70">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-3 p-3 rounded-2xl max-w-lg shadow-lg text-sm transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-700 to-blue-600 text-white ml-auto text-right hover:scale-105 transform transition"
                    : "bg-white text-gray-800 mr-auto text-left shadow-md hover:shadow-lg transform hover:scale-102 transition"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs opacity-70 block mt-1">{msg.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="my-3 p-3 rounded-2xl max-w-lg shadow-md text-sm bg-gray-100 mr-auto text-left italic flex items-center gap-2 animate-pulse">
                Bot is typing
                <span className="animate-pulse">...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex shadow-xl rounded-2xl overflow-hidden border border-gray-300 hover:shadow-2xl transition-all duration-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border-0 px-4 py-3 focus:outline-none text-sm focus:ring-2 focus:ring-blue-500 rounded-l-2xl"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-indigo-900 to-blue-700 text-white px-6 py-3 font-medium hover:scale-105 transition transform rounded-r-2xl shadow-lg"
            >
              ➤
            </button>
          </div>
        </main>

        {/* Right Sidebar (20%) */}
        <aside className="w-1/5 p-6 flex flex-col gap-6">
          {/* Lawyer Card */}
          <div className="flex-1 p-5 bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-opacity-70">
            <div className="flex items-center gap-4 mb-3">
              <img
                src={lawyer.avatar}
                alt="Lawyer"
                className="w-12 h-12 rounded-full border shadow"
              />
              <div>
                <p className="text-gray-800 font-semibold">{lawyer.name}</p>
                <p className="text-gray-600 text-sm">{lawyer.specialty}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">{lawyer.contact}</p>
          </div>

          {/* Section Card */}
          <div className="flex-1 p-5 bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-opacity-70">
            <span className="font-semibold block mb-2 text-indigo-950">📖 Section</span>
            <p className="text-gray-700">{article}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;