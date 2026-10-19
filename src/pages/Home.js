import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';

function Home() {
  return <div className="flex flex-col h-screen w-full overflow-hidden">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0">
      <span>This is the Home Page.</span>
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Home;