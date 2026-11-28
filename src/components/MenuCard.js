import React from 'react';
import { useGuide } from '../hooks/TutorialGuide';

export default function MenuCard({
    id,
    title = "",
    icon: Icon,
    isPrimary = false,
    className = "",
    onClick,
    ...props
}) {
    const { currentStep, handleElementClick } = useGuide();

    const isTarget = Boolean(id && currentStep?.targetId === id);

    const handleClick = (e) => {
        if (id) {
            handleElementClick(id);
        }
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            id={id}
            onClick={handleClick}
            // className={`w-full p-4 min-h-[150px] bg-gray-100 rounded-2xl shadow-md flex items-end justify-center text-base hover:scale-105 transition ${isTarget
            // Primary (action) tiles are darker and bold, so they look different from the "my events" lists
            className={`w-full p-4 min-h-[150px] ${isTarget ? '' : isPrimary ? 'bg-gray-300 font-semibold' : 'bg-gray-100'} rounded-2xl shadow-md flex flex-col items-center justify-center gap-y-3 text-lg text-center hover:scale-105 transition ${isTarget
                    ? 'bg-yellow-400 text-black ring-4 ring-yellow-500 animate-pulse font-bold scale-105 z-50'
                    : ''
                } disabled:opacity-50 disabled:hover:scale-100 ${className}`}
            {...props}
        >
            {Icon && <Icon size={40} className="flex-shrink-0" />}
            {title}
        </button>
    );
}
