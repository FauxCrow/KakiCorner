import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Survey from './pages/Survey';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails'
import EventParticipants from './pages/EventParticipants';
import MessageChat from './pages/MessageChat';
import CreateEvent from './pages/CreateEvent';
import NewUser from './pages/NewUser';
import Start from './pages/Start';
import SelectUser from './pages/SelectUser';

// Note: HashRouter is used to bypass github 404 error, even if it makes the url look ugly :(

// A fresh open (new tab/browser) always begins at the start screen; a refresh keeps the current page
if (!sessionStorage.getItem("session_started")) {
  sessionStorage.setItem("session_started", "true");
  window.location.hash = "#/";
}

function App() {
  return (
    <HashRouter> 
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Start />} />
          <Route path="/selectuser" element={<SelectUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events/:type" element={<Events />} />
          <Route path="/eventdetails/:id" element={<EventDetails />} />
          <Route path="/eventparticipants/:id" element={<EventParticipants />} />
          <Route path="/messages/:id" element={<MessageChat />} />
          <Route path="/createevent" element={<CreateEvent />} />
          <Route path="/newuser" element={<NewUser />} />
          <Route path="/editprofile" element={<NewUser key="edit" isEdit />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
