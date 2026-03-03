import React, { useState } from "react";
import Header from "../components/Header";
import { useStore } from "../zustand/store";
import PricingBox from "../components/payment";
import LawyerCard from "../components/LawyerCard";
import LoadingPage from "../components/Loading";

export default function LawyersPage() {
  const { showPricingBox , Lawyers} = useStore();
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  if (Lawyers.isloading) {
    return <LoadingPage />
  }

  const demoLawyers = Lawyers.lawyers

  // const filteredLawyers = demoLawyers.filter((lawyer) => {
  //   const q
  //   return (
  //     lawyer.name.toLowerCase().includes(q) ||
  //     lawyer.categories.some((cat) =>
  //       cat.toLowerCase().includes(q)
  //     )
  //   );
  // });

  const handleConsult = (lawyer) => {
    setSelectedLawyer(lawyer);
    alert(`Starting consultation with ${lawyer.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 font-sans">
      {showPricingBox && <PricingBox />}
      <Header />


      {/* LAWYERS GRID */}
      <section className="pb-28 px-[6%] my-15">
        <h2 className="text-center text-4xl font-extrabold text-slate-900 mb-16">
          Available Lawyers
        </h2>

        {demoLawyers.length === 0 ? (
          <div className="text-center text-slate-500 text-lg">
            No lawyers found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {demoLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer._id}
                lawyer={lawyer}
                onConsult={handleConsult}
              />
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t text-center py-10 text-slate-500">
        © 2026 Apna Vakil • Built with professionalism & trust
      </footer>
    </div>
  );
}