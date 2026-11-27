import React from 'react';
import Avatar from './Avatar';
import { getProfileById, getCurrentUserId } from '../utils/db';

// "Event Host" label, then the host's picture and full name ("You" if it's the logged-in user)
export default function HostInfo({
    hostId
}) {
    const host = getProfileById(hostId);
    const isYou = Number(hostId) === getCurrentUserId();
    const hostName = isYou ? "You" : (host?.name || "Unknown host");

    return (
        <div className="flex flex-col gap-y-1">
            <span className="text-sm text-gray-700">Event Host</span>

            <div className="flex items-center gap-x-3">
                <Avatar className="w-10 h-10" iconSize={24} />
                {/* Real names shouldn't be translated; "You" should */}
                <span className={`min-w-0 break-words text-base ${isYou ? '' : 'notranslate'}`}>{hostName}</span>
            </div>
        </div>
    );
}
