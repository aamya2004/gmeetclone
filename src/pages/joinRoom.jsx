import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { usePeer } from "../context/peer";
const socket = io("http://localhost:9000");


const JoinRoom = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const navigate = useNavigate();
  const connectionRef = useRef();
  const location = useLocation();
  const idToJoin = location.state ? location.state.idToJoin : "";
  const {
    setCallAccepted,
    myVideo,
    userVideo,
  } = usePeer();

  useEffect(() => {
    if(socket){

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("Got user video", Date.now());
          setStream(stream);
          myVideo.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing user media:', error);
        })
  
      socket.on("me", (id) => {
        console.log(id, Date.now());
        setMe(id);
      });
    }
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      console.log(`Calling ${idToJoin}...`, Date.now());
      socket.emit("callUser", {
        userToCall: idToJoin,
        signalData: data,
        from: me,
        name: me
      })
    })
    peer.on("stream", (stream) => {
      console.log("Got other person's video", stream);
      userVideo.current.srcObject = stream;
    });
    socket.on("callAcceptedTrue", (signal) => {
      console.log(`Call Accepted...`, Date.now());
      setCallAccepted(true);
      peer.signal(signal)
      navigate("/MeetingPage");
    })
    connectionRef.current = peer
  }

  return (
    <>
      <Header />
      <div className="video-container flex items-center justify-around mt-20 align-middle">
        <div className="video">
          <video playsInline muted ref={myVideo} autoPlay style={{ width: "600px" }} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl my-10">Ready to join?</h2>
          <button className="rounded-3xl bg-blue-600 text-white p-3 w-36" onClick={() => callUser()}>Join Now</button>
        </div>
      </div>
    </>
  );
};

export default JoinRoom;
