import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "../zustand/store";

const BotMsg = ({ msg }) => {
  const { setLawyer, setPrint, setArticle } = useStore();

  const data = JSON.parse(msg.parts[0].text);

  function getData() {
    setLawyer(data.lawyers);
    setArticle(data.law);
    setPrint(data.print);
  }

  return (
    <div
      onClick={getData}
      className="flex justify-start px-2 overflow-hidden w-full"
    >
      <div className="flex max-w-[75%] min-w-0 items-end gap-2">
        {/* Bot Avatar */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
          alt="Bot Avatar"
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
        />

        <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none w-full max-w-full overflow-hidden">
          <div
            className="prose prose-sm sm:prose-base break-words break-all max-w-none overflow-hidden"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
          >
            {msg.parts.map((p, idx) => (
              <div
                key={idx}
                className="mb-3 flex flex-col gap-2 w-full overflow-hidden"
              >
                {p.text && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeContent = String(children).replace(/\n$/, "");

                        const handleCopy = () =>
                          navigator.clipboard.writeText(codeContent);

                        return !inline && match ? (
                          <div className="relative my-3 w-full max-w-full overflow-x-auto">
                            <button
                              onClick={handleCopy}
                              className="absolute top-0 left-0 w-full bg-gray-800 text-white text-xs py-1 rounded-t-lg hover:bg-gray-700 transition"
                            >
                              Copy
                            </button>

                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-b-lg shadow-lg overflow-x-auto pt-6 text-xs sm:text-sm"
                              {...props}
                            >
                              {codeContent}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code
                            className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },

                      table({ children }) {
                        return (
                          <div className="overflow-x-auto my-2 w-full">
                            <table className="table-auto border-collapse border border-gray-300 rounded-lg w-full text-left text-xs sm:text-sm">
                              {children}
                            </table>
                          </div>
                        );
                      },

                      thead({ children }) {
                        return (
                          <thead className="bg-gray-100 text-gray-700">
                            {children}
                          </thead>
                        );
                      },

                      td({ children }) {
                        return (
                          <td className="border border-gray-300 px-2 py-1 break-words">
                            {children}
                          </td>
                        );
                      },

                      th({ children }) {
                        return (
                          <th className="border border-gray-300 px-2 py-1 font-semibold break-words">
                            {children}
                          </th>
                        );
                      },

                      a({ children, href }) {
                        return (
                          <a
                            href={href}
                            className="text-blue-800 hover:underline hover:text-blue-900 transition-colors break-all"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        );
                      },
                    }}
                  >
                    {JSON.parse(p.text).answer}
                  </ReactMarkdown>
                )}

                {/* Files */}
                {p.file && (
                  <div className="w-full mt-2 overflow-hidden">
                    {p.fileType?.startsWith("image/") ? (
                      <img
                        src={p.file}
                        alt={p.fileName}
                        className="w-full max-h-[40vh] object-contain rounded-lg shadow-md"
                      />
                    ) : (
                      <a
                        href={p.file}
                        download={p.fileName}
                        className="block w-full text-center text-blue-600 underline py-2 rounded-lg bg-gray-50 shadow-sm text-xs"
                      >
                        📎 {p.fileName}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotMsg;