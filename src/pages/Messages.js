import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import eventData from "../content/events.json";
import chatData from "../content/chats.json";
import { useEffect, useState } from "react";
import ChatCard from '../components/ChatCard';

function Messages() {
  const [activeChats, setActiveChats] = useState([]);
  const [archivedChats, setArchivedChats] = useState([]);

  useEffect(() => {
    const pID = Number(localStorage.getItem("profile_id"));
    const events = eventData.events || [];
    const chats = chatData.chats || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseLocalDate = (dateString) => {
      if (!dateString) return new Date(0);
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const myEvents = events.filter((event) =>
      event.host === pID || (event.participants_id && event.participants_id.includes(pID))
    );

    const active = [];
    const archived = [];

    myEvents.forEach((event) => {
      const eventDate = parseLocalDate(event.date);
      const matchingChat = chats.find((c) => c.id === event.id);
      let lastMessageText = "No messages yet.";

      if (matchingChat && matchingChat.chat_history && matchingChat.chat_history.length > 0) {
        const lastMessage = matchingChat.chat_history[matchingChat.chat_history.length - 1];
        lastMessageText = lastMessage.text;
      }

      const chatItem = {
        chat_id: event.id,
        name: event.title,
        date: event.date,
        last_chat: lastMessageText,
        parsedDate: eventDate
      };

      if (eventDate >= today) {
        active.push(chatItem);
      } else {
        archived.push(chatItem);
      }
    });

    active.sort((a, b) => a.parsedDate - b.parsedDate);
    archived.sort((a, b) => b.parsedDate - a.parsedDate);

    setActiveChats(active);
    setArchivedChats(archived);
  }, []);

  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md items-center">
      <h1 className="text-left font-bold text-xl w-full mx-auto max-w-md">Active Chats</h1>
      {activeChats.length > 0 ? (
        activeChats.map((chat) => (
            <ChatCard 
              key={chat.chat_id}
              chat_id={chat.chat_id}
              name={chat.name}
              date={chat.date}
              last_chat={chat.last_chat}
            />
          ))
      ) : (
        <p className="text-gray-500">No active chats.</p>
      )}

      <h1 className="text-left font-bold text-xl w-full mx-auto max-w-md">Archived Chats</h1>

      {archivedChats.length > 0 ? (
        archivedChats.map((chat) => (
            <ChatCard 
              key={chat.chat_id}
              chat_id={chat.chat_id}
              name={chat.name}
              date={chat.date}
              last_chat={chat.last_chat}
            />
          ))
      ) : (
        <p className="text-gray-500">No archived chats.</p>
      )}
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Messages;