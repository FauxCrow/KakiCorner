import RadioOption from '../components/RadioOption';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

function Start() {
    const navigate = useNavigate();
    const [choice, setChoice] = useState(null);

    const handleChoice = (option, path) => {
        setChoice(option);
        navigate(path);
    };

    return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
        <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-6 w-full mx-auto max-w-md pt-24">
            <div className="flex flex-col gap-y-1 text-center">
                <h1 className="text-xl">Welcome to KakiCorner!</h1>
                <h3 className="text-sm">Are you a new or existing user?</h3>
            </div>

            <div className="flex flex-col gap-y-4">
                <RadioOption name="user-type" isChecked={choice === "existing"} onChange={() => handleChoice("existing", "/selectuser")}>
                    <span className="text-base">Existing User</span>
                </RadioOption>

                <RadioOption name="user-type" isChecked={choice === "new"} onChange={() => handleChoice("new", "/newuser")}>
                    <span className="text-base">New User</span>
                </RadioOption>
            </div>
        </main>
    </div>;
}
export default Start;
