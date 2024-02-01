import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import MeetingPage from './pages/meetingPage';
import JoinRoom from './pages/joinRoom';
const App = () => {
  return (
   <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/newMeetingPage" element={<NewMeetingPage />} /> */}
        <Route path="/MeetingPage" element={<MeetingPage />} />
        <Route path="/joinRoomPage" element={<JoinRoom />} />
      </Routes>
    </Router>    
   </>
  )
}

export default App