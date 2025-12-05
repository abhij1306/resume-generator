import { useRef, useEffect, useState } from "react";

const PAGE_HEIGHT = 1123; // px A4 height

export default function PreviewWrapper({ children }) {
    const fullContentRef = useRef(null);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        if (!fullContentRef.current) return;

        // Use setTimeout to ensure render and layout are complete (e.g. fonts/images)
        // For now, sync.
        const contentHeight = fullContentRef.current.scrollHeight;

        // If content is empty or very small, at least one page
        if (contentHeight === 0) {
            setPages([{ start: 0, end: PAGE_HEIGHT }]);
            return;
        }

        const totalPages = Math.ceil(contentHeight / PAGE_HEIGHT);

        // Create an array of offsets for each page slice
        const newPages = [];
        for (let p = 0; p < totalPages; p++) {
            newPages.push({
                start: p * PAGE_HEIGHT,
                end: (p + 1) * PAGE_HEIGHT,
            });
        }

        setPages(newPages);
    }, [children]);

    return (
        <div className="h-full overflow-y-auto bg-bg-card/50 p-4">
            {/* Invisible measurement container */}
            <div ref={fullContentRef} className="absolute opacity-0 pointer-events-none w-[360px] top-0 left-0 -z-10">
                {children}
            </div>

            <div className="relative space-y-8">
                {pages.map((page, i) => (
                    <div key={i} className="a4-page overflow-hidden relative bg-white shadow-preview-float mx-auto">
                        <div
                            className="absolute w-full"
                            style={{
                                top: -page.start,
                                left: 0
                            }}
                        >
                            {children}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
