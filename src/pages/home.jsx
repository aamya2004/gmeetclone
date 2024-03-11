import React, { useState } from "react";
import { TbVideoPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import JoinRoom from "./joinRoom";
import clsx from "clsx";
const Home = () => {
  //const history = useHistory();
  const [idToJoin, setIdToJoin] = useState("");
  const [userStream, setUserStream] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/MeetingPage");
  };

  const handleClick = (e) => {
    setIsClicked(true);
    setIdToJoin(e.target.value);
  }

  const JoinMeeting = (idToJoin) => {
    {
      idToJoin ? navigate("/joinRoomPage", { state: { idToJoin } }) : <></>;
    }
  };

  return (
    <>
      <div className=" w-full gap-5 flex flex-col items-center">
        <Header />

        <div className="w-full h-full lg:pt-20 ">
          <div className="">
            <div className="text-Area flex flex-col p-2 gap-3 lg:w-4/5 xl:w-3/5 ">
              <div className="h-full font-bold text-5xl  pt-20 px-20 relative lg:text-start  text-center">
                Premium video meetings. Now free for everyone.
              </div>
              <div className="font-normal  text-center  lg:text-start px-20 text-gray-500 text-2xl">
                We re-engineered the service we built for secure business
                meetings, Google Meet, to make it free and available for all.
              </div>
            </div>
            <div className="button-area flex justify-center lg:justify-start lg:pl-10 pt-10">
              <div
                onClick={handleOnClick}
                className="flex text-base items-center bg-blue-500 rounded-md font-medium ml-12 w-40 h-12 text-white cursor-pointer
                            hover:drop-shadow-lg hover:bg-blue-600 hover:transition hover:delay-150 hover:duration-300"
              >
                <TbVideoPlus className="h-5 w-12  text-white" />
                New Meeting
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  className={clsx("rounded-md p-3 w-60 h-12  ml-5 border-gray-400 border-2 hover:border-gray-600",{
                    "border-blue-700 border-2": isClicked===true,
                    "border-blue-700 border-2" : idToJoin.length>0,
                    //"border-gray-400 border-2 hover:border-gray-600" : idToJoin.length===0,
                  })}
                  value={idToJoin}
                  onChange={handleClick}
                ></input>
              </div>
              <div className="px-6">

              <button
                className="text-lg font-normal hover:bg-blue-50 w-16 h-12 hover:text-blue-800 hover:font-medium rounded-md text-zinc-400"
                onClick={() => JoinMeeting(idToJoin)}
                >
                Join
              </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
