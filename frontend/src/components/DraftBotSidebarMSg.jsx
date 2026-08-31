import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "../zustand/store";

const DraftBotSidebarMsg = ({ msg }) => {
    const { theme } = useStore();
    const isDark = theme === "dark";

    return (
        <div className="flex justify-start px-1 sm:px-2 py-1 overflow-hidden w-full">
            <div className="flex max-w-[95%] items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs shrink-0 mt-0.5">
                    AV
                </div>

                <div className={`px-3.5 py-2.5 rounded-2xl border transition-colors ${
                    isDark
                        ? "bg-slate-900 border-slate-800 text-slate-200 shadow-md"
                        : "bg-white border-slate-300 text-slate-900 shadow-sm"
                } rounded-tl-xs w-full break-words`}>
                    <div className="prose prose-xs sm:prose-sm max-w-none text-xs sm:text-sm leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const codeContent = String(children).replace(/\n$/, "");

                                    const handleCopy = () =>
                                        navigator.clipboard.writeText(codeContent);

                                    return !inline && match ? (
                                        <div className="relative my-2 w-full overflow-hidden rounded-xl border border-slate-700">
                                            <button
                                                onClick={handleCopy}
                                                className="absolute top-0 right-0 bg-slate-800 text-white text-[10px] px-2.5 py-0.5 rounded-bl-lg hover:bg-slate-700 transition"
                                            >
                                                Copy
                                            </button>
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                className="overflow-x-auto p-3 text-xs"
                                                {...props}
                                            >
                                                {codeContent}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code
                                            className={`px-1 py-0.5 rounded font-mono text-xs font-semibold border ${
                                                isDark
                                                    ? "bg-slate-800 border-slate-700 text-pink-400"
                                                    : "bg-slate-100 border-slate-300 text-pink-700"
                                            }`}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },

                                table({ children }) {
                                    return (
                                        <div className="overflow-x-auto my-2 rounded-lg border border-slate-300 dark:border-slate-700">
                                            <table className="table-auto border-collapse w-full text-left text-xs">
                                                {children}
                                            </table>
                                        </div>
                                    );
                                },
                                thead({ children }) {
                                    return (
                                        <thead className={isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-900 font-bold border-b border-slate-300"}>
                                            {children}
                                        </thead>
                                    );
                                },
                                td({ children }) {
                                    return (
                                        <td className="border-b border-slate-200 dark:border-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200">
                                            {children}
                                        </td>
                                    );
                                },
                                th({ children }) {
                                    return (
                                        <th className="border-b border-slate-300 dark:border-slate-700 px-2 py-1 font-bold text-slate-900 dark:text-white">
                                            {children}
                                        </th>
                                    );
                                },
                                a({ children, href }) {
                                    return (
                                        <a
                                            href={href}
                                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    );
                                },
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftBotSidebarMsg;
