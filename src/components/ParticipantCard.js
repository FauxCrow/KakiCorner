import React from 'react';
// import profileData from "../content/profile.json";
import ActionButton from "../components/ActionButton";
// import eventData from "../content/events.json";
import { useState } from "react";
import { getEvents, saveEvents, getProfiles } from "../utils/db";
import Avatar from '../components/Avatar';

export default function ParticipantCard({
    id = 1,
    event_id = 0,
    isOwner = false
}) {
    // const profiles = JSON.parse(localStorage.getItem("profiles")) || profileData.profiles;
    const profiles = getProfiles();
    const profile = profiles.find((p) => p.id === Number(id)) || profiles[0];

    // const getStoredEvents = () => {
    //     const saved = localStorage.getItem("events");
    //     return saved ? JSON.parse(saved) : (eventData.events || []);
    // };

    // const [events, setEvents] = useState(getStoredEvents());
    const [events, setEvents] = useState(getEvents());

    const handleAcceptClick = () => {
        // Don't accept more people than there are slots
        const thisEvent = events.find((event) => event.id === event_id);
        if (thisEvent.participants_id.length >= thisEvent.max_slots) {
            alert("This event is full!");
            return;
        }

        const updatedEvents = events.map(event => {
            if (event.id === event_id) {
                return {
                    ...event,
                    participants_id: [...event.participants_id, id],
                    // Bug: the inner "id" hid the card's id, so every pending person was removed
                    // pending_id: event.pending_id.filter(id => id !== id)
                    pending_id: event.pending_id.filter((personId) => personId !== id)
                };
            }
            return event;
        });

        // localStorage.setItem("events", JSON.stringify(updatedEvents));
        saveEvents(updatedEvents);
        setEvents(updatedEvents);
        window.location.reload();
    };

    const handleRemoveClick = () => {
        const updatedEvents = events.map(event => {
            if (event.id === event_id) {
                return {
                    ...event,
                    // pending_id: event.pending_id.filter(id => id !== id)
                    pending_id: event.pending_id.filter((personId) => personId !== id)
                };
            }
            return event;
        });

        // localStorage.setItem("events", JSON.stringify(updatedEvents));
        saveEvents(updatedEvents);
        setEvents(updatedEvents);
        window.location.reload();
    };

    return (
        <div className="w-full mx-auto max-w-md p-6 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0">
            <div className="flex flex-col w-full gap-y-4">
                <div className="flex items-center w-full gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Avatar iconSize={32} className = "w-16 h-16"></Avatar>
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
