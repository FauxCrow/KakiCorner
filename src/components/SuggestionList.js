import React from 'react';
import { MapPin } from 'lucide-react';

export default function SuggestionList({
    suggestions = [],
    onSelect
}) {
    if (suggestions.length === 0) return null;

    return (
        // flex-shrink-0: without it the scrolling page squashes this list down to just its border
        <div className="w-full flex flex-col flex-shrink-0 rounded-2xl border-2 border-gray-200 bg-white overflow-hidden -mt-4">
            {suggestions.map((place, index) => (
                <button
                    key={`${index}-${place.address}`}
                    className="notranslate p-3 flex items-center gap-x-3 text-left text-sm border-b border-gray-200 last:border-b-0 hover:bg-gray-100"
                    onClick={() => onSelect(place)}
                >
                    <MapPin size={18} className="flex-shrink-0 text-gray-500" />
                    {place.address}
                </button>
            ))}
        </div>
    );
}
