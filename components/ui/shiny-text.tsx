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
    
    if (isDark) {
        // 深色模式：使用背景漸變
        return (
            <div
                className={`text-[#b5b5b5a4] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
                style={{
                    backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    animationDuration: animationDuration,
                }}
            >
                {text}
            </div>
        );
    } else {
        // 淺色模式：使用偽元素實現閃亮效果
        return (
            <div className={`relative text-zinc-900 inline-block ${className}`}>
                <span className="relative z-10">{text}</span>
                {!disabled && (
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shine"
                        style={{
                            backgroundSize: '200% 100%',
                            animationDuration: animationDuration,
                        }}
                    />
                )}
            </div>
        );
    }
};

export default ShinyText; 