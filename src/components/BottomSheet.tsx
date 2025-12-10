import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    showApplyButton?: boolean;
    onApply?: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    title,
    children,
    showApplyButton = true,
    onApply,
}) => {
    const { theme } = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
            setCurrentY(deltaY);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (currentY > 100) {
            onClose();
        }
        setCurrentY(0);
        setStartY(0);
    };

    const handleApply = () => {
        if (onApply) {
            onApply();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 lg:hidden animate-fade-in"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black transition-opacity"
                style={{ opacity: isOpen ? 0.5 : 0 }}
            />

            {/* Bottom Sheet */}
            <div
                className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up-bottom"
                style={{
                    backgroundColor: theme.colors.cardBackground,
                    transform: `translateY(${currentY}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag Handle */}
                <div
                    className="py-3 flex justify-center cursor-grab active:cursor-grabbing"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="w-12 h-1.5 rounded-full"
                        style={{ backgroundColor: theme.colors.borderSecondary }}
                    />
                </div>

                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b-2"
                    style={{ borderColor: theme.colors.borderSecondary }}
                >
                    <h2 className="text-xl font-bold" style={{ color: theme.colors.textPrimary }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-opacity-80 transition-all"
                        style={{ backgroundColor: theme.colors.backgroundSecondary }}
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.textPrimary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                    {children}
                </div>

                {/* Footer with Apply Button */}
                {showApplyButton && (
                    <div
                        className="px-6 py-4 border-t-2"
                        style={{ borderColor: theme.colors.borderSecondary }}
                    >
                        <button
                            onClick={handleApply}
                            className="w-full py-4 rounded-creative font-bold text-lg transition-all hover:opacity-90"
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                                color: '#FFFFFF',
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up-bottom {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-up-bottom {
          animation: slide-up-bottom 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};
