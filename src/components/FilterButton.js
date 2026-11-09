import React from 'react';

export default function FilterButton({
    icon: Icon,
    title = "",
    iconSize = 24,
    isLarge = false,
    ...props
}) {
    return (
        <button
            className="w-full p-4 mx-auto rounded-2xl bg-gray-200 shadow-md flex flex-row items-center justify-center gap-x-2 text-sm hover:scale-105 transition"
            {...props}
        >
            {Icon && <Icon size={iconSize} className="shrink-0" />}
            <span 
                key={title} 
                className="block w-full leading-tight select-none"
                suppressHydrationWarning={true}
            >
                {title}
            </span>
        </button>
    );
}
