import React, { useState, MouseEvent } from 'react';

interface RippleEffect {
    x: number;
    y: number;
    size: number;
    id: number;
}

interface ButtonRippleProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    style?: React.CSSProperties;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    ariaLabel?: string;
}

export const ButtonRipple: React.FC<ButtonRippleProps> = ({
    children,
    onClick,
    className = '',
    style,
    type = 'button',
    disabled = false,
    ariaLabel,
}) => {
    const [ripples, setRipples] = useState<RippleEffect[]>([]);

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple: RippleEffect = {
            x,
            y,
            size,
            id: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        // Call original onClick
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <button
            type={type}
            onClick={createRipple}
            className={`relative overflow-hidden ${className}`}
            style={style}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white pointer-events-none ripple-animation"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                        opacity: 0.4,
                    }}
                />
            ))}

            <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.4;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        
        .ripple-animation {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
        </button>
    );
};
