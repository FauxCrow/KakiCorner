import AccessibilityBar from '../components/AccessibilityBar';
import ActionButton from '../components/ActionButton';
import StepIndicator from '../components/StepIndicator';
import OptionCard from '../components/OptionCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from "react";
import { getEventById, getCurrentUserId, addFeedback, hasGivenFeedback } from "../utils/db";
// import { formatDate } from "../utils/date";
import { formatDate, isPastEvent } from "../utils/date";
import { useToast } from "../hooks/Toast";

const TOTAL_STEPS = 4;

const STEP_TITLES = [
    "How was this event?",
    "What did you like about this event?",
    "Would you join this event again?",
    "Any other feedback?"
];

// Saved as the number (1 to 4) so it's easy to average later
const RATINGS = [
    { value: 1, emoji: "😞", label: "Bad" },
    { value: 2, emoji: "😐", label: "Okay" },
    { value: 3, emoji: "🙂", label: "Good" },
    { value: 4, emoji: "😄", label: "Great" }
];

const LIKED_OPTIONS = [
    "Meeting and chatting with others",
    "Learning or trying something new",
    "The friendly atmosphere",
    "The activity itself"
];

const JOIN_AGAIN_OPTIONS = ["Yes", "Maybe", "No"];

function Feedback() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showToast } = useToast();

    const event = getEventById(id);
    const pID = getCurrentUserId();

    // Checked once when the page opens, so submitting doesn't flash the "already given" message
    const [alreadyGiven] = useState(() => hasGivenFeedback(id, pID));

    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(null);
    const [liked, setLiked] = useState(null);
    const [joinAgain, setJoinAgain] = useState(null);
    const [comment, setComment] = useState("");

    // Picking an answer saves it and moves on; going Back shows it still highlighted
    const handlePick = (setAnswer, value) => {
        setAnswer(value);
        setStep(step + 1);
    };

    const handleBackClick = () => {
        if (step === 1) {
            navigate(-1);
        } else {
            setStep(step - 1);
        }
    };

    const handleSubmitClick = () => {
        addFeedback({
            event_id: event.id,
            user_id: pID,
            rating: rating,
            liked: liked,
            join_again: joinAgain,
            comment: comment.trim()
        });

        showToast("Feedback submitted.");
        navigate(-1);
    };

    // Same rule as the Leave Feedback button: only people who joined, after the event is over
    const getBlockedMessage = () => {
        if (!event) return "This event no longer exists.";
        if (!event.participants_id.includes(Number(pID))) return "Only people who joined this event can give feedback.";
        if (!isPastEvent(event)) return "Feedback opens after the event has ended.";
        if (alreadyGiven) return "You have already given feedback for this event.";
        return "";
    };

    const blockedMessage = getBlockedMessage();

    // e.g. the event was deleted, or this page was opened again after submitting
    // if (!event || alreadyGiven) {
    if (blockedMessage) {
        return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
            <AccessibilityBar></AccessibilityBar>

            <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
                <ActionButton title="Back" className="w-fit text-left" onClick={() => navigate(-1)} />
                {/* <p className="text-gray-500">{event ? "You have already given feedback for this event." : "This event no longer exists."}</p> */}
                <p className="text-gray-500">{blockedMessage}</p>
            </main>
        </div>;
    }

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <AccessibilityBar></AccessibilityBar>

        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-6 w-full mx-auto max-w-md">
            <ActionButton title="Back" className="self-start px-6 py-2" onClick={handleBackClick} />

            <StepIndicator current={step} total={TOTAL_STEPS} />

            <div className="flex flex-col gap-y-1 text-center">
                <h1 className="text-xl">{STEP_TITLES[step - 1]}</h1>
                <p className="text-sm text-gray-500">{event.tag} · {formatDate(event.date)}</p>
            </div>

            {/* Step 1: Rating */}
            {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                    {RATINGS.map((item) => (
                        <OptionCard
                            key={item.value}
                            title={
                                <span className="flex flex-col items-center gap-y-2">
                                    <span className="text-4xl">{item.emoji}</span>
                                    {item.label}
                                </span>
                            }
                            className="min-h-[120px]"
                            isSelected={rating === item.value}
                            onClick={() => handlePick(setRating, item.value)}
                        />
                    ))}
                </div>
            )}

            {/* Step 2: What they liked */}
            {step === 2 && (
                <div className="grid grid-cols-2 gap-4">
                    {LIKED_OPTIONS.map((item) => (
                        <OptionCard
                            key={item}
                            title={item}
                            className="min-h-[100px]"
                            isSelected={liked === item}
                            onClick={() => handlePick(setLiked, item)}
                        />
                    ))}
                </div>
            )}

            {/* Step 3: Join again */}
            {step === 3 && (
                <div className="grid grid-cols-3 gap-4">
                    {JOIN_AGAIN_OPTIONS.map((item) => (
                        <OptionCard
                            key={item}
                            title={item}
                            className="min-h-[90px]"
                            isSelected={joinAgain === item}
                            onClick={() => handlePick(setJoinAgain, item)}
                        />
                    ))}
                </div>
            )}

            {/* Step 4: Comments (optional) */}
            {step === 4 && (
                <>
                    <textarea
                        rows="6"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Type here (optional)"
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-sm placeholder:text-gray-400 resize-none focus:outline-none"
                    ></textarea>

                    <ActionButton title="Submit" className="self-center" onClick={handleSubmitClick} />
                </>
            )}
        </main>
    </div>;
}
export default Feedback;
