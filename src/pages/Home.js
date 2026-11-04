import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import eventData from "../content/events.json";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      const pID = localStorage.getItem("profile_id");
      if (!pID) {
        navigate("/newuser")
        return;
      }

      const savedEvents = localStorage.getItem("events");
      if (!savedEvents) {
        const initialEvents = eventData.events || [];
        localStorage.setItem("events", JSON.stringify(initialEvents));
      }
    };
    loadInitialData();
  }, [navigate]);

  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px] hover:scale-105 transition" onClick={() => navigate("/createevent")} >
          New Event
        </button>
        <button className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px] hover:scale-105 transition" onClick={() => navigate("/events/created")} >
          Created Events
        </button>
        <button className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px] hover:scale-105 transition" onClick={() => navigate("/events/joined")} >
          Joined Events
        </button>
        <button className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px] hover:scale-105 transition" onClick={() => navigate("/events/all")} >
          See All Events
        </button>
        
        {/* TEMPORARY, FOR TESTING */}
        <button className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px] hover:scale-105 transition" onClick={() => navigate("/newuser")} >
          Temp Front Screen
        </button>
      </div>
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Home;