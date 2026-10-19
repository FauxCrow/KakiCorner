import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';

function Profile() {
  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0">
      <span>This is the Profile Page.</span>
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Profile;