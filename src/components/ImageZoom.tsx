import React, { useState } from 'react';

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className = '' }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <div
            className={`relative overflow-hidden cursor-zoom-in ${className}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                style={
                    isZoomed
                        ? {
                            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        }
                        : undefined
                }
            />
            {isZoomed && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Zoom In
                </div>
            )}
        </div>
    );
};
