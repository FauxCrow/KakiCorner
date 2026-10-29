import AccessibilityBar from '../components/AccessibilityBar';
import chatData from "../content/chats.json";

function MessageChat() {
  
  return <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-base">
    <AccessibilityBar></AccessibilityBar>

    <main className="flex-1 py-4 px-4 overflow-y-auto min-h-0 flex flex-col gap-y-4 w-full mx-auto max-w-md items-center">
      This is the chat messages page.
    </main>
  </div>;
}
export default MessageChat;