import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';

function Profile() {
  return <div className="flex flex-col h-screen w-full overflow-hidden">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-32 px-4 overflow-y-auto">
      <span>This is the Profile Page.</span>
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Profile;