import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Survey from './pages/Survey';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails'

// Note: HashRouter is used to bypass github 404 error, even if it makes the url look ugly :(

function App() {
  return (
    <HashRouter> 
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events/:type" element={<Events />} />
          <Route path="/eventdetails/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
