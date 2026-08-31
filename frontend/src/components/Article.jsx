import React, { useState } from 'react';
import { useStore } from '../zustand/store';
import { BookOpen, Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const Article = () => {
    const { article, theme } = useStore();
    const isDark = theme === "dark";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!article) return;
        navigator.clipboard.writeText(article);
        setCopied(true);
        toast.info("Statute citation copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`p-4 h-[24vh] flex flex-col justify-between rounded-2xl border transition-all shadow-xs ${
            isDark
                ? "bg-slate-950/60 border-slate-800 text-slate-200"
                : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
        }`}>
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/90 dark:border-slate-800">
                <h3 className="font-black text-[11px] uppercase tracking-wider text-blue-950 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-700 dark:text-indigo-400" />
                    <span>Statutory Reference</span>
                </h3>
                {article && (
                    <button
                        onClick={handleCopy}
                        className="text-blue-900/60 hover:text-blue-950 dark:hover:text-indigo-400 transition p-1 rounded-md cursor-pointer"
                        title="Copy Citation"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto my-2 scrollbar-thin">
                {article ? (
                    <div className="text-xs sm:text-[13px] text-blue-950 dark:text-slate-300 leading-relaxed font-semibold bg-[#e2edf7] dark:bg-slate-900/60 p-2.5 rounded-xl border border-blue-300 dark:border-slate-800">
                        {article}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                        <Sparkles className="w-5 h-5 text-blue-600/50 dark:text-indigo-400/50 mb-1.5" />
                        <p className="text-xs font-black text-blue-950 dark:text-slate-400">
                            Automatic Statute Matching
                        </p>
                        <p className="text-[10px] text-blue-900/60 dark:text-slate-500 mt-0.5 font-medium">
                            Relevant BNS, IPC, & BNSS sections will display here as you chat.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Article;