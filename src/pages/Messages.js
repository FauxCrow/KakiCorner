import AccessibilityBar from '../components/AccessibilityBar';
import NavBar from '../components/NavigationBar';

function Messages() {
  return <div className="flex flex-col min-h-screen w-full">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-32 px-4">
      <span>This is the Messages Page.</span>
    </main>

    <NavBar></NavBar>
  </div>;
}
export default Messages;