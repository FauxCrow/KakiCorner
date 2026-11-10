import React from 'react';
import { useGuide } from '../hooks/TutorialGuide';

export default function NavButton({
    id,
    icon: Icon,
    title = "",
    iconSize = 24,
    onClick,
    ...props
}) {
    const { currentStep, handleElementClick } = useGuide();

    const isTarget = id && currentStep?.targetId === id;

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
            className={`w-full rounded-xl p-4 mx-auto text-center flex flex-col flex-1 sm:flex-none gap-y-2 text-sm items-center justify-center hover:scale-105 transition ${
                isTarget
                    ? 'bg-yellow-400 text-black ring-4 ring-yellow-500 animate-pulse font-bold scale-105 z-50'
                    : ''
            }`}
            {...props}
        >
            {Icon && <Icon size={iconSize} className="shrink-0" />}
            {title}
        </button>
    );
}
