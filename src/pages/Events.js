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
import { Funnel, UserGroup, CalendarClock, MapPinned, Dices, Dumbbell, Palette, Music, Puzzle, CakeSlice, CookingPot, Sprout } from 'lucide-react';
import FilterButton from "../components/FilterButton";
import activityData from "../content/activities.json";
import AccessibilityButton from '../components/AccessibilityButton';

function Events() {
    const { type } = useParams();
    const eventType = type || "all";

    const activities = activityData.activities || [];

    // const pID = Number(localStorage.getItem("profile_id"));
    const pID = getCurrentUserId();

    const [filteredEvents, setFilteredEvents] = useState([]);
    const [typeTitle, setTypeTitle] = useState();

    const [isCurrentTab, setIsCurrentTab] = useState(true);

    // could probably optimise this to use utils but this is the least of our problems GUDWHGYDUW
    const iconMap = {
        Dices: Dices,
        Dumbbell: Dumbbell,
        Palette: Palette,
        Music: Music,
        Puzzle: Puzzle,
        CakeSlice: CakeSlice,
        CookingPot: CookingPot,
        Sprout: Sprout
    };

    const handleOptionClick = (isCurrent) => {
        setIsCurrentTab(isCurrent);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilterCategory, setActiveFilterCategory] = useState(null);
    const [selectedFilterValue, setSelectedFilterValue] = useState(null);
    const [selectedDateOption, setSelectedDateOption] = useState(null);
    const [selectedTimeOption, setSelectedTimeOption] = useState(null);

    const resetFilters = () => {
        setSelectedFilterValue(null);
        setSelectedDateOption(null);
        setSelectedTimeOption(null);
        setActiveFilterCategory(null);
        setIsFilterOpen(false);
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
        // const events = JSON.parse(localStorage.getItem("events")) || eventData.events;
        const events = getEvents();
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);

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

        // Active filter selection
        if (selectedFilterValue) {
            if (activeFilterCategory === 'activity') {
                baseEvents = baseEvents.filter(event => event.tag === selectedFilterValue);
            } else if (activeFilterCategory === 'date') {
                baseEvents = baseEvents.filter(event => event.date === selectedFilterValue);
            } else if (activeFilterCategory === 'location') {
                baseEvents = baseEvents.filter(event => event.region === selectedFilterValue);
            }
        }

        // Date and / or Time range filter
        if (activeFilterCategory === 'date' && (selectedDateOption || selectedTimeOption)) {
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
    }, [eventType, pID, isCurrentTab, searchQuery, selectedFilterValue, activeFilterCategory, selectedDateOption, selectedTimeOption]);

    const getFilterBadgeText = () => {
        if (selectedFilterValue) return selectedFilterValue;
        if (selectedDateOption && selectedTimeOption) {
            return `${selectedDateOption.charAt(0).toUpperCase() + selectedDateOption.slice(1)}, ${selectedTimeOption.charAt(0).toUpperCase() + selectedTimeOption.slice(1)}`;
        }
        if (selectedDateOption) {
            return `${selectedDateOption.charAt(0).toUpperCase() + selectedDateOption.slice(1)}`;
        }
        if (selectedTimeOption) {
            return `${selectedTimeOption.charAt(0).toUpperCase() + selectedTimeOption.slice(1)}`;
        }
        return "";
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
            <AccessibilityBar />

            {/* Main Container, non-scrolling*/}
            <main className="flex-1 min-h-0 flex flex-col w-full mx-auto max-w-md px-4 py-4 gap-y-4">
                <div className="flex flex-col gap-y-4 w-full shrink-0">
                    <div className="w-full flex flex-row gap-x-4 items-center">
                        <SearchBar onSearch={handleSearch} />
                        <div
                            className="flex flex-row gap-x-2 items-center cursor-pointer select-none"
                            onClick={() => { setIsFilterOpen(!isFilterOpen); setActiveFilterCategory(null); }}
                        >
                            <span className="text-sm font-semibold">Filter</span>
                            <Funnel size={30} />
                        </div>
                    </div>

                    {(selectedFilterValue || selectedDateOption || selectedTimeOption) && !isFilterOpen && (
                        <div className="flex flex-row items-center justify-between border border-black p-3 rounded-xl text-sm">
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

                    {!isFilterOpen && (
                        <>
                            <h1 className="text-left font-bold text-xl w-full">{typeTitle} Events</h1>

                            {(eventType === "created" || eventType === "joined") && (
                                <div className="text-left flex flex-row gap-x-4 w-full">
                                    <ActionButton title="Current" className="self-center" onClick={() => handleOptionClick(true)} />
                                    <ActionButton title="Past" className="self-center" onClick={() => handleOptionClick(false)} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-y-4 pr-1">
                    {isFilterOpen ? (
                        <>
                            {!activeFilterCategory && (
                                <>
                                    <ActionButton title="Back" className="w-fit text-left" onClick={() => setIsFilterOpen(!isFilterOpen)} />
                                    <div className="flex flex-col gap-y-4 max-w-xs mx-auto items-center w-full">
                                        <h2 className="font-bold text-lg mb-1">Choose Filter Type</h2>
                                        <FilterButton icon={UserGroup} title='Sort By Activity' iconSize={40} onClick={() => setActiveFilterCategory('activity')} />
                                        <FilterButton icon={CalendarClock} title='Sort By Date / Time' iconSize={40} onClick={() => setActiveFilterCategory('date')} />
                                        <FilterButton icon={MapPinned} title='Sort By Location' iconSize={40} onClick={() => setActiveFilterCategory('location')} />
                                    </div>
                                </>
                            )}

                            {/* Choose Specific Activity / Tag */}
                            {activeFilterCategory === 'activity' && (
                                <>
                                    <ActionButton title="Back" className="w-fit text-left" onClick={() => setActiveFilterCategory(null)} />
                                    <div className="flex flex-col gap-y-3 max-w-xs mx-auto w-full">
                                        <h2 className="font-bold text-lg mb-1 text-center">Select Activity</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {activities.map((item) => {
                                                const IconComponent = iconMap[item.icon];
                                                return (
                                                    <AccessibilityButton
                                                        key={item.title}
                                                        title={item.title}
                                                        icon={IconComponent}
                                                        iconSize={24}
                                                        onClick={() => { setSelectedFilterValue(item.title); setIsFilterOpen(false); }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Choose Specific Date / Time */}
                            {activeFilterCategory === 'date' && (
                                <>
                                    <ActionButton title="Back" className="w-fit text-left" onClick={() => setActiveFilterCategory(null)} />
                                    <div className="flex flex-col gap-y-4 max-w-xs mx-auto w-full">
                                        <h2 className="font-bold text-lg text-center">Select Date Range (Optional)</h2>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { label: 'Today', val: 'today' },
                                                { label: 'This Week', val: 'week' },
                                                { label: 'This Month', val: 'month' }
                                            ].map((d) => (
                                                <button
                                                    key={d.val}
                                                    onClick={() => setSelectedDateOption(selectedDateOption === d.val ? null : d.val)}
                                                    className={`p-3 rounded-2xl text-base shadow transition ${
                                                        selectedDateOption === d.val 
                                                            ? 'bg-gray-600 text-white font-bold' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {d.label} {selectedDateOption === d.val && '✓'}
                                                </button>
                                            ))}
                                        </div>

                                        <h2 className="font-bold text-lg text-center mt-2">Select Time of Day (Optional)</h2>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { label: 'Morning (5AM - 12PM)', val: 'morning' },
                                                { label: 'Afternoon (12PM - 6PM)', val: 'afternoon' },
                                                { label: 'Night (6PM - 5AM)', val: 'night' }
                                            ].map((t) => (
                                                <button
                                                    key={t.val}
                                                    onClick={() => setSelectedTimeOption(selectedTimeOption === t.val ? null : t.val)}
                                                    className={`p-3 rounded-2xl text-base shadow transition ${
                                                        selectedTimeOption === t.val 
                                                            ? 'bg-gray-600 text-white font-bold' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {t.label} {selectedTimeOption === t.val && '✓'}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            disabled={!selectedDateOption && !selectedTimeOption}
                                            onClick={() => setIsFilterOpen(false)}
                                            className={`mt-4 p-4 rounded-2xl font-bold text-lg shadow transition ${
                                                selectedDateOption || selectedTimeOption 
                                                    ? 'bg-gray-600 text-white cursor-pointer hover:bg-gray-700' 
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {selectedDateOption || selectedTimeOption ? 'Apply Filter' : 'Select a Date or Time'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Choose Specific Location */}
                            {activeFilterCategory === 'location' && (
                                <>
                                    <ActionButton title="Back" className="w-fit text-left" onClick={() => setActiveFilterCategory(null)} />
                                    <div className="flex flex-col gap-y-3 max-w-xs mx-auto w-full">
                                        <h2 className="font-bold text-lg mb-1 text-center">Select Region</h2>

                                        <div className="grid grid-cols-2 gap-3">
                                            {["Central", "North-East", "North", "South", "East", "West"].map((region) => (
                                                <button
                                                    key={region}
                                                    onClick={() => {
                                                        setSelectedFilterValue(region);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className="p-4 bg-gray-100 rounded-2xl font-bold text-base shadow text-center transition flex items-center justify-center min-h-[60px] hover:scale-105 transition"
                                                >
                                                    {region}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <p className="text-gray-500">No events found for this category.</p>
                        )
                    )}
                </div>
            </main>

            <NavBar />
        </div>
    );
}

export default Events;