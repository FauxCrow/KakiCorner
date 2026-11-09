import ActionButton from '../components/ActionButton';
import RadioOption from '../components/RadioOption';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useLanguage } from '../hooks/UseLanguage';
import { getProfiles, setCurrentUserId } from "../utils/db";
import languageData from "../content/languages.json";

function SelectUser() {
    const navigate = useNavigate();
    const { changeLanguage } = useLanguage();

    const profiles = getProfiles();
    const languages = languageData.languages || [];

    const [selectedId, setSelectedId] = useState(null);

    const getLanguageLabel = (code) => languages.find((l) => l.code === code)?.label || "English";

    // Log in as the chosen user, then switch the app to their language
    const handleGoClick = () => {
        const profile = profiles.find((p) => p.id === selectedId);
        setCurrentUserId(profile.id);
        navigate("/home");
        changeLanguage(profile.language || "en");
    };

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-6 w-full mx-auto max-w-md">
            <ActionButton title="Back" className="self-start px-6 py-2" onClick={() => navigate("/")} />

            <h1 className="text-center text-xl">Select User</h1>

            <div className="flex flex-col gap-y-3">
                {profiles.map((profile) => (
                    <RadioOption
                        key={profile.id}
                        name="profile"
                        isChecked={selectedId === profile.id}
                        onChange={() => setSelectedId(profile.id)}
                    >
                        <span className="notranslate text-base font-bold">{profile.name}</span>
                        <span className="text-sm">Age: {profile.age}</span>
                        <span className="text-sm">Language: {getLanguageLabel(profile.language)}</span>
                    </RadioOption>
                ))}
            </div>

            <ActionButton title="Go" className="self-center" disabled={!selectedId} onClick={handleGoClick} />
        </main>
    </div>;
}
export default SelectUser;
