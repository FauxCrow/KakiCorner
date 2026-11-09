import ActionButton from '../components/ActionButton';
import StepIndicator from '../components/StepIndicator';
import OptionCard from '../components/OptionCard';
import CheckboxCard from '../components/CheckboxCard';
import AddButton from '../components/AddButton';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import activityData from "../content/activities.json";
import dietaryData from "../content/dietary.json";
// import profileData from "../content/profile.json";
import { addProfile, setCurrentUserId } from "../utils/db";

// Pages 1-2 are setup, pages 3-5 are the 3-step survey
const SURVEY_OFFSET = 2;
const SURVEY_STEPS = 3;

const LANGUAGES = ["English", "Chinese", "Malay", "Tamil"];

const PERSONALITIES = [
    "I like to make new friends.",
    "I prefer small, quiet groups.",
    "I enjoy trying new things.",
    "I like learning from others."
];

function NewUser() {
    const navigate = useNavigate();
    const activities = activityData.activities || [];
    const dietaryOptions = dietaryData.dietary || [];
    // const profiles = profileData.profiles || [];

    const [step, setStep] = useState(1);

    const [language, setLanguage] = useState(null);
    const [interests, setInterests] = useState([]);
    const [personality, setPersonality] = useState(null);
    const [dietary, setDietary] = useState([]);
    const [customDietary, setCustomDietary] = useState([]);

    const othersStyle = dietaryData.others || {};

    const handleBackClick = () => {
        // setStep(step - 1);
        if (step === 1) {
            navigate("/");
        } else {
            setStep(step - 1);
        }
    };

    const handleNextClick = () => {
        setStep(step + 1);
    };

    const handleLanguageClick = (item) => {
        setLanguage(item);
        handleNextClick();
    };

    const handlePersonalityClick = (item) => {
        setPersonality(item);
        handleNextClick();
    };

    const toggleItem = (list, setList, item) => {
        setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
    };

    // "Others" dietary rows: each is { id, text, isChecked } and starts ticked
    const handleAddCustomDietary = () => {
        setCustomDietary([...customDietary, { id: Date.now(), text: "", isChecked: true }]);
    };

    const updateCustomDietary = (id, changes) => {
        setCustomDietary(customDietary.map((item) => (item.id === id ? { ...item, ...changes } : item)));
    };

    const handleCompleteClick = () => {
        // const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || profiles;

        // const lastId = savedProfiles.length > 0 ? Math.max(...savedProfiles.map(p => p.id)) : 0;
        // const nextId = lastId + 1;

        // id is now given by addProfile()
        const newProfile = {
            // id: nextId,
            name: localStorage.getItem("name"),
            gender: localStorage.getItem("gender"),
            age: localStorage.getItem("age"),
            personality: personality,
            interests: interests,
            // dietery_restrictions: dietary
            dietery_restrictions: [
                ...dietary,
                ...customDietary.filter((item) => item.isChecked && item.text.trim()).map((item) => item.text.trim())
            ]
        };

        // const updatedProfiles = [...savedProfiles, newProfile];
        // localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
        // localStorage.setItem("profile_id", nextId);
        const savedProfile = addProfile(newProfile);
        setCurrentUserId(savedProfile.id);

        // navigate("/");
        navigate("/home");
    };

    useEffect(() => {
        const createProfile = async () => {
            localStorage.setItem("name", "John Doe");
            localStorage.setItem("age", 0);
            localStorage.setItem("gender", "M");
        };
        createProfile();
    }, []);

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-6 w-full mx-auto max-w-md">

            <ActionButton title="Back" className="self-start px-6 py-2" onClick={handleBackClick} />

            {/* Page 1: Language */}
            {step === 1 && (
                <div className="pt-24 flex flex-col gap-y-6">
                    <div className="flex flex-col gap-y-1 text-center">
                        <h1 className="text-xl">Welcome!</h1>
                        <h3 className="text-sm">Select Your Language</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {LANGUAGES.map((item) => (
                            <OptionCard
                                key={item}
                                title={item}
                                isSelected={language === item}
                                onClick={() => handleLanguageClick(item)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Page 2: Singpass */}
            {step === 2 && (
                <div className="pt-24 flex flex-col gap-y-6">
                    <h1 className="text-xl text-center">Connect Your Singpass</h1>

                    <OptionCard title="temp singpass button" className="min-h-[200px]" onClick={handleNextClick} />
                </div>
            )}

            {/* Pages 3-5: Survey header */}
            {step > SURVEY_OFFSET && (
                <>
                    {/* <ActionButton title="Back" className="self-start px-6 py-2" onClick={handleBackClick} /> */}
                    <StepIndicator current={step - SURVEY_OFFSET} total={SURVEY_STEPS} />
                </>
            )}

            {/* Page 3: Interests */}
            {step === 3 && (
                <>
                    <h1 className="text-center text-xl">What are your interests?</h1>
                    <p className="text-center text-sm text-gray-500">Leave unselected if none apply to you.</p>

                    <div className="flex flex-col gap-y-2">
                        {activities.map((item) => (
                            <CheckboxCard
                                key={item.id}
                                title={item.title}
                                // img={item.img}
                                icon={item.icon}
                                color={item.color}
                                isChecked={interests.includes(item.title)}
                                onChange={() => toggleItem(interests, setInterests, item.title)}
                            />
                        ))}
                    </div>

                    <ActionButton title="Next" className="self-center" onClick={handleNextClick} />
                </>
            )}

            {/* Page 4: Personality */}
            {step === 4 && (
                <>
                    <h1 className="text-center text-xl">What describes you best?</h1>

                    <div className="grid grid-cols-2 gap-4">
                        {PERSONALITIES.map((item) => (
                            <OptionCard
                                key={item}
                                title={item}
                                className="min-h-[100px]"
                                isSelected={personality === item}
                                onClick={() => handlePersonalityClick(item)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Page 5: Dietary Restrictions */}
            {step === 5 && (
                <>
                    <h1 className="text-center text-xl">Do you have dietary restrictions?</h1>
                    <p className="text-center text-sm text-gray-500">Leave unselected if none apply to you.</p>

                    <div className="flex flex-col gap-y-2">
                        {dietaryOptions.map((item) => (
                            <CheckboxCard
                                key={item.id}
                                title={item.title}
                                // img={item.img}
                                icon={item.icon}
                                color={item.color}
                                isChecked={dietary.includes(item.title)}
                                onChange={() => toggleItem(dietary, setDietary, item.title)}
                            />
                        ))}

                        {/* Others: typed in by the user */}
                        {customDietary.map((item) => (
                            <CheckboxCard
                                key={item.id}
                                icon={othersStyle.icon}
                                color={othersStyle.color}
                                isChecked={item.isChecked}
                                onChange={() => updateCustomDietary(item.id, { isChecked: !item.isChecked })}
                            >
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => updateCustomDietary(item.id, { text: e.target.value })}
                                    placeholder="e.g. Peanut allergy"
                                    className="w-full p-2 rounded-xl border-2 border-gray-200 bg-white text-center text-sm focus:outline-none"
                                />
                            </CheckboxCard>
                        ))}

                        <AddButton title="Others" onClick={handleAddCustomDietary} />
                    </div>

                    <ActionButton title="Complete" className="self-center" onClick={handleCompleteClick} />
                </>
            )}
        </main>
    </div>;
}
export default NewUser;
