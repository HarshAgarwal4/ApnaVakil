const UserMsg = ({ msg }) => {
  return (
    <div className="flex justify-end px-2 overflow-auto">
      <div className="flex max-w-[85%] items-end gap-2 overflow-none">
        <div className="px-4 py-3 rounded-2xl bg-blue-700 text-white rounded-br-none">
          <div className="prose prose-lg break-words text-wrap">
            {msg.parts.map((p, idx) => (
              <div key={idx} className="mb-3 flex flex-col gap-2 max-w-[65vw] whitespace-pre-wrap"> {/* Changed here */}
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