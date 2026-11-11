import ActionButton from '../components/ActionButton';
import StepIndicator from '../components/StepIndicator';
import OptionCard from '../components/OptionCard';
import CheckboxCard from '../components/CheckboxCard';
import AddButton from '../components/AddButton';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
// import { useState, useEffect } from "react";
import { useState } from "react";
import activityData from "../content/activities.json";
import dietaryData from "../content/dietary.json";
// import profileData from "../content/profile.json";
import languageData from "../content/languages.json";
// import { addProfile, setCurrentUserId } from "../utils/db";
import { addProfile, setCurrentUserId, getCurrentUser, updateProfile } from "../utils/db";
import { randomPerson } from "../utils/randomProfile";
import { useLanguage } from '../hooks/UseLanguage';

// Pages 1-2 are setup, pages 3-5 are the 3-step survey
// const SURVEY_OFFSET = 2;
// const SURVEY_STEPS = 3;

// Pages: 1 language, 2 Singpass, 3 caretaker, 4 caretaker's phone, 5 interests, 6 personality, 7 dietary
const SURVEY_OFFSET = 2;
const SURVEY_STEPS = 4;

// Survey circle to highlight for each page (both caretaker pages count as circle 1)
const SURVEY_NUMBER = { 3: 1, 4: 1, 5: 2, 6: 3, 7: 4 };

// const LANGUAGES = ["English", "Chinese", "Malay", "Tamil"];

const PERSONALITIES = [
    "I like to make new friends.",
    "I prefer small, quiet groups.",
    "I enjoy trying new things.",
    "I like learning from others."
];

// function NewUser() {
function NewUser({ isEdit = false }) {
    const navigate = useNavigate();
    const activities = activityData.activities || [];
    const dietaryOptions = dietaryData.dietary || [];
    // const profiles = profileData.profiles || [];
    const languages = languageData.languages || [];
    const { changeLanguage } = useLanguage();

    // Edit Profile reuses this page, starting at the interests page with the user's current answers
    const [currentUser] = useState(() => (isEdit ? getCurrentUser() : null));
    const presetDietary = dietaryOptions.map((item) => item.title);
    const savedDietary = currentUser?.dietery_restrictions || [];

    // If translating had to reload the page, carry on from page 2 with the language already picked
    // const savedLanguage = sessionStorage.getItem("newuser_language");
    const savedLanguage = isEdit ? null : sessionStorage.getItem("newuser_language");

    // const [step, setStep] = useState(1);
    // const [step, setStep] = useState(savedLanguage ? 2 : 1);
    // const [step, setStep] = useState(isEdit ? 3 : savedLanguage ? 2 : 1);
    const [step, setStep] = useState(isEdit ? 5 : savedLanguage ? 2 : 1);

    // null = not answered yet, true = has a caretaker, false = no caretaker
    const [hasCaretaker, setHasCaretaker] = useState(null);
    const [caretakerPhone, setCaretakerPhone] = useState("");

    // Singapore numbers: 8 digits starting with 6, 8 or 9
    // const isValidPhone = /^[689]\d{7}$/.test(caretakerPhone);
    const isValidPhone = /^\d{8}$/.test(caretakerPhone);

    // const [language, setLanguage] = useState(null);
    const [language, setLanguage] = useState(savedLanguage);
    // const [interests, setInterests] = useState([]);
    // const [personality, setPersonality] = useState(null);
    // const [dietary, setDietary] = useState([]);
    // const [customDietary, setCustomDietary] = useState([]);
    const [interests, setInterests] = useState(currentUser?.interests || []);
    const [personality, setPersonality] = useState(currentUser?.personality || null);
    const [dietary, setDietary] = useState(savedDietary.filter((item) => presetDietary.includes(item)));
    const [customDietary, setCustomDietary] = useState(
        savedDietary
            .filter((item) => !presetDietary.includes(item))
            .map((text, index) => ({ id: index + 1, text: text, isChecked: true }))
    );

    const othersStyle = dietaryData.others || {};

    const handleBackClick = () => {
        // setStep(step - 1);
        // if (isEdit && step === 3) {
        if (isEdit && step === 5) {
            navigate("/profile");
        } else if (step === 1) {
            sessionStorage.removeItem("newuser_language");
            navigate("/");
        } else if (step === 5 && !hasCaretaker) {
            // No caretaker means the phone page was skipped, so go back to the yes/no page
            setStep(3);
        } else {
            setStep(step - 1);
        }
    };

    // Yes goes to the phone number page; No skips straight to interests
    const handleCaretakerClick = (answer) => {
        setHasCaretaker(answer);
        setStep(answer ? 4 : 5);
    };

    const handleNextClick = () => {
        setStep(step + 1);
    };

    // const handleLanguageClick = (item) => {
    //     setLanguage(item);
    //     handleNextClick();
    // };
    const handleLanguageClick = (code) => {
        setLanguage(code);
        sessionStorage.setItem("newuser_language", code);
        handleNextClick();
        changeLanguage(code);
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
        // Ticked preset options + ticked "Others" rows that aren't empty
        const dietaryList = [
            ...dietary,
            ...customDietary.filter((item) => item.isChecked && item.text.trim()).map((item) => item.text.trim())
        ];

        // Edit Profile: update the same user instead of creating a new one
        if (isEdit) {
            updateProfile({ ...currentUser, personality: personality, interests: interests, dietery_restrictions: dietaryList });
            navigate("/profile");
            return;
        }

        // const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || profiles;

        // const lastId = savedProfiles.length > 0 ? Math.max(...savedProfiles.map(p => p.id)) : 0;
        // const nextId = lastId + 1;

        // id is now given by addProfile()
        const newProfile = {
            // id: nextId,
            // name: localStorage.getItem("name"),
            // gender: localStorage.getItem("gender"),
            // age: localStorage.getItem("age"),
            ...randomPerson(),
            language: language || "en",
            has_caretaker: hasCaretaker === true,
            caretaker_phone: hasCaretaker ? caretakerPhone : "",
            personality: personality,
            interests: interests,
            // dietery_restrictions: dietary
            // dietery_restrictions: [
            //     ...dietary,
            //     ...customDietary.filter((item) => item.isChecked && item.text.trim()).map((item) => item.text.trim())
            // ]
            dietery_restrictions: dietaryList
        };

        // const updatedProfiles = [...savedProfiles, newProfile];
        // localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
        // localStorage.setItem("profile_id", nextId);
        const savedProfile = addProfile(newProfile);
        setCurrentUserId(savedProfile.id);
        sessionStorage.removeItem("newuser_language");

        // navigate("/");
        navigate("/home");
    };

    // Placeholder details, replaced by randomPerson() in handleCompleteClick
    // useEffect(() => {
    //     const createProfile = async () => {
    //         localStorage.setItem("name", "John Doe");
    //         localStorage.setItem("age", 0);
    //         localStorage.setItem("gender", "M");
    //     };
    //     createProfile();
    // }, []);

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
                        {/* {LANGUAGES.map((item) => (
                            <OptionCard
                                key={item}
                                title={item}
                                isSelected={language === item}
                                onClick={() => handleLanguageClick(item)}
                            />
                        ))} */}
                        {languages.map((item) => (
                            <OptionCard
                                key={item.code}
                                title={item.label}
                                isSelected={language === item.code}
                                onClick={() => handleLanguageClick(item.code)}
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
                    {/* <StepIndicator current={step - SURVEY_OFFSET} total={SURVEY_STEPS} /> */}
                    <StepIndicator current={SURVEY_NUMBER[step]} total={SURVEY_STEPS} />
                </>
            )}

            {/* Page 3: Caretaker yes/no */}
            {step === 3 && (
                <>
                    <h1 className="text-center text-xl">Do you have a caretaker?</h1>

                    <div className="grid grid-cols-2 gap-4">
                        <OptionCard
                            title={<span className="flex flex-col items-center gap-y-2"><Check size={48} /> Yes</span>}
                            className="min-h-[130px]"
                            isSelected={hasCaretaker === true}
                            onClick={() => handleCaretakerClick(true)}
                        />
                        <OptionCard
                            title={<span className="flex flex-col items-center gap-y-2"><X size={48} /> No</span>}
                            className="min-h-[130px]"
                            isSelected={hasCaretaker === false}
                            onClick={() => handleCaretakerClick(false)}
                        />
                    </div>
                </>
            )}

            {/* Page 4: Caretaker's phone number (only if they said yes) */}
            {step === 4 && (
                <>
                    <h1 className="text-center text-xl">What is the caretaker's phone number?</h1>

                    {/* <input
                        type="tel"
                        inputMode="numeric"
                        value={caretakerPhone}
                        onChange={(e) => setCaretakerPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        placeholder="Phone Number..."
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-base placeholder:text-gray-400 focus:outline-none"
                    /> */}

                    {/* "+65" is fixed text beside the box, so only the 8 digits are typed and saved */}
                    <div className="w-full flex items-center rounded-2xl border-2 border-gray-200 overflow-hidden">
                        <span className="notranslate px-4 py-4 bg-gray-100 text-base text-gray-600 border-r-2 border-gray-200">+65</span>
                        <input
                            type="tel"
                            inputMode="numeric"
                            value={caretakerPhone}
                            onChange={(e) => setCaretakerPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                            placeholder="Phone Number..."
                            className="flex-1 min-w-0 p-4 text-base placeholder:text-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* {!isValidPhone && (
                        <p className="text-center text-sm text-gray-500">Please enter an 8-digit number starting with 6, 8 or 9.</p>
                    )} */}

                    <ActionButton title="Next" className="self-center" disabled={!isValidPhone} onClick={handleNextClick} />
                </>
            )}

            {/* Page 3: Interests */}
            {/* {step === 3 && ( */}
            {step === 5 && (
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
            {/* {step === 4 && ( */}
            {step === 6 && (
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
            {/* {step === 5 && ( */}
            {step === 7 && (
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
