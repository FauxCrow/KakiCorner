import React from 'react';

export default function NavButton({
    icon: Icon,
    title = "",
    iconSize = 24,
    ...props
}) {

    return (
        <button
            className="w-full p-4 mx-auto text-center flex flex-col flex-1 sm:flex-none gap-y-2 text-sm items-center justify-center hover:scale-105 transition"
            {...props}
        >
            {Icon && <Icon size={iconSize} className="shrink-0" />}
            {title}
        </button>
    );
}
