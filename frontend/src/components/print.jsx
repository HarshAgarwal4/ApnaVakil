import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useStore } from "../zustand/store";
import axios from "../services/axios";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import remarkBreaks from "remark-breaks";
import {
  Printer,
  Download,
  Sparkles,
  X,
  FileText,
  Loader2,
  CheckCircle2,
  Copy
} from "lucide-react";

const PrintDialog = () => {
  const { showPrintPage, setShowPrintPage, print, setPrint, theme } = useStore();
  const isDark = theme === "dark";

  const [isFormatting, setIsFormatting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const isBusy = isFormatting || isGenerating;

  /* ================= COPY TEXT ================= */
  const handleCopyText = () => {
    if (!print) return;
    navigator.clipboard.writeText(print);
    setCopied(true);
    toast.success("Document copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= PRINT ================= */
  const handlePrint = async () => {
    try {
      setIsGenerating(true);

      const element = document.getElementById("printerSystemID");
      if (!element) {
        toast.error("No document found to print");
        return;
      }

      const printWindow = window.open("", "", "width=900,height=700");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>ApnaVakil Legal Document</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: "Times New Roman", Times, serif;
              padding: 20px;
              color: #111827;
              line-height: 1.8;
              font-size: 14pt;
              background-color: #ffffff;
            }
            h1, h2, h3, h4 {
              color: #1e1b4b;
              margin-top: 18px;
              margin-bottom: 8px;
              font-weight: bold;
            }
            h1 { font-size: 20pt; text-align: center; }
            h2 { font-size: 16pt; }
            h3 { font-size: 14pt; }
            p { margin: 8px 0; text-align: justify; }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #94a3b8;
              padding: 8px 12px;
              text-align: left;
            }
            th { background-color: #f1f5f9; font-weight: bold; }
            blockquote {
              border-left: 3px solid #6366f1;
              padding-left: 15px;
              margin: 15px 0;
              font-style: italic;
              color: #334155;
            }
            .brand-header {
              text-align: center;
              margin-bottom: 25px;
              padding-bottom: 15px;
              border-bottom: 2px solid #312e81;
            }
            .brand-title {
              font-size: 24pt;
              font-weight: bold;
              color: #1e1b4b;
              letter-spacing: 1px;
            }
            .brand-sub {
              font-size: 11pt;
              color: #475569;
              font-style: italic;
            }
            .footer {
              margin-top: 50px;
              padding-top: 15px;
              border-top: 1px solid #cbd5e1;
              text-align: center;
              font-size: 10pt;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="brand-header">
            <div class="brand-title">ApnaVakil</div>
            <div class="brand-sub">Legal Intelligence & Automated Drafting Platform</div>
          </div>
          ${element.innerHTML}
          <div class="footer">
            Generated securely via ApnaVakil • www.apnavakil.info
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);

    } catch (err) {
      console.error("Print error:", err);
      toast.error("Failed to open print dialog");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= DOWNLOAD PDF ================= */
  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      const element = document.getElementById("printerSystemID");
      if (!element) {
        toast.error("No document found");
        return;
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const marginX = 50;
      const marginTop = 110;
      const usableWidth = pageWidth - marginX * 2;

      // Header Brand
      doc.setFont("Times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 27, 75); // Deep Indigo
      doc.text("ApnaVakil", pageWidth / 2, 50, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("Times", "italic");
      doc.setTextColor(71, 85, 105);
      doc.text("Legal Intelligence Platform", pageWidth / 2, 68, { align: "center" });

      doc.setDrawColor(49, 46, 129);
      doc.setLineWidth(1.5);
      doc.line(marginX, 82, pageWidth - marginX, 82);

      doc.setFont("Times", "normal");
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);

      const text = element.innerText;
      const lines = doc.splitTextToSize(text, usableWidth);

      let cursorY = marginTop;

      lines.forEach((line) => {
        if (cursorY > pageHeight - 60) {
          doc.addPage();

          doc.setFont("Times", "bold");
          doc.setFontSize(22);
          doc.setTextColor(30, 27, 75);
          doc.text("ApnaVakil", pageWidth / 2, 50, { align: "center" });

          doc.setFontSize(11);
          doc.setFont("Times", "italic");
          doc.setTextColor(71, 85, 105);
          doc.text("Legal Intelligence Platform", pageWidth / 2, 68, { align: "center" });

          doc.setDrawColor(49, 46, 129);
          doc.setLineWidth(1.5);
          doc.line(marginX, 82, pageWidth - marginX, 82);

          doc.setFont("Times", "normal");
          doc.setFontSize(12);
          doc.setTextColor(17, 24, 39);

          cursorY = marginTop;
        }

        doc.text(line, marginX, cursorY);
        cursorY += 18;
      });

      const pageCount = doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont("Times", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Generated via ApnaVakil • Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 25,
          { align: "center" }
        );
      }

      doc.save("ApnaVakil_Legal_Document.pdf");
      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("PDF generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= FORMAT ================= */
  const handleFormatDocument = async () => {
    if (!print) return;

    try {
      setIsFormatting(true);

      const r = await axios.post("/format", { document: print });

      if (r.status === 200 && r.data.status === 1) {
        setPrint(r.data.document);
        toast.success("Document formatted into legal structure!");
      } else {
        toast.warning("Formatting service unavailable");
      }
    } catch (err) {
      console.error(err);
      toast.error("Internal Server Error");
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrintPage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isBusy && setShowPrintPage(false)}
          />

          {/* Dialog Modal Container */}
          <motion.div
            className={`relative z-10 w-full max-w-5xl h-[92vh] sm:h-[88vh] 
            rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans border transition-colors duration-300 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100 shadow-black/60"
                : "bg-slate-50 border-slate-200 text-slate-900 shadow-slate-400/50"
            }`}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div
              className={`p-3.5 sm:p-5 border-b flex items-center justify-between transition-colors shrink-0 ${
                isDark
                  ? "bg-slate-950/80 border-slate-800"
                  : "bg-white/80 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 text-white flex items-center justify-center shadow-md shrink-0">
                  <Printer size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <span>Print & Export Document</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Court Ready
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Preview, format with AI, and download or print legal drafts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!print}
                  onClick={handleCopyText}
                  className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                  title="Copy Document Text"
                >
                  {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => setShowPrintPage(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                  title="Close Dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Preview Canvas */}
            <div
              className={`flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 transition-colors ${
                isDark ? "bg-[#0b141a]" : "bg-slate-100"
              }`}
            >
              {print ? (
                <div
                  className={`max-w-3xl mx-auto p-6 sm:p-10 md:p-12 rounded-xl sm:rounded-2xl border shadow-xl transition-all duration-300 ${
                    isDark
                      ? "bg-slate-900 border-slate-800 text-slate-100 shadow-black/40"
                      : "bg-white border-slate-200 text-slate-900 shadow-slate-300/60"
                  }`}
                >
                  {/* Top Legal Brand Watermark Header */}
                  <div className="text-center pb-6 mb-6 border-b-2 border-indigo-700/80 dark:border-indigo-500/80 space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-indigo-950 dark:text-indigo-200 font-serif">
                      ApnaVakil
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold italic text-slate-500 dark:text-slate-400">
                      Legal Intelligence & Automated Drafting Platform
                    </p>
                  </div>

                  {/* Rendered Markdown Document */}
                  <div
                    id="printerSystemID"
                    className={`prose prose-sm sm:prose-base max-w-none font-serif leading-relaxed text-justify ${
                      isDark ? "prose-invert" : ""
                    }`}
                    style={{
                      fontFamily: "Times New Roman, Cambria, Georgia, serif",
                      lineHeight: "1.9",
                      fontSize: "15px",
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                      {print}
                    </ReactMarkdown>
                  </div>

                  {/* Footer Seal */}
                  <div className="mt-12 pt-6 border-t border-slate-300 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 font-serif italic">
                    Generated via ApnaVakil Intelligence Engine • Confidential Document
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <FileText size={48} className="mb-3 opacity-30 text-indigo-500" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    No document content to print.
                  </p>
                  <p className="text-xs max-w-xs mt-1 text-slate-500">
                    Please generate a legal draft or legal notice first to preview and print.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons Bar */}
            <div
              className={`p-3.5 sm:p-4 border-t flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 transition-colors shrink-0 ${
                isDark
                  ? "bg-slate-950/90 border-slate-800"
                  : "bg-white/90 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFormatDocument}
                  disabled={isBusy || !print}
                  className="px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md disabled:opacity-40 flex items-center gap-2 text-xs sm:text-sm cursor-pointer transition"
                >
                  {isFormatting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  <span>AI Legal Format</span>
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {print && (
                  <>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      disabled={isBusy}
                      className="px-3.5 sm:px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md disabled:opacity-40 flex items-center gap-2 text-xs sm:text-sm cursor-pointer transition"
                    >
                      {isGenerating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      disabled={isBusy}
                      className="px-3.5 sm:px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md disabled:opacity-40 flex items-center gap-2 text-xs sm:text-sm cursor-pointer transition"
                    >
                      {isGenerating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Printer size={16} />
                      )}
                      <span>Print Document</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => setShowPrintPage(false)}
                  className={`px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                      : "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrintDialog;