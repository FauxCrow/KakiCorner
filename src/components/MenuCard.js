import React from 'react';

export default function MenuCard({
    title = "",
    ...props
}) {

    return (
        <button
            className="w-full p-4 min-h-[150px] bg-gray-100 rounded-2xl shadow-md flex items-end justify-center text-base hover:scale-105 transition"
            {...props}
        >
            {title}
        </button>
    );
}
