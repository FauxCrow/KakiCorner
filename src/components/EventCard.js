import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({
    event
}) {
    const navigate = useNavigate();

    return (
        <div className="w-full mx-auto max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between w-full gap-2">
                    <h1 className="font=heading font-bold">{event.tag}</h1>
                    <h1 className="bg-gray-300 p-1">{event.participants_id.length} participants</h1>
                </div>
                <img src={event.img}></img>
                <h3 className="line-clamp-2 text-justify">{event.description}</h3>
                <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="font=heading text-left text-lg">{event.date}</h1>
                        <h1 className="font=heading text-left text-lg">{event.time}</h1>
                    </div>
                    <button className="text-right" onClick={() => navigate(`/eventdetails/${event.id}`)} >temp details button</button>
                </div>
            </div>
        </div>
    );
}
