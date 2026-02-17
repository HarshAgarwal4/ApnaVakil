import React, { useState } from "react";
import Header from "../components/Header";

export default function LawyersPage() {
  const [search, setSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [message, setMessage] = useState("");
  const [reviewLawyer, setReviewLawyer] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [lawyers, setLawyers] = useState([
    {
      id: 1,
      name: "Adv. Amit Jain",
      specialization: "Corporate Lawyer",
      city: "Bangalore",
      experience: "10 Years",
      rating: 4.9,
      reviewsCount: 210,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Adv. Rahul Sharma",
      specialization: "Criminal Lawyer",
      city: "Delhi",
      experience: "8 Years",
      rating: 4.7,
      reviewsCount: 160,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 3,
      name: "Adv. Neha Verma",
      specialization: "Family & Divorce Lawyer",
      city: "Mumbai",
      experience: "6 Years",
      rating: 4.6,
      reviewsCount: 95,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ]);

  const filteredLawyers = lawyers
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.specialization.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.rating - a.rating);

  const topLawyersByScore = [...filteredLawyers]
    .map((l) => ({
      ...l,
      score: l.rating * 0.7 + l.reviewsCount * 0.3,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

    <Header />

      {/* HERO */}
      <section className="py-24 px-[6%] text-center max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">
          Consult India's Top Lawyers
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-16">
          Connect instantly with verified lawyers across all practice areas and cities
        </p>

        <div className="max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lawyers by name, specialty or city..."
            className="w-full p-6 rounded-2xl border border-slate-300 bg-white text-slate-800 text-lg outline-none focus:ring-4 focus:ring-amber-400/30"
          />
        </div>
      </section>

      {/* LAWYERS */}
      <section>
        <h2 className="text-center text-4xl font-extrabold text-slate-900 mb-12">
          Top Rated Lawyers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-[6%] mb-24">
          {topLawyersByScore.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white border rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition"
            >
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {lawyer.name}
                  </h3>
                  <p className="text-amber-600 font-semibold">
                    {lawyer.specialization}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {lawyer.experience} • {lawyer.city}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-8 text-sm">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                  ✅ Verified
                </span>
                <span className="bg-yellow-100 text-amber-700 px-3 py-1 rounded-lg">
                  ⭐ {lawyer.rating} ({lawyer.reviewsCount}+)
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setSelectedLawyer(lawyer)}
                  className="py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600"
                >
                  Consult Lawyer
                </button>
                <button
                  onClick={() => setReviewLawyer(lawyer)}
                  className="py-3 border border-amber-500 text-amber-600 rounded-xl font-semibold hover:bg-amber-50"
                >
                  Rate & Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white text-slate-500 text-center py-10 border-t">
        © 2026 Apna Vakil. All rights reserved. | Mumbai, India
      </footer>
    </div>
  );
}
