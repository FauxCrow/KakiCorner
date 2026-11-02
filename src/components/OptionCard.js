import React from 'react';

export default function OptionCard({
    title = "",
    isSelected = false,
    ...props
}) {

    return (
        <button
            className={`w-full p-4 min-h-[80px] rounded-2xl shadow-md flex items-center justify-center text-center text-base hover:scale-105 transition ${isSelected ? 'bg-gray-300 ring-2 ring-gray-500' : 'bg-gray-100'}`}
            {...props}
        >
            {title}
        </button>
    );
}
