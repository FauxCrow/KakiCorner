import React from 'react';

export default function EventIconLine({
    icon: Icon,
    info
}) {
    return (
        <div className="flex flex-row gap-x-2 items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Icon></Icon>
            </div>
            
            <h3>{info}</h3>
        </div>
    );
}
