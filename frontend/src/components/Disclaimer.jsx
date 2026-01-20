import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";

const Disclaimer = ({disc , showdisc}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => {showdisc(false)}}
        className="mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b rounded-t-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600">
            <AlertCircle size={22} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Legal Disclaimer
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 text-gray-700 text-sm md:text-base leading-relaxed">
          <p>
            The information provided on the <span className="font-medium">Apna Vakil</span>{" "}
            website and through its services, including any content generated
            using automated or AI-powered tools, is intended solely for general
            informational purposes.
          </p>

          <p>
            <span className="font-semibold text-gray-900">
              Apna Vakil does not provide legal advice.
            </span>{" "}
            The information presented should not be interpreted as a substitute
            for professional legal consultation, opinion, or representation.
          </p>

          <p>
            While we strive to ensure accuracy and timeliness, laws and legal
            interpretations change frequently. Apna Vakil makes no warranties
            or guarantees regarding the completeness, accuracy, or reliability
            of any information provided.
          </p>

          {/* Highlight Warning */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-amber-900 font-medium">
              Important Notice
            </p>
            <p className="mt-1 text-amber-800 text-sm">
              Users are strongly advised to verify all legal information with a
              qualified and licensed legal practitioner before making any legal
              decisions or taking action based on content available on this
              platform.
            </p>
          </div>

          <p className="font-semibold text-gray-900">
            By using this website, you acknowledge and agree that Apna Vakil
            shall not be held responsible or liable for any loss, damage, or
            consequences arising from reliance on the information provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
