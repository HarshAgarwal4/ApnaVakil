import React, { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/GlobalContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import printJS from "print-js";

const PrintDialog = () => {
    const { showPrintPage, setShowPrintPage, print } = useContext(AppContext);

    const handlePrint = () => {
        const content = document.getElementById("printerSystemID").innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<style>body{font-family: Arial;} </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };


    return (
        <AnimatePresence>
            {showPrintPage && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPrintPage(false)}
                    />

                    {/* Dialog Box */}
                    <motion.div
                        className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-4xl h-[85%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 30 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                🖨 Print Document
                            </h2>
                            <button
                                onClick={() => setShowPrintPage(false)}
                                className="text-gray-500 hover:text-red-500 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Preview */}
                        <div className="flex-1 overflow-y-auto p-6 ">
                            {print ? (
                                <div
                                    className="w-full bg-white p-6 border rounded-lg shadow-sm"
                                    style={{ fontFamily: "serif", lineHeight: 1.6, fontSize: 15 }}
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

                        {/* Footer Buttons */}
                        <div className="p-4 border-t flex justify-end gap-3 bg-gray-100">
                            <button
                                onClick={() => setShowPrintPage(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            {print && (
                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Print
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PrintDialog;
