import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { usePeer } from "../context/peer";
import loading from "../assets/loading.gif"
import { IoMdMic, IoMdMicOff, IoMdVideocam } from "react-icons/io";
import { BiVideo, BiVideoOff } from "react-icons/bi";
// https://gmeetclone-socket-server.onrender.com - Production
// http://localhost:9000 - Development
const JoinRoom = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const connectionRef = useRef();
  const location = useLocation();
  const idToJoin = location.state ? location.state.idToJoin : "";
  const { setCallAccepted, myVideo, userVideo, callAccepted } = usePeer();

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("https://gmeetclone-socket-server.onrender.com");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Got user video", Date.now());
        setStream(stream);
        myVideo.current.srcObject = stream;
      })
      .catch((error) => {
        setError("Error accessing user media: " + error.message);
      });

    socket.current.on("me", (id) => {
      console.log(id, Date.now());
      setMe(id);
    });

    return () => {
      socket.current.disconnect(); // Disconnect socket when component unmounts
    };
  }, []);

  const callUser = () => {
    setIsClicked(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log(`Calling ${idToJoin}...`, Date.now());
      socket.current.emit("callUser", {
        userToCall: idToJoin,
        signalData: data,
        from: me,
        name: me,
      });
    });

    peer.on("stream", (stream) => {
      console.log("Got other person's video", stream);
      userVideo.current.srcObject = stream;
    });

    socket.current.on("callAcceptedTrue", (signal) => {
      console.log(`Call Accepted...`, Date.now());
      setCallAccepted(true);
      peer.signal(signal);
      navigate("/MeetingPage");
    });

    connectionRef.current = peer;
  };

  return (
    <>
      <Header />
      <div className="video-container flex w-11/12 h-5/6  items-center justify-around mt-10 align-middle">
        <div className="video bg-black-200 rounded-xl ">
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <div className="flex flex-col  items-center">
                <video className="" ref={myVideo} autoPlay />
                <div className=" flex justify-center  text-zinc-400 gap-3 p-3">
                  <div className=" flex justify-center items-center w-10 h-10 rounded-3xl border-zinc-400 border-2">
                    <IoMdMic className="w-6 h-6 "></IoMdMic>
                  </div>
                  <div className=" flex justify-center items-center w-10 h-10 rounded-3xl border-zinc-400 border-2">
                    <IoMdVideocam className="w-6 h-6"></IoMdVideocam>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>


        <div className="flex flex-col items-center">
          <h2 className="text-3xl my-4 ">Ready to join?</h2>
          {
            !callAccepted && isClicked ? 
            <>
            <p className="">Asking the user to let you in.</p>
            <img className="w-10 h-10" src={loading}></img>
            </>
            :<></>

          }
          <button
            className="rounded-3xl my-3 bg-blue-600 text-white p-3 w-40"
            onClick={callUser}
          >
            Join Now
          </button>

        </div>
      </div>
    </>
  );
};

export default JoinRoom;
