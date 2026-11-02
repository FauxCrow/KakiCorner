import React from 'react';

export default function CheckboxCard({
    title = "",
    img = "",
    isChecked = false,
    onChange
}) {

    return (
        <label className={`w-full p-3 rounded-2xl flex items-center gap-x-6 cursor-pointer transition ${isChecked ? 'bg-gray-100' : ''}`}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className="w-8 h-8 flex-shrink-0 accent-gray-500 cursor-pointer"
            />

            <div className="flex-1 flex flex-col items-center gap-y-2 text-sm">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg bg-gray-200" />
                {title}
            </div>
        </label>
    );
}
