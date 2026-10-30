import React from 'react';
import { useParams } from 'react-router-dom';

export default function MessageCard({
    user,
    name = "",
    time = "",
    chat = ""
}) {
    const { id } = useParams();

    return (
        <div>
            {/* If message is from you */}
            {(user === Number(id)) && (
                <div className="flex justify-end w-full">
                    <div className="w-[80%] max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between w-full gap-2">
                            <h1 className="font=heading font-bold text-left text-sm">{name}</h1>
                            <h1 className="font=heading text-left text-sm">{time}</h1>
                        </div>
                        <h3 className="font=heading text-left text-sm">{chat}</h3>
                    </div>
                </div>
            )}

            {/* If message from someone else */}
            {(user !== Number(id)) && (
                <div className="w-[80%] max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between w-full gap-2">
                            <h1 className="font=heading font-bold text-left text-sm">{name}</h1>
                            <h1 className="font=heading text-left text-sm">{time}</h1>
                        </div>
                        <h3 className="font=heading text-left text-sm">{chat}</h3>
                </div>
            )}
        </div>
    );
}
