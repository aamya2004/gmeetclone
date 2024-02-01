import React, { useState } from "react";
import { TbVideoPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import JoinRoom from "./joinRoom";
const Home = () => {
  //const history = useHistory();
  const [idToJoin, setIdToJoin] = useState("");
  const [userStream, setUserStream] = useState(null);
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/MeetingPage");
  };
  const JoinMeeting = (idToJoin) => {
    {idToJoin 
      ? (navigate("/joinRoomPage" ,{state : {idToJoin}}))
       :<></>}
  }

  return (
    <>
      <Header />
      <div className="fixed">
        <div className="h-full w-1/2 flex justify-start m-10 text-5xl font-normal p-3 relative top-[80px] ">
          Premium video meetings. now free for everyone.
        </div>
        <div className="w-1/2 flex justify-start m-10 font-normal p-4 relative top-[40px] text-gray-500 text-lg">
          We re-engineered the service we built for secure business meetings,
          Google Meet, to make it free and available for all.
        </div>
        <div className="flex">
          <div
            onClick={handleOnClick}
            className="flex text-base items-center bg-blue-500 font-medium mt-12 ml-12 w-40 h-10 text-white cursor-pointer"
          >
            <TbVideoPlus className="h-5 w-12 text-white" />
            New Meeting
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter a code or link"
              className="rounded-md border-gray-500 border-2 p-3 w-60 mt-10 ml-5"
              value={idToJoin}
              onChange={(e) => setIdToJoin(e.target.value)}
            ></input>
          </div>
          <button className="p-4 mt-9 text-lg font-normal text-zinc-400"
           onClick={() => JoinMeeting(idToJoin)}>
            Join
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
