"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number | "all";
    onItemsPerPageChange?: (value: number | "all") => void;
    itemName?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange,
    itemName = "entries",
}: PaginationProps) {
    const effectiveLimit = itemsPerPage === "all" ? totalItems : itemsPerPage;
    const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * effectiveLimit + 1;
    const endEntry = Math.min(currentPage * effectiveLimit, totalItems);

    // Dynamic page number logic: max 5 buttons, centered around currentPage
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (currentPage <= 3) return i + 1;
        if (currentPage >= totalPages - 2) return totalPages - 4 + i;
        return currentPage - 2 + i;
    });

    if (totalItems === 0) return null;

    return (
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* LEFT: Info text + Show dropdown */}
            <div className="flex items-center gap-3 text-sm text-gray-500 order-2 sm:order-1">
                <span>
                    Showing{" "}
                    <span className="font-semibold text-gray-700">{startEntry}</span> to{" "}
                    <span className="font-semibold text-gray-700">{endEntry}</span> of{" "}
                    <span className="font-semibold text-gray-700">{totalItems}</span>{" "}
                    {itemName}
                </span>

                {onItemsPerPageChange && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                const val = e.target.value;
                                onItemsPerPageChange(val === "all" ? "all" : Number(val));
                            }}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                )}
            </div>

            {/* RIGHT: Previous / Page Numbers / Next */}
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
                {/* Previous */}
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#2C4276] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {/* Page Numbers — hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1">
                    {pageNumbers.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all active:scale-95 ${currentPage === pageNum
                                    ? "bg-[#2C4276] text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 border border-gray-200 bg-white"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                {/* Mobile fallback */}
                <div className="sm:hidden text-sm font-semibold px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
                    {currentPage} / {totalPages}
                </div>

                {/* Next */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#2C4276] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
