import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";

const PPTViewerPage: React.FC = () => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [pdfWorkerReady, setPdfWorkerReady] = useState<boolean>(false);

    // Check if the PDF.js worker is accessible
    useEffect(() => {
        const checkWorker = async () => {
            try {
                const response = await fetch(
                    new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()
                );
                if (response.ok) {
                    setPdfWorkerReady(true);
                } else {
                    throw new Error("PDF worker not found");
                }
            } catch (error) {
                console.error("Error loading PDF worker:", error);
                setPdfWorkerReady(false);
            }
        };
        checkWorker();
    }, []);

    // Helper function: fetch with a timeout
    const fetchWithTimeout = (url: string, options = {}, timeout = 20000) => {
        return Promise.race([
            fetch(url, options),
            new Promise<Response>((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            )
        ]);
    };

    // Fetch PDF from backend
    useEffect(() => {
        if (!pdfWorkerReady) return;

        setLoading(true);
        fetchWithTimeout("http://127.0.0.1:8000/api/user/convert-ppt-to-pdf")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to load PDF");
                return response.blob();
            })
            .then((blob) => {
                setPdfUrl(URL.createObjectURL(blob));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching PDF:", error);
                setError(true);
                setLoading(false);
            });
    }, [pdfWorkerReady]);

    // Render PDF Page
    const renderPage = useCallback(
        async (pageNumber: number) => {
            if (!pdfUrl || !canvasRef.current) return;

            const pdf = await pdfjs.getDocument(pdfUrl).promise;
            const page = await pdf.getPage(pageNumber);

            // Increase the scale for better quality
            const scale = isFullscreen ? 1.5 : 1.2; // Adjust scale as needed
            const viewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            // Set canvas internal resolution (higher DPI)
            const dpi = window.devicePixelRatio || 1; // Use device pixel ratio for high-DPI screens
            canvas.width = viewport.width * dpi;
            canvas.height = viewport.height * dpi;

            // Scale the canvas CSS to match the desired display size
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;

            // Reset the transformation matrix to the identity matrix
            context?.setTransform(1, 0, 0, 1, 0, 0);

            // Scale the context to match the high DPI
            context?.scale(dpi, dpi);

            const renderContext = {
                canvasContext: context!,
                viewport,
            };

            await page.render(renderContext).promise;
            setNumPages(pdf.numPages);
        },
        [pdfUrl, isFullscreen]
    );

    useEffect(() => {
        if (pdfUrl) {
            renderPage(currentPage);
        }
    }, [pdfUrl, currentPage, renderPage]);

    // Navigate to the previous page
    const goToPreviousPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    // Navigate to the next page
    const goToNextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, numPages));
    }, [numPages]);

    // Keyboard Navigation for arrows and escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                goToPreviousPage(); // ArrowLeft
            } else if (event.shiftKey && event.key === 'Enter') {
                event.preventDefault(); // Prevent default behavior
                goToPreviousPage(); // Shift + Enter
            } else if (event.key === "ArrowRight") {
                goToNextPage(); // ArrowRight
            } else if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault(); // Prevent default behavior
                goToNextPage(); // Enter (without Shift)
            } else if (event.key === "Escape") {
                if (isFullscreen) {
                    exitFullscreen(); // Escape (only in fullscreen mode)
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [goToPreviousPage, goToNextPage, isFullscreen]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            // Check if the window size matches the screen size
            const isFullscreen = window.innerWidth === screen.width && window.innerHeight === screen.height;
            setIsFullscreen(isFullscreen);
        };

        // Listen for resize events to detect fullscreen changes
        window.addEventListener("resize", handleFullscreenChange);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleFullscreenChange);
        };
    }, []);

    // Listen for changes to fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Exit fullscreen mode
    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center bg-white dark:bg-zinc-950 ${isFullscreen ? "h-[100vh]" : "h-[89.5vh]"}`}>
            <div className="flex flex-col items-center justify-center">
                {/* Show Loading Spinner */}
                {loading && !error && (
                    <div className="flex flex-col items-center z-10">
                        <div className="animate-spin h-20 w-20 border-8 border-black dark:border-white  border-t-transparent dark:border-t-transparent rounded-full"></div>
                        <p className="dark:text- dark:text-white text-lg mt-5 select-none">Loading presentation...</p>
                    </div>
                )}

                {/* Show Custom Error Message */}
                {!loading && error && (
                    <div className="text-center z-10">
                        <p className="text-red-500 mb-5 text-lg select-none">❌ Unable to load the presentation.</p>
                        <Button variant="destructive" onClick={() => window.location.reload()} className="h-9 text-lg">
                            Retry
                        </Button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="absolute">
                        {/* Display PDF Canvas */}
                        <div className={`flex justify-center items-center z-0 ${isFullscreen ? "w-[100vw] h-[100vh]" : "w-[93vw] h-[93vh]"}`}>
                            <canvas ref={canvasRef} className="shadow-lg z-0" />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-1 z-0">
                            <Button onClick={goToPreviousPage} className="rounded-full p-2 hover:scale-110 hover:ring-2 hover:ring-gray-500 dark:hover:ring-gray-300 transition-all duration-200">
                                <ArrowLeft size={24} />
                            </Button>
                            <Button onClick={goToNextPage} className="rounded-full p-2 hover:scale-110 hover:ring-2 hover:ring-gray-500 dark:hover:ring-gray-300 transition-all duration-200">
                                <ArrowRight size={24} />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Page Indicator */}
                {!loading && !error && numPages > 0 && (
                    <div className="fixed bottom-0 left-1/2 transform -translate-x-[50%] bg-inherit">
                        <p className="text-sm select-none">
                            Slide {currentPage} of {numPages}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PPTViewerPage;
