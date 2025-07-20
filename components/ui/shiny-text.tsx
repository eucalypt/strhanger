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
        // 淺色模式：使用 reactbits.dev 的漸變文字效果
        const gradientStyle = {
            backgroundImage: 'linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)',
            animationDuration: `${speed}s`,
        };

        return (
            <div
                className={`relative inline-block ${className}`}
            >
                <div
                    className="inline-block relative text-transparent bg-cover animate-gradient"
                    style={{
                        ...gradientStyle,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        backgroundSize: "300% 100%",
                    }}
                >
                    {text}
                </div>
            </div>
        );
    }
};

export default ShinyText; 