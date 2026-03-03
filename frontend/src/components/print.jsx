import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "../zustand/store";
import axios from "../services/axios";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const PrintDialog = () => {
    const { showPrintPage, setShowPrintPage, print, setPrint } = useStore();

    const [isFormatting, setIsFormatting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const isBusy = isFormatting || isGenerating;

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
                <html>
                <head>
                    <title>ApnaVakil Document</title>
                    <style>
                        body {
                            font-family: "Times New Roman", serif;
                            padding: 50px;
                            color: #222;
                            line-height: 1.8;
                        }
                        h1, h2, h3 { margin-top: 20px; }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                        }
                        .brand-header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .brand-title {
                            font-size: 26px;
                            font-weight: bold;
                            color: #5B21B6;
                        }
                        .footer {
                            margin-top: 60px;
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                        }
                    </style>
                </head>
                <body>

                    <div class="brand-header">
                        <div class="brand-title">ApnaVakil</div>
                        <div>Legal Intelligence Platform</div>
                    </div>

                    <hr/>

                    ${element.innerHTML}

                    <div class="footer">
                        Generated via ApnaVakil • www.apnavakil.info
                    </div>

                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

        } catch (err) {
            console.error(err);
            toast.error("Print failed");
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
                format: "a4"
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const marginX = 50;
            const marginTop = 110;
            const usableWidth = pageWidth - marginX * 2;

            // Header
            doc.setFont("Times", "bold");
            doc.setFontSize(20);
            doc.setTextColor(91, 33, 182);
            doc.text("ApnaVakil", pageWidth / 2, 50, { align: "center" });

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Legal Intelligence Platform", pageWidth / 2, 70, { align: "center" });

            doc.setLineWidth(0.5);
            doc.line(marginX, 85, pageWidth - marginX, 85);

            // Content
            doc.setFont("Times", "normal");
            doc.setFontSize(12);

            const text = element.innerText;
            const lines = doc.splitTextToSize(text, usableWidth);

            let cursorY = marginTop;

            lines.forEach((line) => {
                if (cursorY > pageHeight - 60) {
                    doc.addPage();

                    // Repeat Header on new page
                    doc.setFont("Times", "bold");
                    doc.setFontSize(20);
                    doc.setTextColor(91, 33, 182);
                    doc.text("ApnaVakil", pageWidth / 2, 50, { align: "center" });

                    doc.setFontSize(12);
                    doc.setTextColor(0, 0, 0);
                    doc.text("Legal Intelligence Platform", pageWidth / 2, 70, { align: "center" });

                    doc.line(marginX, 85, pageWidth - marginX, 85);

                    doc.setFont("Times", "normal");
                    doc.setFontSize(12);

                    cursorY = marginTop;
                }

                doc.text(line, marginX, cursorY);
                cursorY += 18;
            });

            // Footer with page numbers
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(120);
                doc.text(
                    `Generated via ApnaVakil • Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 30,
                    { align: "center" }
                );
            }

            doc.save("ApnaVakil_Document.pdf");

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
                toast.success("Document formatted successfully");
            } else {
                toast.warning("Something went wrong");
            }
        } catch (err) {
            console.log(err);
            toast.error("Internal Server Error");
        } finally {
            setIsFormatting(false);
        }
    };

    return (
        <AnimatePresence>
            {showPrintPage && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isBusy && setShowPrintPage(false)}
                    />

                    <motion.div
                        className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-4xl h-[85%] 
                                   -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl 
                                   shadow-2xl flex flex-col overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <div className="p-4 border-b flex justify-between bg-gray-100">
                            <h2 className="text-xl font-semibold">
                                🖨 Print Document
                            </h2>
                            <button
                                disabled={isBusy}
                                onClick={() => setShowPrintPage(false)}
                                className="hover:text-red-500 disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {print ? (
                                <div
                                    className="bg-white p-6 border rounded-lg shadow-sm"
                                    style={{
                                        fontFamily: "serif",
                                        lineHeight: 1.8,
                                        fontSize: 16
                                    }}
                                >
                                    <div id="printerSystemID">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {print}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 italic">
                                    No document to print.
                                </p>
                            )}
                        </div>

                        <div className="p-4 border-t flex justify-end gap-3 bg-gray-100">
                            <button
                                onClick={handleFormatDocument}
                                disabled={isBusy}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {isFormatting && (
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                )}
                                Format Document
                            </button>

                            {print && (
                                <>
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={isBusy}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isGenerating && (
                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        )}
                                        Download PDF
                                    </button>

                                    <button
                                        onClick={handlePrint}
                                        disabled={isBusy}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isGenerating && (
                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        )}
                                        Print
                                    </button>
                                </>
                            )}

                            <button
                                disabled={isBusy}
                                onClick={() => setShowPrintPage(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PrintDialog;