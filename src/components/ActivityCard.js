import React from 'react';
import IconBadge from './IconBadge';

export default function ActivityCard({
    title = "",
    img = "",
    icon = "",
    color,
    isSelected = false,
    ...props
}) {

    return (
        <button
            className={`w-full p-4 min-h-[130px] rounded-2xl shadow-md flex flex-col items-center justify-end gap-y-2 text-sm hover:scale-105 transition ${isSelected ? 'bg-gray-300 ring-2 ring-gray-500' : 'bg-gray-100'}`}
            {...props}
        >
            {/* <img src={img} alt="" className="w-full h-16 object-cover rounded-xl" /> */}
            <IconBadge icon={icon} color={color} />
            {title}
        </button>
    );
}
