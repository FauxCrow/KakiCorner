import React from 'react';

export default function EventOverviewCard({
    details = []
}) {

    return (
        <div className="w-full p-6 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0 flex flex-col gap-y-3 text-left">
            <h2 className="text-base">Event Overview</h2>
            {details.map((detail, index) => (
                <p key={index} className="text-sm">{detail}</p>
            ))}
        </div>
    );
}
