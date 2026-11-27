import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
// import eventData from "../content/events.json";
import { getCurrentUserId, getCurrentUser } from "../utils/db";
import MenuCard from '../components/MenuCard';
import { CirclePlus, Search, ClipboardList, CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    const loadInitialData = async () => {
      // const pID = localStorage.getItem("profile_id");
      const pID = getCurrentUserId();
      if (!pID) {
        // navigate("/newuser")
        navigate("/")
        return;
      }

      // Seeding now happens automatically inside db.js
      // const savedEvents = localStorage.getItem("events");
      // if (!savedEvents) {
      //   const initialEvents = eventData.events || [];
      //   localStorage.setItem("events", JSON.stringify(initialEvents));
      // }
    };
    loadInitialData();
  }, [navigate]);

  return <div translate="no" className="notranslate flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-8 w-full mx-auto max-w-md">
      <h1 className="text-center text-2xl pt-4">
        {t('hello')},  <span className="notranslate">{user?.first_name || user?.name}</span>!
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {/* <MenuCard title="New Event" onClick={() => navigate("/createevent")} />
        <MenuCard title="Created Events" onClick={() => navigate("/eventsA/created")} />
        <MenuCard title="Joined Events" onClick={() => navigate("/eventsA/joined")} />
        <MenuCard id="all-event-button" title="See All Events" onClick={() => navigate("/eventsA/all")} /> */}

        {/* Actions start with a verb; lists start with "Events I'm..." so "create"/"join" each appear only once */}
        <MenuCard icon={CirclePlus} isPrimary title="Create a New Event" onClick={() => navigate("/createevent")} />
        <MenuCard id="all-event-button" icon={Search} isPrimary title="Find & Join Events" onClick={() => navigate("/eventsA/all")} />
        <MenuCard icon={ClipboardList} title="Events I'm Hosting" onClick={() => navigate("/eventsA/created")} />
        <MenuCard icon={CalendarCheck} title="Events I'm Attending" onClick={() => navigate("/eventsA/joined")} />
      </div>

      {/* Old tiles, replaced by MenuCard above */}
      {/* <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
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

        <button className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px] hover:scale-105 transition" onClick={() => navigate("/newuser")} >
          Temp Front Screen
        </button>
      </div> */}
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Home;