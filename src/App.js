import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

// Note: HashRouter is used to bypass github 404 error, even if it makes the url look ugly :(

function App() {
  return (
    <HashRouter> 
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
