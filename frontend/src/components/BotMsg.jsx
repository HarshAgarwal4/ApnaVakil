import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "../zustand/store";

const BotMsg = ({ msg }) => {
  const { setLawyer, setPrint, setArticle, theme } = useStore();
  const isDark = theme === "dark";

  let data = {};
  try {
    data = JSON.parse(msg.parts[0]?.text || "{}");
  } catch (err) {
    data = { answer: msg.parts[0]?.text || "" };
  }

  function getData() {
    if (data.lawyers) setLawyer(data.lawyers);
    if (data.law) setArticle(data.law);
    if (data.print) setPrint(data.print);
  }

  return (
    <div
      onClick={getData}
      className="flex justify-start py-2 sm:py-3 px-2 sm:px-4 w-full"
    >
      <div className="w-full min-w-0">
        <div className={`w-full text-sm sm:text-base leading-relaxed ${
          isDark ? "text-slate-100" : "text-blue-950"
        }`}>
          <div
            className="prose prose-sm sm:prose-base break-words max-w-none w-full overflow-hidden leading-relaxed font-normal"
            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
          >
            {msg.parts.map((p, idx) => {
              let parsedAnswer = "";
              try {
                parsedAnswer = JSON.parse(p.text).answer;
              } catch (e) {
                parsedAnswer = p.text;
              }

              return (
                <div
                  key={idx}
                  className="space-y-3 w-full overflow-hidden"
                >
                  {parsedAnswer && (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeContent = String(children).replace(/\n$/, "");

                          const handleCopy = () =>
                            navigator.clipboard.writeText(codeContent);

                          return !inline && match ? (
                            <div className="relative my-3 w-full max-w-full overflow-x-auto rounded-xl border border-slate-700">
                              <button
                                onClick={handleCopy}
                                className="absolute top-0 right-0 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1 rounded-bl-lg transition font-medium"
                              >
                                Copy
                              </button>

                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="overflow-x-auto p-4 text-xs sm:text-sm font-mono"
                                {...props}
                              >
                                {codeContent}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code
                              className={`px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm font-bold border ${
                                isDark
                                  ? "bg-slate-800 border-slate-700 text-pink-400"
                                  : "bg-[#e2edf7] border-blue-300 text-blue-900"
                              }`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },

                        table({ children }) {
                          return (
                            <div className="overflow-x-auto my-3 w-full rounded-xl border border-blue-200 dark:border-slate-700 shadow-xs">
                              <table className="table-auto border-collapse w-full text-left text-xs sm:text-sm">
                                {children}
                              </table>
                            </div>
                          );
                        },

                        thead({ children }) {
                          return (
                            <thead className={isDark ? "bg-slate-800 text-slate-200" : "bg-[#e2edf7] text-blue-950 font-bold border-b border-blue-300"}>
                              {children}
                            </thead>
                          );
                        },

                        td({ children }) {
                          return (
                            <td className="border-b border-blue-100 dark:border-slate-800 px-3 py-2 text-blue-950 dark:text-slate-200 font-medium">
                              {children}
                            </td>
                          );
                        },

                        th({ children }) {
                          return (
                            <th className="border-b border-blue-200 dark:border-slate-700 px-3 py-2 font-bold text-blue-950 dark:text-white">
                              {children}
                            </th>
                          );
                        },

                        a({ children, href }) {
                          return (
                            <a
                              href={href}
                              className="text-blue-700 hover:text-blue-900 dark:text-indigo-400 font-bold hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {parsedAnswer}
                    </ReactMarkdown>
                  )}

                  {/* Files */}
                  {p.file && (
                    <div className="w-full mt-2 overflow-hidden">
                      {p.fileType?.startsWith("image/") ? (
                        <img
                          src={p.file}
                          alt={p.fileName}
                          className="w-full max-h-[40vh] object-contain rounded-xl shadow-md border border-blue-200 dark:border-slate-700"
                        />
                      ) : (
                        <a
                          href={p.file}
                          download={p.fileName}
                          className={`block w-full text-center font-bold py-2 rounded-xl border text-xs transition ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700"
                              : "bg-[#e2edf7] border-blue-300 text-blue-900 hover:bg-[#d5e7f5] shadow-xs"
                          }`}
                        >
                          📎 {p.fileName}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotMsg;