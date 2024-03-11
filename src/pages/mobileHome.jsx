import React, { useState } from "react";
import { TbVideoPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import JoinRoom from "./joinRoom";
import MobileHeader from "../components/mobileHeader";
import logo from '../assets/logo.png'; 
const MobileHome = () => {
  //const history = useHistory();
  const [idToJoin, setIdToJoin] = useState("");
  const [userStream, setUserStream] = useState(null);
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/MeetingPage");
  };
  const JoinMeeting = (idToJoin) => {
    {
      idToJoin ? navigate("/joinRoomPage", { state: { idToJoin } }) : <></>;
    }
  };

  return (
    <>
      <div className=" w-full gap-5 flex flex-col items-center">
        <MobileHeader />
        <img src={logo} className="w-15 h-8"  alt="" />

        <div className="w-full h-full">
          <div className="">
            <div className="text-Area flex flex-col items-center p-3 gap-3">
              <div className="h-full font-bold text-3xl  relative  text-center">
                Video calls with anyone, anywhere
              </div>
              <div className="font-normal text-sm  text-center p-1 text-gray-500 text-lg ">
                We re-engineered the service we built for secure business
                meetings, Google Meet, to make it free and available for all.
              </div>
            </div>
            <div className="button-area  flex flex-col gap-3 items-center">
              <div
                onClick={handleOnClick}
                className="flex text-base items-center bg-blue-500 rounded-md font-medium w-40 h-10 text-white cursor-pointer"
              >
                <TbVideoPlus className="h-5 w-10 text-white"  />
                New Meeting
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  className="rounded-md border-gray-500 border-2 p-2 w-60 h-12 "
                  value={idToJoin}
                  onChange={(e) => setIdToJoin(e.target.value)}
                ></input>
                </div>
              <button
                className="px-6  text-lg font-normal text-zinc-400"
                onClick={() => JoinMeeting(idToJoin)}
                >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHome;
