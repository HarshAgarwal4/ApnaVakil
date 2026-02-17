import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "../zustand/store";

const DraftBotSidebarMsg = ({ msg }) => {
    const { setLawyer, setPrint, setArticle } = useStore()

    return (
        <div onClick={() => { getData() }} className="flex justify-start px-2 overflow-auto">
            <div className="flex max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[90%] items-end gap-1 sm:gap-2">
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl break-words bg-gray-200 text-gray-800 rounded-bl-none w-full">
                    <div className="prose prose-sm sm:prose-base break-words max-w-none">
                        <div
                            className="mb-3 flex flex-col gap-2 w-full overflow-hidden"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const codeContent = String(children).replace(/\n$/, "");

                                        const handleCopy = () =>
                                            navigator.clipboard.writeText(codeContent);

                                        return !inline && match ? (
                                            <div className="relative my-3 w-[90%] overflow-hidden">
                                                {/* Copy Button */}
                                                <button
                                                    onClick={handleCopy}
                                                    className="absolute top-0 left-0 w-full bg-gray-800 text-white text-xs sm:text-sm py-1 rounded-t-lg hover:bg-gray-700 transition"
                                                >
                                                    Copy
                                                </button>

                                                {/* Syntax Highlighted Code */}
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="rounded-b-lg shadow-lg overflow-x-auto pt-6 text-xs sm:text-sm md:text-base"
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
                                            <div className="overflow-x-auto my-2">
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
                                            <td className="border border-gray-300 px-2 sm:px-3 py-1 sm:py-2">
                                                {children}
                                            </td>
                                        );
                                    },
                                    th({ children }) {
                                        return (
                                            <th className="border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 font-semibold">
                                                {children}
                                            </th>
                                        );
                                    },
                                    a({ children, href }) {
                                        return (
                                            <a
                                                href={href}
                                                className="text-blue-800 hover:underline hover:text-blue-900 transition-colors break-words"
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
        </div>
    );
};

export default DraftBotSidebarMsg;
