import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import EventCard from '../components/EventCard';
import eventData from "../content/events.json";

function Events() {
    const { type } = useParams();
    const eventType = type || "all";

    const pID = Number(localStorage.getItem("profile_id"));

    const [filteredEvents, setFilteredEvents] = useState([]);
    const [typeTitle, setTypeTitle] = useState();

    const [isCurrentTab, setIsCurrentTab] = useState(true);

    const handleOptionClick = (isCurrent) => {
        setIsCurrentTab(isCurrent);
    };

    useEffect(() => {
        const events = eventData.events || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let baseEvents = [];
        if (eventType === "created") {
            baseEvents = events.filter(event => event.host === pID);
            setTypeTitle("My Created");
        } else if (eventType === "joined") {
            baseEvents = events.filter(event => event.participants_id?.includes(pID));
            setTypeTitle("My Joined");
        } else {
            baseEvents = events;
            setTypeTitle("All Events");
        }

        if (eventType === "created" || eventType === "joined") {
            const dateFiltered = baseEvents.filter(event => {
                const [day, month, year] = event.date.split('/');
                const [hours, minutes] = event.time ? event.time.split(':') : [0, 0];
                const eventDateTime = new Date(year, month - 1, day, hours, minutes);

                if (isCurrentTab) {
                    return eventDateTime >= today;
                } else {
                    return eventDateTime < today;
                }
            });
            setFilteredEvents(dateFiltered);
        } else {
            setFilteredEvents(baseEvents);
        }
    }, [eventType, pID, isCurrentTab]);

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4">
            <h1 className="text-left font-bold text-xl w-full mx-auto max-w-md">{typeTitle} Event</h1>

            {/* Button Stage */}
            {(eventType === "created" || eventType === "joined") && (
                <div className="text-left flex flex-row gap-x-4 w-full mx-auto max-w-md">
                    <button onClick={() => handleOptionClick(true)} >temp Current</button>
                    <button onClick={() => handleOptionClick(false)} >temp Past</button>
                </div>
            )}

            {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <p className="text-gray-500">No events found for this category.</p>
            )}
        </main>

        <NavBar></NavBar>
    </div>;
}
export default Events;