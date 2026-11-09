import AccessibilityBar from '../components/AccessibilityBar';
import ActionButton from '../components/ActionButton';
import StepIndicator from '../components/StepIndicator';
import ActivityCard from '../components/ActivityCard';
import OptionCard from '../components/OptionCard';
import StepperInput from '../components/StepperInput';
import EventOverviewCard from '../components/EventOverviewCard';
import { useNavigate } from 'react-router-dom';
// import { useState } from "react";
import { useState, useEffect } from "react";
import SuggestionList from '../components/SuggestionList';
import { DEFAULT_PICKUPS, searchAddress, getPickupOptions } from "../utils/location";
import activityData from "../content/activities.json";
// import eventData from "../content/events.json";
// import { addEvent, getCurrentUserId } from "../utils/db";
import { addEvent, getCurrentUserId, getEvents } from "../utils/db";
import { toDateTime } from "../utils/date";

const TOTAL_STEPS = 5;

const STEP_TITLES = [
    "What is your event?",
    "Describe the Activity",
    "When is the event?",
    "Where will it be hosted?",
    "How many participants?"
];

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// const PICKUP_LOCATIONS = ["Hougang MRT Gantry", "Blk ABC", "Hougang Bus Interchange"];

// Helpers for the +/- inputs
const pad = (number) => String(number).padStart(2, "0");

const digitsOnly = (value, maxLength) => value.replace(/\D/g, "").slice(0, maxLength);

const wrapNumber = (value, delta, min, max) => {
    const current = parseInt(value, 10);
    if (isNaN(current)) return min;
    const range = max - min + 1;
    return ((((current - min + delta) % range) + range) % range) + min;
};

const clampNumber = (value, delta, min, max) => {
    const current = parseInt(value, 10);
    if (isNaN(current)) return min;
    return Math.min(Math.max(current + delta, min), max);
};

const findMonthIndex = (monthName) => MONTHS.findIndex((m) => m.toLowerCase() === monthName.trim().toLowerCase());

const daysInMonth = (monthIndex, year) => (monthIndex === -1 ? 31 : new Date(Number(year), monthIndex + 1, 0).getDate());

// Default start: the next full hour from now
const getDefaultStart = () => {
    const start = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    return start;
};

function CreateEvent() {
    const navigate = useNavigate();
    // const activities = activityData.activities || [];
    const activities = [...(activityData.activities || []), activityData.others];

    // const pID = localStorage.getItem("profile_id");
    const pID = getCurrentUserId();
    const [step, setStep] = useState(1);

    const [activity, setActivity] = useState(null);
    const [description, setDescription] = useState("");

    // const [day, setDay] = useState("01");
    // const [month, setMonth] = useState("October");
    // const [year, setYear] = useState("2026");
    // const [hour, setHour] = useState("11");
    // const [minute, setMinute] = useState("45");
    // const [period, setPeriod] = useState("PM");
    const [defaultStart] = useState(getDefaultStart);
    const [day, setDay] = useState(pad(defaultStart.getDate()));
    const [month, setMonth] = useState(MONTHS[defaultStart.getMonth()]);
    const [year, setYear] = useState(String(defaultStart.getFullYear()));
    const [hour, setHour] = useState(pad(defaultStart.getHours() % 12 || 12));
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState(defaultStart.getHours() >= 12 ? "PM" : "AM");

    const [location, setLocation] = useState("");
    const [pickup, setPickup] = useState(null);
    const [pickupOptions, setPickupOptions] = useState(DEFAULT_PICKUPS);

    // searchText only changes when the user types, so picking a suggestion doesn't search again
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const [participants, setParticipants] = useState("10");

    const handleBackClick = () => {
        if (step === 1) {
            navigate(-1);
        } else {
            setStep(step - 1);
        }
    };

    const handleNextClick = () => {
        setStep(step + 1);
    };

    // const handleActivityClick = (title) => {
    //     setActivity(title);
    //     setStep(2);
    // };
    const handleActivityClick = (title) => {
        if (title !== activity) {
            prefillFromLastEvent(title);
        }
        setActivity(title);
        setStep(2);
    };

    // Fill steps 2-5 from this user's latest event of the same type; the date always resets to today
    const prefillFromLastEvent = (title) => {
        const lastEvent = getEvents()
            .filter((event) => event.host === Number(pID) && event.tag === title)
            .sort((a, b) => b.id - a.id)[0];

        setDay(pad(defaultStart.getDate()));
        setMonth(MONTHS[defaultStart.getMonth()]);
        setYear(String(defaultStart.getFullYear()));

        setDescription(lastEvent?.description || "");
        setLocation(lastEvent?.location || "");
        // setPickup(lastEvent?.pickup || null);
        setPickupOptions(lastEvent?.pickup_options || DEFAULT_PICKUPS);
        setPickup(lastEvent?.pickup_options ? lastEvent.pickup : null);
        setSearchText("");
        setSuggestions([]);
        setParticipants(String(lastEvent?.max_slots || 10));

        if (lastEvent?.time) {
            const [clock, lastPeriod] = lastEvent.time.split(" ");
            const [lastHour, lastMinute] = clock.split(":");
            setHour(pad(lastHour));
            setMinute(pad(lastMinute));
            setPeriod(lastPeriod || "PM");
        } else {
            setHour(pad(defaultStart.getHours() % 12 || 12));
            setMinute("00");
            setPeriod(defaultStart.getHours() >= 12 ? "PM" : "AM");
        }
    };

    // const handleMonthShift = (delta) => {
    //     const index = MONTHS.findIndex((m) => m.toLowerCase() === month.trim().toLowerCase());
    //     const nextIndex = index === -1 ? 0 : (index + delta + MONTHS.length) % MONTHS.length;
    //     setMonth(MONTHS[nextIndex]);
    // };
    const handleMonthShift = (delta) => {
        const next = shiftMonth(delta);
        setMonth(next.month);
        setDay(next.day);
    };

    // ---------- Location search ----------

    // Ask OneMap for suggestions once the user pauses typing (it blocks us if we ask too often)
    useEffect(() => {
        if (searchText.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        let isLatest = true;
        const timer = setTimeout(async () => {
            const results = await searchAddress(searchText.trim());
            if (isLatest) setSuggestions(results);
        }, 600);

        return () => {
            isLatest = false;
            clearTimeout(timer);
        };
    }, [searchText]);

    const handleLocationChange = (value) => {
        setLocation(value);
        setSearchText(value);

        // Typing again means the earlier address's pickup choices no longer apply
        if (pickupOptions !== DEFAULT_PICKUPS) {
            setPickupOptions(DEFAULT_PICKUPS);
            setPickup(null);
        }
    };

    const handleSuggestionClick = (place) => {
        setLocation(place.address);
        setSearchText("");
        setSuggestions([]);
        setPickupOptions(getPickupOptions(place));
        setPickup(null);
    };

    // ---------- Date & time checks ----------

    // Next month, plus the day pulled back if the new month is shorter (31 Jan -> 28 Feb)
    const shiftMonth = (delta) => {
        const index = findMonthIndex(month);
        const nextIndex = index === -1 ? 0 : (index + delta + MONTHS.length) % MONTHS.length;
        const maxDay = daysInMonth(nextIndex, year);
        return { month: MONTHS[nextIndex], day: Number(day) > maxDay ? pad(maxDay) : day };
    };

    const nextDay = (delta) => pad(wrapNumber(day, delta, 1, daysInMonth(findMonthIndex(month), year)));
    const nextYear = (delta) => String(clampNumber(year, delta, new Date().getFullYear(), 2099));
    const nextHour = (delta) => pad(wrapNumber(hour, delta, 1, 12));
    const nextMinute = (delta) => pad(wrapNumber(minute, delta, 0, 59));

    // Turns the boxes into a real Date, with any changed values swapped in; null if it isn't a real date
    const buildDateTime = (changes = {}) => {
        const values = { day, month, year, hour, minute, period, ...changes };
        const monthIndex = findMonthIndex(values.month);
        const dayNum = Number(values.day);
        const hourNum = Number(values.hour);
        const minuteNum = Number(values.minute);

        if (monthIndex === -1 || !dayNum || values.year.length !== 4 || hourNum < 1 || hourNum > 12 || values.minute === "" || minuteNum > 59) {
            return null;
        }

        const result = toDateTime(`${dayNum}/${monthIndex + 1}/${values.year}`, `${hourNum}:${minuteNum} ${values.period}`);

        // e.g. 31 February rolls over into March, so the day number changes
        return result.getDate() === dayNum ? result : null;
    };

    // Used to disable a +/- button when pressing it would land in the past
    const wouldBePast = (changes) => {
        const result = buildDateTime(changes);
        return !result || result < new Date();
    };

    const getDateError = () => {
        const result = buildDateTime();
        if (!result) return "Please enter a valid date and time.";
        if (result < new Date()) return "Cannot choose a date or time that has already passed.";
        return "";
    };

    const dateError = getDateError();

    const handleCompleteClick = () => {
        // const existingEvents = JSON.parse(localStorage.getItem("events")) || eventData.events;
        // const newId = existingEvents.length > 0 ? Math.max(...existingEvents.map(e => e.id)) + 1 : 1;

        // const monthMap = {
        //     "January": "01", "February": "02", "March": "03", "April": "04",
        //     "May": "05", "June": "06", "July": "07", "August": "08",
        //     "September": "09", "October": "10", "November": "11", "December": "12"
        // };

        // const monthNum = monthMap[month] || "01";
        // const dateStr = `${day}/${monthNum}/${year}`;
        const monthNum = pad(findMonthIndex(month) + 1);
        const dateStr = `${pad(day)}/${monthNum}/${year}`;

        // id is now given by addEvent()
        const newEvent = {
            // id: newId,
            host: Number(pID),
            title: activity || "Untitled Event",
            tag: activity || "General",
            img: "https://",
            description: description,
            date: dateStr,
            time: `${hour}:${minute} ${period}`,
            location: location || "TBD",
            pickup: pickup || "TBD",
            pickup_options: pickupOptions,
            max_slots: Number(participants),
            participants_id: [],
            pending_id: []
        };

        // const updatedEvents = [...existingEvents, newEvent];
        // localStorage.setItem("events", JSON.stringify(updatedEvents));
        addEvent(newEvent);

        navigate("/events/created");
    };

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-6 w-full mx-auto max-w-md">
            <ActionButton title="Back" className="self-start px-6 py-2" onClick={handleBackClick} />

            <StepIndicator current={step} total={TOTAL_STEPS} />

            <h1 className="text-center text-xl">{STEP_TITLES[step - 1]}</h1>

            {/* Step 1: Activity */}
            {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                    {activities.map((item) => (
                        <ActivityCard
                            // key={item.id}
                            // img={item.img}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            color={item.color}
                            isSelected={activity === item.title}
                            onClick={() => handleActivityClick(item.title)}
                        />
                    ))}
                </div>
            )}

            {/* Step 2: Description */}
            {step === 2 && (
                <>
                    <textarea
                        rows="8"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="We will..."
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-sm placeholder:text-gray-400 resize-none focus:outline-none"
                    ></textarea>

                    {!description.trim() && (
                        <p className="text-center text-sm text-gray-500">Please describe the activity to continue.</p>
                    )}

                    {/* <ActionButton title="Next" className="self-center" onClick={handleNextClick} /> */}
                    <ActionButton title="Next" className="self-center" disabled={!description.trim()} onClick={handleNextClick} />
                </>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
                <>
                    {/* Each +/- is disabled when pressing it would land in the past */}
                    <div className="grid grid-cols-4 gap-3">
                        <StepperInput
                            value={day}
                            onChange={(value) => setDay(digitsOnly(value, 2))}
                            // onIncrement={() => setDay(pad(wrapNumber(day, 1, 1, 31)))}
                            // onDecrement={() => setDay(pad(wrapNumber(day, -1, 1, 31)))}
                            onIncrement={() => setDay(nextDay(1))}
                            onDecrement={() => setDay(nextDay(-1))}
                            incrementDisabled={wouldBePast({ day: nextDay(1) })}
                            decrementDisabled={wouldBePast({ day: nextDay(-1) })}
                        />
                        <StepperInput
                            className="col-span-2"
                            inputMode="text"
                            value={month}
                            onChange={setMonth}
                            onIncrement={() => handleMonthShift(1)}
                            onDecrement={() => handleMonthShift(-1)}
                            incrementDisabled={wouldBePast(shiftMonth(1))}
                            decrementDisabled={wouldBePast(shiftMonth(-1))}
                        />
                        <StepperInput
                            value={year}
                            onChange={(value) => setYear(digitsOnly(value, 4))}
                            // onIncrement={() => setYear(String(clampNumber(year, 1, 2026, 2099)))}
                            // onDecrement={() => setYear(String(clampNumber(year, -1, 2026, 2099)))}
                            onIncrement={() => setYear(nextYear(1))}
                            onDecrement={() => setYear(nextYear(-1))}
                            incrementDisabled={nextYear(1) === year || wouldBePast({ year: nextYear(1) })}
                            decrementDisabled={nextYear(-1) === year || wouldBePast({ year: nextYear(-1) })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <StepperInput
                            value={hour}
                            onChange={(value) => setHour(digitsOnly(value, 2))}
                            // onIncrement={() => setHour(pad(wrapNumber(hour, 1, 1, 12)))}
                            // onDecrement={() => setHour(pad(wrapNumber(hour, -1, 1, 12)))}
                            onIncrement={() => setHour(nextHour(1))}
                            onDecrement={() => setHour(nextHour(-1))}
                            incrementDisabled={wouldBePast({ hour: nextHour(1) })}
                            decrementDisabled={wouldBePast({ hour: nextHour(-1) })}
                        />
                        <StepperInput
                            value={minute}
                            onChange={(value) => setMinute(digitsOnly(value, 2))}
                            // onIncrement={() => setMinute(pad(wrapNumber(minute, 1, 0, 59)))}
                            // onDecrement={() => setMinute(pad(wrapNumber(minute, -1, 0, 59)))}
                            onIncrement={() => setMinute(nextMinute(1))}
                            onDecrement={() => setMinute(nextMinute(-1))}
                            incrementDisabled={wouldBePast({ minute: nextMinute(1) })}
                            decrementDisabled={wouldBePast({ minute: nextMinute(-1) })}
                        />
                        <StepperInput
                            readOnly
                            value={period}
                            showIncrement={period === "AM"}
                            showDecrement={period === "PM"}
                            onIncrement={() => setPeriod("PM")}
                            onDecrement={() => setPeriod("AM")}
                            incrementDisabled={wouldBePast({ period: "PM" })}
                            decrementDisabled={wouldBePast({ period: "AM" })}
                        />
                    </div>

                    {dateError && (
                        <p className="text-center text-sm text-red-600">{dateError}</p>
                    )}

                    {/* <ActionButton title="Next" className="self-center" onClick={handleNextClick} /> */}
                    <ActionButton title="Next" className="self-center" disabled={!!dateError} onClick={handleNextClick} />
                </>
            )}

            {/* Step 4: Location & Pickup */}
            {step === 4 && (
                <>
                    {/* <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location..."
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none"
                    /> */}
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        placeholder="Type an address or postal code"
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none"
                    />

                    <SuggestionList suggestions={suggestions} onSelect={handleSuggestionClick} />

                    <h2 className="text-left text-base">Pickup Location:</h2>

                    {/* Pickup cards only appear once an address has been entered */}
                    {location.trim() ? (
                        <>
                            <p className="text-left text-sm text-gray-500 -mt-4">Further details will be announced in the group chat.</p>

                            <div className="grid grid-cols-2 gap-4">
                                {/* {PICKUP_LOCATIONS.map((item) => ( */}
                                {pickupOptions.map((item) => (
                                    <OptionCard
                                        key={item}
                                        title={item}
                                        isSelected={pickup === item}
                                        onClick={() => setPickup(item)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-left text-sm text-gray-500 -mt-4">Please add an address to select a pickup point.</p>
                    )}

                    <EventOverviewCard details={["Board Games on 01 October 2026 at 11:45PM."]} />

                    {!location.trim() && (
                        <p className="text-center text-sm text-gray-500">Please enter a location to continue.</p>
                    )}

                    {/* <ActionButton title="Next" className="self-center" onClick={handleNextClick} /> */}
                    <ActionButton title="Next" className="self-center" disabled={!location.trim()} onClick={handleNextClick} />
                </>
            )}

            {/* Step 5: Participants & Overview */}
            {step === 5 && (
                <>
                    <StepperInput
                        orientation="horizontal"
                        className="w-60 mx-auto"
                        value={participants}
                        onChange={(value) => setParticipants(digitsOnly(value, 2))}
                        onIncrement={() => setParticipants(String(clampNumber(participants, 1, 1, 50)))}
                        onDecrement={() => setParticipants(String(clampNumber(participants, -1, 1, 50)))}
                    />

                    <EventOverviewCard details={[
                        "Board Games on 01 October 2026 at 11:45PM.",
                        "Event will be held at Location.",
                        "You will meet the participants at Hougang MRT Gantry."
                    ]} />

                    <ActionButton title="Complete" className="self-center" onClick={handleCompleteClick} />
                </>
            )}
        </main>
    </div>;
}
export default CreateEvent;
