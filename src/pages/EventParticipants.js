import AccessibilityBar from '../components/AccessibilityBar';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
// import eventData from "../content/events.json";
import { getEvents, getCurrentUserId } from "../utils/db";
import ParticipantCard from '../components/ParticipantCard';
import ActionButton from "../components/ActionButton";
import { isPastEvent } from "../utils/date";

function EventParticipants() {
    const { id } = useParams();
    const navigate = useNavigate();

    // const pID = localStorage.getItem("profile_id");
    const pID = getCurrentUserId();

    // const events = JSON.parse(localStorage.getItem("events")) || eventData.events;
    const events = getEvents();
    const selectedEvent = events.find(event => event.id === Number(id));

    // Past events: the joined list stays visible, but pending requests and Accept/Remove are hidden
    const isPast = selectedEvent ? isPastEvent(selectedEvent) : false;

    if (!selectedEvent) {
        return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
            <AccessibilityBar></AccessibilityBar>

            <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
                <ActionButton title="Back" className="w-fit text-left" onClick={() => navigate(-1)} />
                <p className="text-gray-500">This event no longer exists.</p>
            </main>
        </div>;
    }

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
            <ActionButton title="Back" className="w-fit text-left" onClick={() => navigate(-1)} />
            <h1 className="text-left font-bold text-xl">Participants</h1>

            {selectedEvent.participants_id.length > 0 ? (
                selectedEvent.participants_id.map((participant) => (
                    <ParticipantCard key={participant} id={participant} event_id={selectedEvent.id} isOwner={false}></ParticipantCard>
                ))
            ) : (
                <p className="text-gray-500">No participants have signed up yet.</p>
            )}

            {/* {(selectedEvent.host === Number(pID) && selectedEvent.pending_id.length > 0) && ( */}
            {(selectedEvent.host === Number(pID) && selectedEvent.pending_id.length > 0 && !isPast) && (
                selectedEvent.pending_id.map((participant) => (
                    <ParticipantCard key={participant} id={participant} event_id={selectedEvent.id} isOwner={selectedEvent.host === Number(pID)}></ParticipantCard>
                ))
            )}
        </main>
    </div>;
}
export default EventParticipants;
