import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    threshold?: number;
}

export const useInfiniteScroll = ({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 300,
}: UseInfiniteScrollOptions) => {
    const observerTarget = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasMore && !isLoading) {
                onLoadMore();
            }
        },
        [hasMore, isLoading, onLoadMore]
    );

    useEffect(() => {
        const element = observerTarget.current;
        const option = {
            root: null,
            rootMargin: `${threshold}px`,
            threshold: 0,
        };

        const observer = new IntersectionObserver(handleObserver, option);
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [handleObserver, threshold]);

    return { observerTarget };
};
