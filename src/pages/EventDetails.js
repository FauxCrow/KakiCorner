import AccessibilityBar from '../components/AccessibilityBar';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from "react";
// import eventData from "../content/events.json";
import { getEvents, saveEvents, deleteEvent, getCurrentUserId } from "../utils/db";
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import EventIconLine from '../components/EventIconLine';
import ProgressBar from '../components/ProgressBar';
import ActionButton from "../components/ActionButton";
import ActivityIcon from "../components/ActivityIcon";
// import { formatDate } from "../utils/date";
import { formatDate, isPastEvent } from "../utils/date";

function EventDetails() {
    const { id } = useParams();
    // const pID = localStorage.getItem("profile_id");
    const pID = getCurrentUserId();

    const navigate = useNavigate();

    // const getStoredEvents = () => {
    //     const saved = localStorage.getItem("events");
    //     return saved ? JSON.parse(saved) : (eventData.events || []);
    // };

    // const [events, setEvents] = useState(getStoredEvents());
    const [events, setEvents] = useState(getEvents());
    const selectedEvent = events.find(event => event.id === Number(id));

    const isParticipating = selectedEvent?.participants_id?.includes(Number(pID)) || selectedEvent?.pending_id?.includes(Number(pID));
    const isPending = selectedEvent?.pending_id?.includes(Number(pID));

    // Past events can still be viewed, but nothing can be changed
    const isPast = selectedEvent ? isPastEvent(selectedEvent) : false;

    const handleEditClick = () => {
        // navigate(`/createevent`);
        navigate(`/editevent/${selectedEvent.id}`);
    };

    const handleDeleteClick = () => {
        // const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
        // localStorage.setItem("events", JSON.stringify(updatedEvents));
        deleteEvent(selectedEvent.id);
        navigate(-1);
    };

    const handleJoinClick = () => {
        if (selectedEvent.participants_id.length >= selectedEvent.max_slots) {
            alert("This event is full!");
            return;
        }

        const updatedEvents = events.map(event => {
            if (event.id === selectedEvent.id && !event.pending_id.includes(Number(pID))) {
                return {
                    ...event,
                    pending_id: [...event.pending_id, Number(pID)]
                };
            }
            return event;
        });

        // localStorage.setItem("events", JSON.stringify(updatedEvents));
        saveEvents(updatedEvents);
        setEvents(updatedEvents);

        alert('An SMS has been sent to your caretaker.');
    };

    const handleLeaveClick = () => {
        const updatedEvents = events.map(event => {
            if (event.id === selectedEvent.id) {
                return {
                    ...event,
                    participants_id: event.participants_id.filter(id => id !== Number(pID)),
                    pending_id: event.pending_id.filter(id => id !== Number(pID))
                };
            }
            return event;
        });

        // localStorage.setItem("events", JSON.stringify(updatedEvents));
        saveEvents(updatedEvents);
        setEvents(updatedEvents);

        alert('An SMS has been sent to your caretaker.');
    };

    // e.g. pressing Back after deleting it
    if (!selectedEvent) {
        return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
            <AccessibilityBar></AccessibilityBar>

            <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
                <div className="flex items-center justify-between w-full gap-2">
                    <ActionButton id="back-button" title="Back" className="w-fit text-left" onClick={() => navigate(-1)} />
                    <ActionButton title="Chat" className="self-center text-right" onClick={() => navigate(`/selectmessages/${selectedEvent.id}`)} />
                </div>

                <p className="text-gray-500">This event no longer exists.</p>
            </main>
        </div>;
    }

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
            <div className="flex items-center justify-between w-full gap-2">
                <ActionButton id="back-button" title="Back" className="w-fit text-left" onClick={() => navigate(-1)} />
                <ActionButton title="Chat" className="self-center text-right" onClick={() => navigate(`/selectmessages/${selectedEvent.id}`)} />
            </div>
            <h1 className="text-left font-bold text-xl">{selectedEvent.tag}</h1>

            {isPast && (
                <p className="text-sm text-gray-500 -mt-2">This event has ended.</p>
            )}
            {/* <img src={selectedEvent.img} className="rounded-xl"></img> */}
            <ActivityIcon tag={selectedEvent.tag} size={72} className="w-full h-40 rounded-xl" />
            <h3 className="text-justify">{selectedEvent.description}</h3>

            {/* <EventIconLine icon={CalendarDays} info={selectedEvent.date}></EventIconLine> */}
            <EventIconLine icon={CalendarDays} info={formatDate(selectedEvent.date)}></EventIconLine>
            <EventIconLine icon={Clock} info={selectedEvent.time}></EventIconLine>
            <EventIconLine icon={MapPin} info={selectedEvent.pickup}></EventIconLine>

            <h2 className="text-left font-bold">Participants</h2>

            <div className="w-full mx-auto max-w-md p-6 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0 flex flex-col gap-y-4">
                <div className="flex items-center justify-between w-full gap-2">
                    {/* "text-red" isn't a Tailwind colour, so it never showed red */}
                    {/* <h3 className="text-left text-red">{selectedEvent.max_slots - selectedEvent.participants_id.length} slots left, {selectedEvent.pending_id.length} pending!</h3> */}
                    {selectedEvent.host === Number(pID) ? (
                        <h3 className="text-left text-red-600">{selectedEvent.max_slots - selectedEvent.participants_id.length} slots left, {selectedEvent.pending_id.length} pending!</h3>
                    ) : (
                        <h3 className="text-left">{selectedEvent.max_slots - selectedEvent.participants_id.length} slots left!</h3>
                    )}

                    <h3 className="text-right">{selectedEvent.participants_id.length} / {selectedEvent.max_slots}</h3>
                </div>

                <ProgressBar value={selectedEvent.participants_id.length} max={selectedEvent.max_slots}></ProgressBar>

                <ActionButton id="see-participants-button" title="See Participants" className="self-center bg-gray-300" onClick={() => navigate(`/eventparticipants/${selectedEvent.id}`)} />
            </div>

            {/* Edit / Delete / Leave / Join are hidden once the event has passed */}
            {/* {(selectedEvent.host === Number(pID)) && ( */}
            {(selectedEvent.host === Number(pID) && !isPast) && (
                <div className="flex items-center justify-between w-full gap-2">
                    <ActionButton title="Edit" className="self-center text-right" onClick={() => handleEditClick()} />
                    <ActionButton title="Delete" className="self-center text-right" onClick={() => handleDeleteClick()} />
                </div>
            )}

            {isPending && (
                <p className="text-sm font-semibold text-amber-600">Your join request is pending approval.</p>
            )}

            {/* {(isParticipating) && ( */}
            {(isParticipating && !isPast) && (
                <ActionButton title="Leave" className="self-center text-right" onClick={() => handleLeaveClick()} />
            )}

            {/* {(!isParticipating && selectedEvent.host !== Number(pID)) && ( */}
            {(!isParticipating && selectedEvent.host !== Number(pID) && !isPast) && (
                <ActionButton title="Join" className="self-center text-right" onClick={() => handleJoinClick()} />
            )}

        </main>
    </div>;
}
export default EventDetails;
