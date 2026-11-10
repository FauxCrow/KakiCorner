import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import EventCard from '../components/EventCard';
// import eventData from "../content/events.json";
import { getEvents, getCurrentUserId } from "../utils/db";
import ActionButton from "../components/ActionButton";
import { isPastEvent } from "../utils/date";
import SearchBar from "../components/SearchBar";
import { Funnel } from 'lucide-react';
import activityData from "../content/activities.json";
import DropdownButton from "../components/DropdownButton";

function EventsB() {
    const { type } = useParams();
    const eventType = type || "all";

    const activities = activityData.activities || [];

    // const pID = Number(localStorage.getItem("profile_id"));
    const pID = getCurrentUserId();

    const [filteredEvents, setFilteredEvents] = useState([]);
    const [typeTitle, setTypeTitle] = useState();

    const [isCurrentTab, setIsCurrentTab] = useState(true);

    const handleOptionClick = (isCurrent) => {
        setIsCurrentTab(isCurrent);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [selectedDateOption, setSelectedDateOption] = useState("");
    const [selectedTimeOption, setSelectedTimeOption] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");

    const resetFilters = () => {
        setSelectedActivity("");
        setSelectedDateOption("");
        setSelectedTimeOption("");
        setSelectedRegion("");
    };

    // Helper to parse event date strings like "12/12/2027" or similar
    const parseEventDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // Assumes DD/MM/YYYY or MM/DD/YYYY based on your project standard; standardizing to local Date object
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(dateStr);
    };

    // Helper to check time of day category from event time string (e.g., "10:00 PM")
    const getEventTimeCategory = (timeStr) => {
        if (!timeStr) return 'morning'; // fallback
        const lower = timeStr.toLowerCase();
        let hours = parseInt(timeStr, 10);

        if (lower.includes('pm') && hours !== 12) hours += 12;
        if (lower.includes('am') && hours === 12) hours = 0;

        if (hours >= 5 && hours < 12) return 'morning';
        if (hours >= 12 && hours < 18) return 'afternoon';
        return 'night';
    };

    useEffect(() => {
        const events = getEvents();

        let baseEvents = [];
        if (eventType === "created") {
            baseEvents = events.filter(event => event.host === pID);
            setTypeTitle("My Created");
        } else if (eventType === "joined") {
            baseEvents = events.filter(event => event.participants_id?.includes(pID));
            setTypeTitle("My Joined");
        } else {
            baseEvents = events;
            setTypeTitle("All");
        }

        // Tab filter for created/joined
        if (eventType === "created" || eventType === "joined") {
            baseEvents = baseEvents.filter(event => (isCurrentTab ? !isPastEvent(event) : isPastEvent(event)));
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
            baseEvents = baseEvents.filter(event =>
                event.description &&
                event.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Dropdown: Activity filter
        if (selectedActivity) {
            baseEvents = baseEvents.filter(event => event.tag === selectedActivity);
        }

        // Dropdown: Region filter
        if (selectedRegion) {
            baseEvents = baseEvents.filter(event => event.region === selectedRegion);
        }

        // Dropdown: Date / Time range filter
        if (selectedDateOption || selectedTimeOption) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            baseEvents = baseEvents.filter(event => {
                let matchesDate = true;
                let matchesTime = true;

                if (selectedDateOption) {
                    const eventDate = parseEventDate(event.date);
                    if (!eventDate) return false;
                    eventDate.setHours(0, 0, 0, 0);

                    const diffTime = eventDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (selectedDateOption === 'today') {
                        matchesDate = diffDays === 0;
                    } else if (selectedDateOption === 'week') {
                        matchesDate = diffDays >= 0 && diffDays <= 7;
                    } else if (selectedDateOption === 'month') {
                        matchesDate = eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear() && diffDays >= 0;
                    }
                }

                if (selectedTimeOption) {
                    const eventTimeCat = getEventTimeCategory(event.time);
                    matchesTime = eventTimeCat === selectedTimeOption;
                }

                return matchesDate && matchesTime;
            });
        }

        setFilteredEvents(baseEvents);
    }, [eventType, pID, isCurrentTab, searchQuery, selectedActivity, selectedRegion, selectedDateOption, selectedTimeOption]);

    const hasActiveFilters = selectedActivity || selectedDateOption || selectedTimeOption || selectedRegion;

    const getFilterBadgeText = () => {
        let parts = [];
        if (selectedActivity) parts.push(selectedActivity);
        if (selectedRegion) parts.push(selectedRegion);
        if (selectedDateOption) parts.push(selectedDateOption.charAt(0).toUpperCase() + selectedDateOption.slice(1));
        if (selectedTimeOption) parts.push(selectedTimeOption.charAt(0).toUpperCase() + selectedTimeOption.slice(1));
        return parts.join(", ");
    };

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        {/* Main Container, non-scrolling */}
        <main className="flex-1 min-h-0 flex flex-col w-full mx-auto max-w-md px-4 py-4 gap-y-4">
            <div className="flex flex-col gap-y-4 w-full shrink-0">
                <div className="w-full flex flex-row gap-x-4 items-center">
                    <SearchBar onSearch={handleSearch} />
                    {/* Filter Button Toggle */}
                    <div
                        className="flex flex-row gap-x-2 items-center cursor-pointer select-none"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <span className="text-sm font-semibold">Filter</span>
                        <Funnel size={30} />
                    </div>
                </div>

                {/* Collapsible Dropdown Filters Bar */}
                {isFilterOpen && (
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-2.5 rounded-xl">
                        {/* Activity Dropdown */}
                        <DropdownButton
                            value={selectedActivity}
                            onChange={setSelectedActivity}
                            placeholder="All Activities"
                            options={activities.map((item) => ({
                                label: item.title,
                                value: item.title
                            }))}
                        />

                        {/* Region Dropdown */}
                        <DropdownButton
                            value={selectedRegion}
                            onChange={setSelectedRegion}
                            placeholder="All Regions"
                            options={[
                                { label: 'Central', value: 'Central' },
                                { label: 'North-East', value: 'North-East' },
                                { label: 'North', value: 'North' },
                                { label: 'South', value: 'South' },
                                { label: 'East', value: 'East' },
                                { label: 'West', value: 'West' }
                            ]}
                        />

                        {/* Date Dropdown */}
                        <DropdownButton
                            value={selectedDateOption}
                            onChange={setSelectedDateOption}
                            placeholder="All Dates"
                            options={[
                                { label: 'Today', value: 'today' },
                                { label: 'This Week', value: 'week' },
                                { label: 'This Month', value: 'month' }
                            ]}
                        />

                        {/* Time Dropdown */}
                        <DropdownButton
                            value={selectedTimeOption}
                            onChange={setSelectedTimeOption}
                            placeholder="All Times"
                            options={[
                                { label: 'Morning (5AM - 12PM)', value: 'morning' },
                                { label: 'Afternoon (12PM - 6PM)', value: 'afternoon' },
                                { label: 'Night (6PM - 5AM)', value: 'night' }
                            ]}
                        />
                    </div>
                )}

                {/* Clear Filters Option */}
                {hasActiveFilters && (
                    <div className="flex flex-row items-center justify-between rounded-xl text-sm">
                        <span>
                            Filtered by:{" "}
                            <strong>{getFilterBadgeText()}</strong>
                        </span>
                        <button
                            onClick={resetFilters}
                            className="text-blue-600 font-bold underline text-md px-2 py-1"
                        >
                            Clear Filter
                        </button>
                    </div>
                )}

                <h1 className="text-left font-bold text-xl w-full">{typeTitle} Events</h1>

                {(eventType === "created" || eventType === "joined") && (
                    <div className="text-left flex flex-row gap-x-4 w-full">
                        <ActionButton title="Current" className="self-center" onClick={() => handleOptionClick(true)} />
                        <ActionButton title="Past" className="self-center" onClick={() => handleOptionClick(false)} />
                    </div>
                )}
            </div>

            {/* Scrollable Section */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-y-4 pr-1">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <p className="text-gray-500">No events found for this category.</p>
                )}
            </div>
        </main>

        <NavBar></NavBar>
    </div>;
}
export default EventsB;