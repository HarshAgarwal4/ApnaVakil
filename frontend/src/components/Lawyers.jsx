import React, { useContext } from 'react';
import { useStore } from '../zustand/store';

const Lawyers = () => {
  const { lawyer, setLawyer } = useStore()

  return (
    <div
      className={`bg-gray-50 p-4 overflow-auto rounded-lg ${lawyer.length === 0 ? 'h-[10vh]' : 'h-[55vh]'
        }`}
    >

      <h3 className="font-semibold text-gray-800 mb-4">⚖️ Recommended Lawyers</h3>

      {lawyer.length === 0 ? <span>No lawyers found</span> : lawyer.map((lawyer, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold text-gray-900">{lawyer?.name}</p>
              <p className="text-sm text-gray-600">{lawyer?.speciality}</p>
            </div>
          </div>
          <span
            className="text-sm text-blue-600 hover:underline mt-2 block"
          >
            {lawyer.contact}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Lawyers;
