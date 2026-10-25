import React from 'react';

export default function AccessibilityButton({
    icon: Icon,
    title = "",
    iconSize = 24,
    isLarge = false,
    ...props
}) {

    return (
        <button
            className={`w-full ${isLarge ? 'p-2' : 'p-4'}  mx-auto rounded-2xl shadow-md text-center flex flex-col flex-1 sm:flex-none gap-y-2 text-sm items-center justify-center hover:scale-105 transition`}
            {...props}
        >
            {Icon && <Icon size={iconSize} className="shrink-0" />}
            {title}
        </button>
    );
}
