import React from 'react';
import { useTheme } from 'next-themes';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
    const { theme } = useTheme();
    const animationDuration = `${speed}s`;

    // 根據主題選擇適當的顏色和漸變
    const isDark = theme === 'dark';
    const textColor = isDark ? 'text-[#b5b5b5a4]' : 'text-zinc-900';
    const gradientColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)';

    return (
        <div
            className={`${textColor} bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, ${gradientColor} 50%, rgba(255, 255, 255, 0) 60%)`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration: animationDuration,
            }}
        >
            {text}
        </div>
    );
};

export default ShinyText; 