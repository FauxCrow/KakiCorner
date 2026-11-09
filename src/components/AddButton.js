import React from 'react';
import { Plus } from 'lucide-react';

export default function AddButton({
    title = "",
    ...props
}) {

    return (
        <button
            className="w-full p-3 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-x-2 text-sm text-gray-600 hover:bg-gray-100 transition"
            {...props}
        >
            <Plus size={20} />
            {title}
        </button>
    );
}
