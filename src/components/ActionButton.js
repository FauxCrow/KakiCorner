import React from 'react';
import { useGuide } from '../hooks/TutorialGuide';

export default function ActionButton({
    id,
    title = "",
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
            className={`px-8 py-3 rounded-xl shadow-md text-base transition duration-300 ${
                isTarget
                    ? 'bg-yellow-400 text-black ring-4 ring-yellow-500 animate-pulse font-bold scale-105 z-50'
                    : 'bg-gray-100 hover:scale-105'
            } disabled:opacity-50 disabled:hover:scale-100 ${className}`}
            {...props}
        >
            {title}
        </button>
    );
}