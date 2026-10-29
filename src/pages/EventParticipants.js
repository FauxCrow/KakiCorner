import AccessibilityBar from '../components/AccessibilityBar';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import eventData from "../content/events.json";
import ParticipantCard from '../components/ParticipantCard';

function EventParticipants() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const pID = localStorage.getItem("profile_id");

    const events = eventData.events || [];
    const selectedEvent = events.find(event => event.id === Number(id));

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
            <button className="text-left" onClick={() => navigate(-1)} >temp back button</button>
            <h1 className="text-left font-bold text-xl">Participants</h1>

            {selectedEvent.participants_id.length > 0 ? (
                selectedEvent.participants_id.map((participant) => (
                    <ParticipantCard id={participant} isOwner={selectedEvent.host === Number(pID)}></ParticipantCard>
                ))
            ) : (
                <p className="text-gray-500">No participants have signed up yet.</p>
            )}
        </main>
    </div>;
}
export default EventParticipants;
