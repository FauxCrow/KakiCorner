import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatCard({
    name = "",
    date = "",
    last_chat = "",
    chat_id = 0
}) {
    const navigate = useNavigate();

    return (
        <button className="w-full mx-auto max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0" onClick={() => navigate(`/messages/${chat_id}`)}>
            <div className="flex items-center w-full gap-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <img></img>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full gap-2">
                        <h1 className="font=heading text-left text-sm font-bold">{name}</h1>
                        <h3 className="font=heading text-left text-sm">{date}</h3>
                    </div>

                    <h3 className="font=heading text-left text-sm line-clamp-1">{last_chat}</h3>
                </div>
            </div>
        </button>
    );
}
