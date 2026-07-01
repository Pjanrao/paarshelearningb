import React, { useRef, useState, useEffect } from "react";
import { Eraser, Edit3, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface SignatureCanvasProps {
    onChange: (signatureBase64: string) => void;
}

export default function SignatureCanvas({ onChange }: SignatureCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Make canvas responsive
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * 2; // scale for high-DPI displays
            canvas.height = rect.height * 2;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.scale(2, 2);
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = "#1e293b"; // slate-800 line color
            }
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    // Get input position relative to canvas
    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        let clientX = 0;
        let clientY = 0;

        if ("touches" in e) {
            // Touch event
            if (e.touches.length === 0) return null;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
            setIsDrawing(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        e.preventDefault();

        const coords = getCoordinates(e);
        if (!coords) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
            setHasSigned(true);
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        saveSignature();
    };

    const clearCanvas = () => {
        if (activeTab === "draw") {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setHasSigned(false);
                onChange("");
            }
        } else {
            setUploadedUrl(null);
            onChange("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "signatures");

        try {
            const res = await axios.post("/api/upload", formData);
            if (res.data.url) {
                setUploadedUrl(res.data.url);
                onChange(res.data.url);
                toast.success("Signature uploaded successfully");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload signature image");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const saveSignature = () => {
        if (activeTab === 'upload') return;
        const canvas = canvasRef.current;
        if (canvas && hasSigned) {
            const dataUrl = canvas.toDataURL("image/png");
            onChange(dataUrl);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
                    <button
                        type="button"
                        onClick={() => { setActiveTab("draw"); clearCanvas(); }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === "draw"
                                ? "bg-white text-[#2C4276] shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <Edit3 size={14} /> Draw Action
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("upload"); clearCanvas(); }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === "upload"
                                ? "bg-white text-[#2C4276] shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <ImageIcon size={14} /> Upload Image
                    </button>
                </div>

                {(hasSigned || uploadedUrl) && (
                    <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center justify-center sm:justify-start gap-1 font-semibold transition bg-red-50 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg sm:rounded-none"
                    >
                        <Eraser size={14} />
                        Clear signature
                    </button>
                )}
            </div>

            {activeTab === "draw" ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-50/50 hover:border-gray-400 transition-colors h-48 w-full group">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />

                    {!hasSigned && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400 select-none pb-2">
                            <span className="text-xs font-semibold">Sign inside this box</span>
                            <span className="text-[10px] text-gray-400/80 mt-1">Use finger on mobile, or mouse/trackpad on computer</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-50/50 hover:border-gray-400 transition-colors h-48 w-full flex flex-col items-center justify-center">
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <Loader2 size={24} className="animate-spin text-[#2C4276]" />
                            <span className="text-xs font-semibold">Uploading...</span>
                        </div>
                    ) : uploadedUrl ? (
                        <div className="w-full h-full p-4 flex items-center justify-center relative group">
                            <img src={uploadedUrl} alt="Signature preview" className="max-w-full max-h-full object-contain" />
                            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-gray-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm border flex items-center gap-2"
                                >
                                    <Upload size={14} /> Replace Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-[#2C4276] transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm border flex items-center justify-center mb-3">
                                <Upload size={20} />
                            </div>
                            <span className="text-xs font-semibold">Click to upload signature</span>
                            <span className="text-[10px] opacity-80 mt-1">PNG, JPG up to 5MB</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileUpload}
                    />
                </div>
            )}
        </div>
    );
}
