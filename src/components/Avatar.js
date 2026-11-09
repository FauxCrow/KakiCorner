import React from 'react';
import { UserRound } from 'lucide-react';

// Default "no profile photo" picture: a grey person in a light grey circle
export default function Avatar({
    className = "w-32 h-32",
    iconSize = 80
}) {

    return (
        <div className={`${className} bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            <UserRound size={iconSize} color="#9CA3AF" fill="#9CA3AF" />
        </div>
    );
}
