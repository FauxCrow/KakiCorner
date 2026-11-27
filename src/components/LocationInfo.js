import React from 'react';
import { MapPin } from 'lucide-react';

// "📍 Region: address" on its own row; the region is left out if the event has no proper one saved
export default function LocationInfo({
    region,
    location = ""
}) {
    const hasRegion = typeof region === "string" && region.trim() !== "";

    return (
        <div className="flex items-start gap-x-2 text-left">
            <MapPin size={20} className="flex-shrink-0 mt-0.5 text-gray-700" />
            <p className="min-w-0 break-words text-base">
                {hasRegion && <span className="font-bold">{region}: </span>}
                {/* Addresses shouldn't be translated */}
                <span className="notranslate">{location}</span>
            </p>
        </div>
    );
}
