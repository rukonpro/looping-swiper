import React, { useState, useRef, useEffect, ReactNode } from "react";

export interface LoopingSwiperProps {
    children: ReactNode[];
    gap?: number;
    circular?: boolean;
}

export const LoopingSwiper: React.FC<LoopingSwiperProps> = ({
                                                                children,
                                                                gap = 20,
                                                                circular = false,
                                                            }) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const startX = useRef<number | null>(null);
    const isDragging = useRef(false);
    const translateX = useRef(0);

    const items = React.Children.toArray(children);
    const loopItems = circular ? [...items, ...items, ...items] : items;
    const middleIndex = circular ? items.length : 0;

    const [current, setCurrent] = useState(middleIndex);
    const [cardWidth, setCardWidth] = useState(300);
    const [visibleCount, setVisibleCount] = useState(1);

    // Responsive width
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && trackRef.current?.firstChild instanceof HTMLElement) {
                const cWidth = containerRef.current.offsetWidth;
                const singleCardWidth = trackRef.current.firstChild.offsetWidth + gap;
                setCardWidth(singleCardWidth);
                setVisibleCount(Math.floor(cWidth / singleCardWidth));
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [gap]);

    // Circular reset
    useEffect(() => {
        if (!circular) return;
        if (current >= loopItems.length - middleIndex) {
            const timeout = setTimeout(() => {
                setCurrent(middleIndex);
                if (trackRef.current) {
                    trackRef.current.style.transition = "none";
                    trackRef.current.style.transform = `translateX(-${middleIndex * cardWidth}px)`;
                    void trackRef.current.offsetWidth;
                    trackRef.current.style.transition = "transform 0.3s ease-in-out";
                }
            }, 300);
            return () => clearTimeout(timeout);
        }
        if (current < middleIndex) {
            const timeout = setTimeout(() => {
                setCurrent(loopItems.length - middleIndex - 1);
                if (trackRef.current) {
                    trackRef.current.style.transition = "none";
                    trackRef.current.style.transform = `translateX(-${
                        (loopItems.length - middleIndex - 1) * cardWidth
                    }px)`;
                    void trackRef.current.offsetWidth;
                    trackRef.current.style.transition = "transform 0.3s ease-in-out";
                }
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [current, loopItems.length, middleIndex, cardWidth, circular]);

    const next = () => {
        if (circular) setCurrent((prev) => prev + 1);
        else if (current < items.length - visibleCount) setCurrent((prev) => prev + 1);
    };

    const prev = () => {
        if (circular) setCurrent((prev) => prev - 1);
        else if (current > 0) setCurrent((prev) => prev - 1);
    };

    // Drag / Touch
    const handleStart = (clientX: number) => {
        isDragging.current = true;
        startX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging.current || startX.current === null || !trackRef.current) return;
        translateX.current = clientX - startX.current;
        trackRef.current.style.transform = `translateX(calc(${-current * cardWidth}px + ${translateX.current}px))`;
    };

    const handleEnd = () => {
        if (!isDragging.current || !trackRef.current) return;
        isDragging.current = false;
        if (translateX.current > 50) prev();
        else if (translateX.current < -50) next();
        translateX.current = 0;
        trackRef.current.style.transform = `translateX(-${current * cardWidth}px)`;
    };

    // Mouse wheel support
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0) next();
            else if (e.deltaY < 0) prev();
        };
        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, [current]);

    return (
        <div
            ref={containerRef}
            className="relative w-full flex items-center justify-start overflow-hidden"
        >
            <div
                ref={trackRef}
                className="flex transition-transform duration-300 ease-in-out select-none"
                style={{ transform: `translateX(-${current * cardWidth}px)` }}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
            >
                {loopItems.map((child, idx) => (
                    <div key={idx} className="flex-shrink-0" style={{ marginRight: `${gap}px` }}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};
