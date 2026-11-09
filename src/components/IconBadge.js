import React from 'react';
import { ICONS } from '../utils/icons';

export default function IconBadge({
    icon = "",
    color = "#6B7280",
    size = 32,
    className = "w-16 h-16 rounded-full"
}) {
    const Icon = ICONS[icon] || ICONS.CircleHelp;

    // "1A" on the end of the hex colour makes a light, see-through version for the circle
    return (
        <div
            // className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            className={`${className} flex items-center justify-center flex-shrink-0`}
            style={{ backgroundColor: `${color}1A` }}
        >
            <Icon size={size} color={color} />
        </div>
    );
}
