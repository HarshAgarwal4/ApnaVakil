import React from 'react';

const DraftUserMsg = ({ msg }) => {
    return (
        <div className="flex justify-end px-1 sm:px-2 py-1">
            <div className="flex max-w-[85%] sm:max-w-[75%] items-end gap-2">
                <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs shadow-sm text-xs font-medium leading-relaxed break-words">
                    <div className="whitespace-pre-wrap">
                        {msg.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftUserMsg;