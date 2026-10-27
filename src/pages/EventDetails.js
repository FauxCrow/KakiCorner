import AccessibilityBar from '../components/AccessibilityBar';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import eventData from "../content/events.json";
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import EventIconLine from '../components/EventIconLine';
import ProgressBar from '../components/ProgressBar';

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const events = eventData.events || [];
    const selectedEvent = events.find(event => event.id === Number(id));

    const handleEditClick = () => {
        // TODO
    };

    const handleDeleteClick = () => {
        // TODO
    };

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
            <button className="text-left" onClick={() => navigate(-1)} >temp back button</button>
            <h1 className="text-left font-bold text-xl">{selectedEvent.tag}</h1>
            <img src={selectedEvent.img} className="rounded-xl"></img>
            <h3 className="text-justify">{selectedEvent.description}</h3>

            <EventIconLine icon={CalendarDays} info={selectedEvent.date}></EventIconLine>
            <EventIconLine icon={Clock} info={selectedEvent.time}></EventIconLine>
            <EventIconLine icon={MapPin} info={selectedEvent.pickup}></EventIconLine>

            <h2 className="text-left font-bold">Participants</h2>

            <div className="w-full mx-auto max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0 flex flex-col gap-y-4">
                <div className="flex items-center justify-between w-full gap-2">
                    <h3 className="text-left">{selectedEvent.max_slots - selectedEvent.participants_id.length} slots left!</h3>
                    <h3 className="text-right">{selectedEvent.participants_id.length} / {selectedEvent.max_slots}</h3>
                </div>

                <ProgressBar value={selectedEvent.participants_id.length} max={selectedEvent.max_slots}></ProgressBar>

                <button onClick={() => navigate(`/eventparticipants/${selectedEvent.id}`)} >temp see participants</button>
            </div>

            <div className="flex items-center justify-between w-full gap-2">
                <button className="text-right" onClick={() => handleEditClick} >temp edit button</button>
                <button className="text-right" onClick={() => handleDeleteClick} >temp delete button</button>
            </div>
        </main>
    </div>;
}
export default EventDetails;
