import AccessibilityBar from '../components/AccessibilityBar';
import ActionButton from '../components/ActionButton';
import StepIndicator from '../components/StepIndicator';
import ActivityCard from '../components/ActivityCard';
import OptionCard from '../components/OptionCard';
import StepperInput from '../components/StepperInput';
import EventOverviewCard from '../components/EventOverviewCard';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import activityData from "../content/activities.json";
import eventData from "../content/events.json";

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

const PICKUP_LOCATIONS = ["Hougang MRT Gantry", "Blk ABC", "Hougang Bus Interchange"];

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

function CreateEvent() {
    const navigate = useNavigate();
    const activities = activityData.activities || [];

    const pID = localStorage.getItem("profile_id");
    const [step, setStep] = useState(1);

    const [activity, setActivity] = useState(null);
    const [description, setDescription] = useState("");

    const [day, setDay] = useState("01");
    const [month, setMonth] = useState("October");
    const [year, setYear] = useState("2026");
    const [hour, setHour] = useState("11");
    const [minute, setMinute] = useState("45");
    const [period, setPeriod] = useState("PM");

    const [location, setLocation] = useState("");
    const [pickup, setPickup] = useState(null);

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

    const handleActivityClick = (title) => {
        setActivity(title);
        setStep(2);
    };

    const handleMonthShift = (delta) => {
        const index = MONTHS.findIndex((m) => m.toLowerCase() === month.trim().toLowerCase());
        const nextIndex = index === -1 ? 0 : (index + delta + MONTHS.length) % MONTHS.length;
        setMonth(MONTHS[nextIndex]);
    };

    const handleCompleteClick = () => {
        const existingEvents = JSON.parse(localStorage.getItem("events")) || eventData.events;
        const newId = existingEvents.length > 0 ? Math.max(...existingEvents.map(e => e.id)) + 1 : 1;

        const monthMap = {
            "January": "01", "February": "02", "March": "03", "April": "04",
            "May": "05", "June": "06", "July": "07", "August": "08",
            "September": "09", "October": "10", "November": "11", "December": "12"
        };

        const monthNum = monthMap[month] || "01";
        const dateStr = `${day}/${monthNum}/${year}`;

        const newEvent = {
            id: newId,
            host: Number(pID),
            title: activity || "Untitled Event",
            tag: activity || "General",
            img: "https://",
            description: description,
            date: dateStr,
            time: `${hour}:${minute} ${period}`,
            location: location || "TBD",
            pickup: pickup || "TBD",
            max_slots: Number(participants),
            participants_id: [],
            pending_id: []
        };

        const updatedEvents = [...existingEvents, newEvent];
        localStorage.setItem("events", JSON.stringify(updatedEvents));

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
                            key={item.id}
                            title={item.title}
                            img={item.img}
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

                    <ActionButton title="Next" className="self-center" onClick={handleNextClick} />
                </>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
                <>
                    <div className="grid grid-cols-4 gap-3">
                        <StepperInput
                            value={day}
                            onChange={(value) => setDay(digitsOnly(value, 2))}
                            onIncrement={() => setDay(pad(wrapNumber(day, 1, 1, 31)))}
                            onDecrement={() => setDay(pad(wrapNumber(day, -1, 1, 31)))}
                        />
                        <StepperInput
                            className="col-span-2"
                            inputMode="text"
                            value={month}
                            onChange={setMonth}
                            onIncrement={() => handleMonthShift(1)}
                            onDecrement={() => handleMonthShift(-1)}
                        />
                        <StepperInput
                            value={year}
                            onChange={(value) => setYear(digitsOnly(value, 4))}
                            onIncrement={() => setYear(String(clampNumber(year, 1, 2026, 2099)))}
                            onDecrement={() => setYear(String(clampNumber(year, -1, 2026, 2099)))}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <StepperInput
                            value={hour}
                            onChange={(value) => setHour(digitsOnly(value, 2))}
                            onIncrement={() => setHour(pad(wrapNumber(hour, 1, 1, 12)))}
                            onDecrement={() => setHour(pad(wrapNumber(hour, -1, 1, 12)))}
                        />
                        <StepperInput
                            value={minute}
                            onChange={(value) => setMinute(digitsOnly(value, 2))}
                            onIncrement={() => setMinute(pad(wrapNumber(minute, 1, 0, 59)))}
                            onDecrement={() => setMinute(pad(wrapNumber(minute, -1, 0, 59)))}
                        />
                        <StepperInput
                            readOnly
                            value={period}
                            showIncrement={period === "AM"}
                            showDecrement={period === "PM"}
                            onIncrement={() => setPeriod("PM")}
                            onDecrement={() => setPeriod("AM")}
                        />
                    </div>

                    <ActionButton title="Next" className="self-center" onClick={handleNextClick} />
                </>
            )}

            {/* Step 4: Location & Pickup */}
            {step === 4 && (
                <>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location..."
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none"
                    />

                    <h2 className="text-left text-base">Pickup Location:</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {PICKUP_LOCATIONS.map((item) => (
                            <OptionCard
                                key={item}
                                title={item}
                                isSelected={pickup === item}
                                onClick={() => setPickup(item)}
                            />
                        ))}
                    </div>

                    <EventOverviewCard details={["Board Games on 01 October 2026 at 11:45PM."]} />

                    <ActionButton title="Next" className="self-center" onClick={handleNextClick} />
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
