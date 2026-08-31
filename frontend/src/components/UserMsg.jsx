import React from 'react';

const UserMsg = ({ msg }) => {
  return (
    <div className="flex justify-end px-2 sm:px-4 py-1">
      <div className="flex max-w-[85%] sm:max-w-[75%] items-end gap-2">
        <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-br-xs shadow-md shadow-blue-900/20 text-xs sm:text-sm font-semibold leading-relaxed">
          <div className="break-words">
            {msg.parts.map((p, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {p.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMsg;