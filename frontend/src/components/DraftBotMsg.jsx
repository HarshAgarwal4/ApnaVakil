import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "../zustand/store";
import { toast } from "react-toastify";
import axios from "../services/axios";

const markdownComponents = {
    code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        const codeContent = String(children).replace(/\n$/, "");

        const handleCopy = () => navigator.clipboard.writeText(codeContent);

        return !inline && match ? (
            <div className="relative my-3 w-full overflow-hidden">
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
                    className="rounded-b-lg pt-6 text-xs sm:text-sm md:text-base"
                    {...props}
                >
                    {codeContent}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm">
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
        return <thead className="bg-gray-100 text-gray-700">{children}</thead>;
    },

    th({ children }) {
        return <th className="border border-gray-300 px-2 py-1 font-semibold">{children}</th>;
    },

    td({ children }) {
        return <td className="border border-gray-300 px-2 py-1">{children}</td>;
    },

    a({ children, href }) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:underline break-words"
            >
                {children}
            </a>
        );
    }
};

const DraftBotMsg = ({ msg }) => {
    const {
        activeBlock,
        setActiveBlock,
        clearActiveBlock,
        editMessage,
        setEditMessage,
        document,
        activeDraft,
        setDocument,
        DraftChatHistory,
        setDraftChatHistory,
        YourDrafts,
        setYourDrafts,
    } = useStore();

    const [loadingIndex, setLoadingIndex] = useState(null);

    let blocks = [];
    try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed)) blocks = parsed;
    } catch {
        return null;
    }

    const sendEdit = async (index, originalText) => {
        if (!editMessage.trim()) return;

        setLoadingIndex(index);

        let id = activeDraft?._id || "not";

        try {
            const res = await axios.post("/editDraft", {
                idx: index,
                msg: editMessage,
                document: document,
                chatId: id,
                selection: blocks[index]
            });

            if (res.status === 200) {
                if (res.data.status === 1) {

                    const parsedCurrentDoc = JSON.parse(document);
                    parsedCurrentDoc[index] = res.data.resp;
                    setDocument(JSON.stringify(parsedCurrentDoc));

                    setYourDrafts(prev => ({
                        ...prev,
                        drafts: prev.drafts.map(item => {

                            if (item._id !== id) return item;

                            const parsedDocument = JSON.parse(item.document);
                            parsedDocument[index] = res.data.resp;

                            return {
                                ...item,
                                document: JSON.stringify(parsedDocument)
                            };
                        })
                    }));

                } else {
                    toast.warning("Something went wrong");
                }
            }
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        } finally {
            setLoadingIndex(null);
            clearActiveBlock();
        }
    };

    return (
        <div className="flex justify-start px-2 overflow-auto">
            <div className="flex max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[90%] items-end gap-2">
                <div className="px-3 sm:px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none w-full">
                    <div className="prose prose-sm sm:prose-base max-w-none">
                        <div className="flex flex-col">
                            {blocks.map((block, index) => {
                                const isActive = activeBlock === index;
                                const isLoading = loadingIndex === index;
                                const isAnyEditing = loadingIndex !== null;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (!isAnyEditing) {
                                                setActiveBlock(index);
                                            }
                                        }}
                                        className={`px-3 py-3 border-b border-gray-300 transition cursor-pointer
                                        ${isActive
                                                ? "ring-2 ring-blue-400 bg-blue-50"
                                                : "bg-white hover:bg-gray-50"
                                            }
                                        ${isAnyEditing && !isActive ? "pointer-events-none opacity-60" : ""}
                                        `}
                                    >
                                        {/* -------- MARKDOWN BLOCK -------- */}
                                        <div className="overflow-hidden min-h-[60px] relative">
                                            {isLoading ? (
                                                <div className="flex flex-col items-center justify-center h-20 gap-2">
                                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-xs text-gray-500">
                                                        AI is editing...
                                                    </span>
                                                </div>
                                            ) : (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={markdownComponents}
                                                >
                                                    {block}
                                                </ReactMarkdown>
                                            )}
                                        </div>

                                        {/* -------- INLINE EDITOR -------- */}
                                        {isActive && !isLoading && (
                                            <div
                                                className="mt-3 border-t pt-3 flex flex-col gap-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <textarea
                                                    value={editMessage}
                                                    onChange={(e) => setEditMessage(e.target.value)}
                                                    placeholder="Tell AI how to modify this section..."
                                                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                                    rows={3}
                                                />

                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={clearActiveBlock}
                                                        className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={() => sendEdit(index, block)}
                                                        className="px-4 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftBotMsg;