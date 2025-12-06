import { useRef, useEffect, useState } from "react";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function PreviewWrapper({ children }) {
    const fullContentRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.45);
    const [pages, setPages] = useState([{ start: 0, end: A4_HEIGHT_PX }]);

    // 1. Calculate Scale to fit container
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth - 32; // -32 for padding
                if (containerWidth > 0) {
                    setScale(Math.min(containerWidth / A4_WIDTH_PX, 1));
                }
            }
        };

        // Initial calc
        handleResize();

        // Listen for window resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. Measure content and paginate (Using ResizeObserver for stability)
    useEffect(() => {
        if (!fullContentRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Determine content height
                const contentHeight = entry.target.scrollHeight;

                if (contentHeight === 0) {
                    setPages([{ start: 0, end: A4_HEIGHT_PX }]);
                    return;
                }

                // Calculate pages
                const totalPages = Math.ceil(contentHeight / A4_HEIGHT_PX);
                const newPages = [];
                for (let p = 0; p < totalPages; p++) {
                    newPages.push({
                        start: p * A4_HEIGHT_PX,
                        end: (p + 1) * A4_HEIGHT_PX,
                    });
                }

                // Only update if page count/structure changes to avoid infinite render loops
                setPages(prev => {
                    if (prev.length === newPages.length) return prev;
                    return newPages;
                });
            }
        });

        observer.observe(fullContentRef.current);
        return () => observer.disconnect();
    }, []); // Empty dependency array - we rely on the generic observer

    return (
        <div ref={containerRef} className="h-full w-full overflow-y-auto overflow-x-hidden bg-bg-card/50 p-4 relative flex flex-col items-center">

            {/* 1. Invisible Measurement Container (Full A4 Width) */}
            <div
                ref={fullContentRef}
                className="absolute top-0 left-0 opacity-0 pointer-events-none -z-10"
                style={{ width: `${A4_WIDTH_PX}px` }}
            >
                {children}
            </div>

            {/* 2. Scaled Preview Display */}
            <div className="flex flex-col items-center space-y-8 flex-1 w-full">
                {pages.map((page, i) => (
                    <div
                        key={i}
                        className="relative bg-white shadow-preview-float origin-top transition-transform duration-200 ease-out"
                        style={{
                            width: `${A4_WIDTH_PX}px`,
                            height: `${A4_HEIGHT_PX}px`,
                            transform: `scale(${scale})`,
                            marginBottom: `-${(A4_HEIGHT_PX * (1 - scale)) - 32}px`, // Adjusted margin compensation
                            flexShrink: 0,
                        }}
                    >
                        {/* Clip content for this page */}
                        <div className="absolute inset-0 overflow-hidden bg-white rounded-[4px]">
                            <div
                                className="absolute w-full"
                                style={{
                                    top: -page.start,
                                    left: 0,
                                }}
                            >
                                {children}
                            </div>

                            {/* Paper Texture Overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Spacer at bottom to allow scrolling past the last scaled item */}
            <div style={{ height: '40px', flexShrink: 0 }}></div>
        </div>
    );
}
