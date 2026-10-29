import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';
import profileData from "../content/profile.json";

function Profile() {
  const pID = localStorage.getItem("profile_id");
  const profiles = profileData.profiles || [];
  const profile = profiles.find((p) => p.id === Number(pID)) || profiles[0];
  const gender = profile.gender === "M" ? "Male" : "Female";

  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md items-center">
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
        <img></img>
      </div>

      <div className="flex flex-col gap-y-2 items-center">
        <h1 className="font=heading text-left text-lg">{profile.name}</h1>
        <h3 className="font=heading text-left text-sm">{gender}</h3>
        <h3 className="font=heading text-left text-sm">{profile.age}</h3>
        <h3 className="font=heading text-left text-sm">{profile.personality}</h3>
      </div>

      <div className="w-full mx-auto max-w-md p-6 z-50 bg-gray-100 rounded-2xl shadow-sm flex-shrink-0">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between w-full gap-2">
            <h1 className="font=heading text-left text-lg">Interests</h1>
            <button className="text-right" onClick >temp edit button</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {profile.interests.length > 0 ? (
              profile.interests.map((interests) => (
                <div className="bg-white rounded-xl flex items-center justify-center font-bold text-md shadow-md min-h-[75px]">{interests}</div>
              ))
            ) : (
              <p className="text-gray-500 text-left col-span-full">No listed interests.</p>
            )}
          </div>


          <h1 className="font=heading text-left text-lg">Dietery Restrictions</h1>

          <div className="grid grid-cols-3 gap-2">
            {profile.dietery_restrictions.length > 0 ? (
              profile.dietery_restrictions.map((dietery) => (
                <div className="bg-white rounded-xl flex items-center justify-center font-bold text-md shadow-md min-h-[75px]">{dietery}</div>
              ))
            ) : (
              <p className="text-gray-500 text-left col-span-full">No listed dietery restrictions.</p>
            )}
          </div>
        </div>
      </div>

    </main>

    <NavBar></NavBar>
  </div>;
}
export default Profile;