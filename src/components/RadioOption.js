import React from 'react';

export default function RadioOption({
    name = "",
    isChecked = false,
    onChange,
    children
}) {

    return (
        <label className={`w-full p-4 rounded-2xl shadow-sm flex items-center gap-x-4 cursor-pointer transition ${isChecked ? 'bg-gray-300 ring-2 ring-gray-500' : 'bg-gray-100'}`}>
            <input
                type="radio"
                name={name}
                checked={isChecked}
                onChange={onChange}
                className="w-6 h-6 flex-shrink-0 accent-gray-500 cursor-pointer"
            />

            <div className="flex-1 flex flex-col text-left">
                {children}
            </div>
        </label>
    );
}
