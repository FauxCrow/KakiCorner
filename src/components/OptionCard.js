import React from 'react';

export default function OptionCard({
    title = "",
    isSelected = false,
    className = "min-h-[80px]",
    ...props
}) {

    return (
        <button
            className={`w-full p-4 ${className} rounded-2xl shadow-md flex items-center justify-center text-center text-base hover:scale-105 transition ${isSelected ? 'bg-gray-300 ring-2 ring-gray-500' : 'bg-gray-100'}`}
            {...props}
        >
            {title}
        </button>
    );
}
