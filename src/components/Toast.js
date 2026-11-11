import React from 'react';
import { Bell } from 'lucide-react';

// Small message near the bottom of the screen; shown and hidden by ToastProvider
export default function Toast({
    message = ""
}) {

    return (
        <div className="fixed bottom-28 left-0 right-0 z-[10000] flex justify-center px-4 pointer-events-none">
            <div role="status" className="max-w-md w-full flex items-center gap-x-3 p-4 bg-gray-800 text-white text-base rounded-2xl shadow-lg">
                <Bell size={22} className="flex-shrink-0" />
                {message}
            </div>
        </div>
    );
}
