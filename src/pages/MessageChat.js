import React from 'react';
import AccessibilityBar from '../components/AccessibilityBar';
import chatData from "../content/chats.json";
import eventData from "../content/events.json";
import profileData from "../content/profile.json";
import { useParams, useNavigate } from 'react-router-dom';
import MessageCard from '../components/MessageCard';
import { Send } from 'lucide-react';
import { useEffect, useState } from "react";

function MessageChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const chats = chatData.chats || [];
  const events = eventData.events || [];
  const profiles = profileData.profiles || [];

  const chat = chats.find((c) => c.id === Number(id)) || chats[0];
  const event = events.find((e) => e.id === Number(id)) || events[0];

  const storageKey = `chat_history_${chat.id}`;

  const [chatHistory, setChatHistory] = useState(() => {
    const savedChats = localStorage.getItem(storageKey);
    return savedChats ? JSON.parse(savedChats) : (chat.chat_history || []);
  });
  
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const newMsg = {
      speaker_id: Number(id),
      text: inputText.trim(),
      date: dateStr,
      time: timeStr
    };

    const updatedHistory = [...chatHistory, newMsg];

    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));

    setChatHistory(updatedHistory);
    setInputText('');

    window.location.reload();
  };

  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <div className="py-4 px-4 flex flex-col gap-y-4 w-full mx-auto max-w-md">
      <button className="text-left" onClick={() => navigate(-1)} >temp back button</button>
      <div className="flex items-center w-full gap-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <img></img>
        </div>
        <h1 className="font-heading text-left text-lg font-bold">{event.title}</h1>
      </div>
    </div>

    <main className="flex-1 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md">
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, index) => {
            const prevMsg = chat.chat_history[index - 1];
            const showDateDivider = !prevMsg || prevMsg.date !== msg.date;

            const speakerProfile = profiles.find((p) => p.id === msg.speaker_id);

            return (
              <React.Fragment key={index}>
                {showDateDivider && (
                  <div className="flex justify-center">
                    <span className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                      {msg.date}
                    </span>
                  </div>
                )}
                
                <MessageCard user={msg.speaker_id} name={msg.speaker_id === Number(id) ? "You" : speakerProfile?.name || "Unknown"} time={msg.time} chat={msg.text} />
              </React.Fragment>
            );
          })
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
      </main>

    <footer className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0 flex items-center gap-2 mx-auto max-w-md">
        <textarea id="message" rows="1" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
          className="rounded-xl border border-2 border-gray-200 text-heading text-sm block w-full p-3 placeholder:text-gray-400 resize-none focus:outline-none whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
          placeholder="Type a message..."
        ></textarea>
        
        <button className="bg-gray-400 text-white p-3 rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-md" onClick={handleSendMessage} >
          <Send size={18} />
        </button>
      </footer>
  </div>;
}
export default MessageChat;