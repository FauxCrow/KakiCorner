import React from 'react';
import profileData from "../content/profile.json";

export default function ParticipantCard({
    id = 1,
    isOwner = false
}) {
    const profiles = profileData.profiles || [];
    const profile = profiles.find((p) => p.id === Number(id)) || profiles[0];

    const handleAcceptClick = () => {
        // TODO
    };

    const handleRemoveClick = () => {
        // TODO
    };

    return (
        <div className="w-full mx-auto max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0">
            <div className="flex flex-col w-full gap-y-2">
                <div className="flex items-center w-full gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <img></img>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font=heading text-left text-lg">{profile.name}</h1>
                        <h3 className="font=heading text-left text-sm">{profile.gender}, {profile.age}</h3>
                        <h3 className="font=heading text-left text-sm">{profile.personality}</h3>
                    </div>
                </div>

                {(isOwner) && (
                    <div className="flex items-center justify-between w-full gap-2">
                        <button className="text-right" onClick={() => handleAcceptClick} >temp accept button</button>
                        <button className="text-right" onClick={() => handleRemoveClick} >temp remove button</button>
                    </div>
                )}
            </div>
        </div>
    );
}
