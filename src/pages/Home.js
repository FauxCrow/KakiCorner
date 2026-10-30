import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();

  // TEMP: REMOVE FOR INTEGRATION LATER
  const temp_id = localStorage.setItem("profile_id", 1);

  useEffect(() => {
    const loadProfile = async () => {
      const pID = localStorage.getItem("profile_id");
      if (!pID) {
        navigate("/survey")
      }
    };
    loadProfile();
  }, []);

  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px]">
          <button onClick={() => navigate("/")} >not working create</button>
        </div>
        <div className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px]">
          <button onClick={() => navigate("/events/created")} >temp created button</button>
        </div>
        <div className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px]">
          <button onClick={() => navigate("/events/joined")} >temp joined button</button>
        </div>
        <div className="bg-grey-100 p-6 rounded-xl flex items-center justify-center font-bold text-lg shadow-md min-h-[150px]">
          <button onClick={() => navigate("/events/all")} >temp all button</button>
        </div>
      </div>
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Home;