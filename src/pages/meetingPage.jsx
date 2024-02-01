import React, { useEffect, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { BiVideo, BiVideoOff } from "react-icons/bi";
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md";
import CopyToClipboard from "react-copy-to-clipboard";
import { MdOutlineCallEnd } from "react-icons/md";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { usePeer } from "../context/peer";

function MeetingPage() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [idToCall, setIdToCall] = useState("");
  const [name, setName] = useState("");
  const [shown, setShown] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [screenSharingVideos, setScreenSharingVideos] = useState([]);
  const [peer, setPeer] = useState(null);
  const connectionRef = useRef();
  const screenShareRef = useRef();

  const socket = io("http://localhost:9000");
  const {
    callEnded,
    setCallEnded,
    callAccepted,
    setCallAccepted,
    myVideo,
    userVideo,
    user,
  } = usePeer();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on("me", (id) => {
      setMe(id);
      setShown(true);
    });

    socket.on("userCalling", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    console.log("Running");
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const newPeer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    newPeer.on("signal", (data) => {
      socket.emit("callAccepted", { signal: data, to: caller });
    });

    newPeer.on("stream", (stream) => {
      console.log(stream);
      userVideo.current.srcObject = stream;
    });

    newPeer.signal(callerSignal);
    connectionRef.current = newPeer;
    setPeer(newPeer);
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });

      setIsMute(!isMute);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });

      setIsVideoMuted(!isVideoMuted);
    }
  };

  const setScreenSharingVideoStream = (stream) => {
    if (screenShareRef.current) {
      screenShareRef.current.srcObject = stream;
      screenShareRef.current.muted = true;
      screenShareRef.current.play();
    }
  };

  const startScreenShare = () => {
    if (screenSharing) {
      stopScreenSharing();
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      setScreenSharingVideoStream(stream);
      setScreenStream(stream);
    });

    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.onended = () => {
      stopScreenSharing();
    };

    if (peer) {
      const screenShareVideo = (
        <video
          key={screenSharingVideos.length}
          ref={screenShareRef}
          srcObject={stream}
          muted
          playsInline
          autoPlay
        />
      );
      setScreenSharingVideos((prevVideos) => [...prevVideos, screenShareVideo]);
      setScreenSharing(true);
      socket.emit("startScreenSharing", { to: caller });
    }
  };

  const stopScreenSharing = () => {
    if (!screenSharing) return;

    setScreenSharingVideos([]);
    setScreenSharing(false);
  };

  return (
    <>
      <div className="container bg-black flex flex-col h-screen w-screen">
        {receivingCall && !callAccepted ? (
          <div className="caller bg-white w-full right-0 bottom-10 fixed z-10 justify-center md:w-1/4 h-24 rounded-lg flex flex-col items-center p-2 ">
            <h1>Someone wants to enter this meet?</h1>
            <div className="flex">
              <button
                onClick={answerCall}
                className="text-zinc-500 px-4 cursor-pointer"
              >
                Admit
              </button>
              <button
                onClick={answerCall}
                className="text-zinc-500 px-4 cursor-pointer"
              >
                Deny
              </button>
            </div>
          </div>
        ) : null}

        <div className="video-container flex  justify-center md:flex-row p-1 md:items-stretch flex-wrap ">
          {callAccepted && !callEnded && !screenSharing ? (
          <div className="video flex justify-around  gap-4 p-10  w-screen md:w-1/2 md:mt-0 ">
            <video
              className="border-pink-200 border-2 w-full rounded-xl"
              playsInline
              ref={myVideo}
              autoPlay
              // srcobject={stream}
            />
            <video
              className="border-pink-200 border-2 w-full rounded-xl"
              playsInline
              ref={userVideo}
              autoPlay
              srcobject={stream}
              />
              </div>
          ) : null}
        </div>

        {shown ? (
          <div className="fixed top-0 left-0 w-full h-full flex justify-start items-end  bg-black bg-opacity-50 z-50">
            <div className="bg-slate-100 h-4/3 w-full md:w-1/4 p-6 m-10 rounded shadow-md">
              <div className="flex justify-between">
                <h2 className="text-gray-800 font-medium text-lg">
                  Your Meeting's ready
                </h2>
                <RxCross2
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShown(false)}
                />
              </div>
              <h3>Share this code with anyone you want in this meeting.</h3>
              <div className="h-10 w-30 bg-zinc-300 mt-4 rounded-md flex items-center p-3 justify-between">
                <h3>{me}</h3>
                <CopyToClipboard text={me} style={{ marginBottom: "1rem" }}>
                  <MdContentCopy className="cursor-pointer h-6 text-zinc-700 w-10 mt-4" />
                </CopyToClipboard>
              </div>
              <h6 className="text-zinc-600 text-md">
                People who use this code must get your permission before they
                can join.
              </h6>
            </div>
          </div>
        ) : null}

        <div className="flex justify-center fixed bottom-10 left-1/2 transform -translate-x-1/2 gap-4 md:flex-row">
          {isMute ? (
            <IoMdMicOff
              onClick={toggleMute}
              className="text-white bg-red-500 rounded-3xl p-2 h-10 w-10 cursor-pointer"
            />
          ) : (
            <IoMdMic
              onClick={toggleMute}
              className="text-white bg-zinc-400 rounded-3xl p-2 h-10 w-10 cursor-pointer "
            />
          )}
          {isVideoMuted ? (
            <BiVideoOff
              onClick={toggleVideo}
              className="text-white bg-red-500 rounded-3xl p-2 h-10 w-10 cursor-pointer"
            />
          ) : (
            <BiVideo
              onClick={toggleVideo}
              className="text-white bg-zinc-400 rounded-3xl p-2 h-10 w-10 cursor-pointer "
            />
          )}
          {screenSharing ? (
            <MdOutlineStopScreenShare
              onClick={stopScreenSharing}
              className="text-white bg-red-500 rounded-3xl p-2 h-10 w-10 cursor-pointer"
            />
          ) : (
            <MdOutlineScreenShare
              onClick={startScreenShare}
              className="text-white bg-zinc-400 rounded-3xl p-2 h-10 w-10 cursor-pointer"
            />
          )}
          <MdOutlineCallEnd
            onClick={leaveCall}
            className="text-white bg-zinc-400 rounded-3xl p-2 h-10 w-10 cursor-pointer"
          />
        </div>

        {/* {screenSharing ? (
          <>
            <div
              id="screen-share-container"
              className="w-full h-full flex justify-end items-center"
            >
              {screenSharingVideos.map((video, index) => (
                <div key={index} className="m-2">
                  {video}
                </div>
              ))}
              <div className="flex flex-col h-screen gap-8 p-10">
                <video
                  className="border-pink-200 border-2 h-60 rounded-xl"
                  playsInline
                  ref={myVideo}
                  autoPlay
                  srcobject={stream}
                />
                <video
                  className="border-pink-200 border-2  h-60 rounded-xl"
                  playsInline
                  ref={userVideo}
                  autoPlay
                  srcobject={stream}
                />
              </div>
            </div>
          </>
        ) : null} */}
      </div>
    </>
  );
}

export default MeetingPage;
