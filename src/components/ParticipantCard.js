import React from 'react';
import profileData from "../content/profile.json";
import ActionButton from "../components/ActionButton";
import eventData from "../content/events.json";
import { useState } from "react";

export default function ParticipantCard({
    id = 1,
    event_id = 0,
    isOwner = false
}) {
    const profiles = JSON.parse(localStorage.getItem("profiles")) || profileData.profiles;
    const profile = profiles.find((p) => p.id === Number(id)) || profiles[0];
    
    const getStoredEvents = () => {
        const saved = localStorage.getItem("events");
        return saved ? JSON.parse(saved) : (eventData.events || []);
    };

    const [events, setEvents] = useState(getStoredEvents());

    const handleAcceptClick = () => {
        const updatedEvents = events.map(event => {
            if (event.id === event_id) {
                return {
                    ...event,
                    participants_id: [...event.participants_id, id],
                    pending_id: event.pending_id.filter(id => id !== id)
                };
            }
            return event;
        });

        localStorage.setItem("events", JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
        window.location.reload();
    };

    const handleRemoveClick = () => {
        const updatedEvents = events.map(event => {
            if (event.id === event_id) {
                return {
                    ...event,
                    pending_id: event.pending_id.filter(id => id !== id)
                };
            }
            return event;
        });

        localStorage.setItem("events", JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
        window.location.reload();
    };

    return (
        <div className="w-full mx-auto max-w-md p-6 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0">
            <div className="flex flex-col w-full gap-y-4">
                <div className="flex items-center w-full gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <img></img>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font=heading text-left text-lg">{profile.name}</h1>
                        <h3 className="font=heading text-left text-sm">{profile.gender}, {profile.age}</h3>
                        <h3 className="font=heading text-left text-sm">{profile.personality}</h3>
                    </div>
                </div>

                {(isOwner) && (
                    <div className="flex items-center justify-between w-full gap-2">
                        <ActionButton title="Accept" className="self-center text-right bg-gray-300" onClick={() => handleAcceptClick()} />
                        <ActionButton title="Remove" className="self-center text-right bg-gray-300" onClick={() => handleRemoveClick()} />
                    </div>
                )}
            </div>
        </div>
    );
}
