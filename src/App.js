import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import MeetingPage from './pages/meetingPage';
import JoinRoom from './pages/joinRoom';
import MobileHome from './pages/mobileHome';
import MobileMeetingPage from './pages/mobileMeetingPage';
import MobileJoinRoom from './pages/mobileJoinRoom';


const App = () => {

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;



  return (
   <>
    <Router>
      <Routes>
        <Route path="/" element={
          width < breakpoint ?(
            <MobileHome />
          )
          :(
            <Home />
          )
        } />
        {/* <Route path="/newMeetingPage" element={<NewMeetingPage />} /> */}
        <Route path="/MeetingPage"  element={
          width < breakpoint ?(
            <MobileMeetingPage />
          )
          :(
            <MeetingPage />
          )
        } />
        <Route path="/joinRoomPage" element={
          width < breakpoint ?(
            <MobileJoinRoom />
          )
          :(
            <JoinRoom />
          )
        } />
        
      </Routes>
    </Router>    
   </>
  )
}

export default App