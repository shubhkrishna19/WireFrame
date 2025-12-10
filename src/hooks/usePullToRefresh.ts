import { useState, useEffect, useRef } from 'react';

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void>;
    threshold?: number;
    resistance?: number;
}

export const usePullToRefresh = ({
    onRefresh,
    threshold = 80,
    resistance = 2.5,
}: UsePullToRefreshOptions) => {
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef(0);
    const currentY = useRef(0);

    useEffect(() => {
        let isMounted = true;

        const handleTouchStart = (e: TouchEvent) => {
            // Only activate if scrolled to top
            if (window.scrollY === 0) {
                startY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (window.scrollY > 0 || isRefreshing) return;

            currentY.current = e.touches[0].clientY;
            const distance = currentY.current - startY.current;

            if (distance > 0) {
                setIsPulling(true);
                setPullDistance(distance / resistance);
            }
        };

        const handleTouchEnd = async () => {
            if (pullDistance > threshold && !isRefreshing) {
                setIsRefreshing(true);
                try {
                    await onRefresh();
                } finally {
                    if (isMounted) {
                        setIsRefreshing(false);
                    }
                }
            }
            setIsPulling(false);
            setPullDistance(0);
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            isMounted = false;
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onRefresh, threshold, resistance, pullDistance, isRefreshing]);

    return {
        isPulling,
        pullDistance: Math.min(pullDistance, threshold * 1.5),
        isRefreshing,
    };
};
