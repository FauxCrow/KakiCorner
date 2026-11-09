import React from 'react';

export default function ActionButton({
    title = "",
    className = "",
    ...props
}) {

    return (
        <button
            className={`px-8 py-3 bg-gray-100 rounded-xl shadow-md text-base hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 ${className}`}
            {...props}
        >
            {title}
        </button>
    );
}
