import React, { useEffect, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import clsx from "clsx";
import { RxCross2 } from "react-icons/rx";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { BiVideo, BiVideoOff } from "react-icons/bi";
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md";
import CopyToClipboard from "react-copy-to-clipboard";
import { MdOutlineCallEnd } from "react-icons/md";
import Peer from "simple-peer";
import io from "socket.io-client";
import { usePeer } from "../context/peer";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineMessage } from "react-icons/md";
import { RiShapesLine } from "react-icons/ri";
import { LiaUserLockSolid } from "react-icons/lia";
import Time from "../components/time";
function MeetingPage() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [name, setName] = useState("");
  const [shown, setShown] = useState(false);
  const [iscopied, setIsCopied] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMessaging, setIsMessaging] = useState(false);
  const connectionRef = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socket = io("http://localhost:9000");
  const {
    callEnded,
    setCallEnded,
    callAccepted,
    setCallAccepted,
    myVideo,
    userVideo,
    user,
    setIdToCall,
    idToCall,
    screenSharingVideos,
    setScreenSharingVideos,
    screenShareRef,
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

      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      window.history.replaceState(null, null, url);
      setIdToCall(id);
    });

    socket.on("userCalling", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on("muteChange", (data) => {
      setIsMute(data.isMute);
    });

    // Listen for screen sharing change events from other users
    socket.on("screenSharingChange", (data) => {
      setScreenSharing(data.isScreenSharing);
    });

    socket.on("receive", ({ message, name }) => {

      const isDuplicate = messages.some((msg) => msg.message === message && msg.name === name);

      if(!isDuplicate){
        setMessages((prevMessages) => {
          // Create a new array with the new message appended
          const updatedMessages = [...prevMessages, { message, name }];
          // Filter out any duplicate messages based on both message content and sender name
          const uniqueMessages = updatedMessages.filter((msg, index, self) =>
            index === self.findIndex((m) => m.message === msg.message && m.name === msg.name)
          );
          return uniqueMessages;
        });
      }
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    setShown(false);

    const newPeer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    newPeer.on("signal", (data) => {
      const signalData = {
        signal: data,
        to: caller,
        screenShareActive: screenSharing,
      };
      socket.emit("callAccepted", signalData);
    });

    newPeer.on("stream", (stream) => {
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

      // Broadcast the mute state change to all peers
      socket.emit("muteChange", { isMute: !isMute });
    }
  };
  const toggleVideoOn = () => {
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
      // userVideo.current.srcObject = stream;
      socket.emit("screenSharingChange", { isScreenSharing: true });
    });

    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.onended = () => {
      stopScreenSharing();
    };

    if (callAccepted && userVideo && myVideo) {
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
    }
  };

  const stopScreenSharing = () => {
    if (!screenSharing) return;

    setScreenSharingVideos([]);
    setScreenSharing(false);
    socket.emit("screenSharingChange", { isScreenSharing: false });
  };

  const toggleMessages = () => {
    {
      isMessaging ? setIsMessaging(false) : setIsMessaging(true);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("send",{message: newMessage, name: user.name});
      setNewMessage("");
    }
  };

  return (
    <>
      <div className="container flex flex-col h-screen w-screen">
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

        {userVideo && myVideo ? (
          <div className="video flex justify-evenly bg-zinc-900 p-10 
          w-screen gap-4 h-screen md:mt-0 ">
            <div
              id="screen-share-container"
              className={clsx({
                hidden: screenSharing === false,
                "w-max-fit h-min-fit flex md:items-center md:justify-center bg-black border-2 border-zinc-500 rounded-xl":
                  screenSharing === true,
              })}
            >
              {screenSharingVideos.map((video, index) => (
                <div key={index} className="h-min-fit w-min-fit">
                  {video}
                </div>
              ))}
            </div>

            <div
              className={clsx("flex gap-6  md:gap-3", {
                "flex-col  3xl:mt-24 items-center 3xl:w-2/6 lg:mt-14  ":
                  screenSharing === true,
                "flex-row": screenSharing === false,
                "3xl:w-screen md:w-full  justify-center": callAccepted === false,
                "3xl:w-8/12 justify-center md:w-full ": callAccepted === true,
              })}
            >
              <div className={clsx("relative ",
                    {
                      "md:w-full md:h-5/6 flex md:justify-center": callAccepted === false,

                    }
                  )}>
                <video
                  className={clsx(
                    "border-zinc-500 border-2 h-5/6  rounded-xl ",
                    {
                      "h-3/5": screenSharing === true,
                      "md:w-max-fit md:h-full ": callAccepted === false,
                      
                    }
                  )}
                  playsInline
                  ref={myVideo}
                  autoPlay
                />
                <img
                  src={user.picture}
                  className={clsx(
                    "absolute  w-40 h-40  rounded-full",
                    {
                      hidden: isVideoMuted === false,
                      "top-1/3"
                      : callAccepted === false,
                    }
                  )}
                  alt="User Image"
                />
                <div className="absolute bottom-0 h-max-fit left-10 lg:left-40 xl:left-96 flex items-center justify-start p-6 md:">
                  <h2 className="text-white ml-2 lg:text-xl">{user.name}</h2>
                </div>
              </div>

              {callAccepted && !callEnded && (
                <div>
                  <video
                    className={clsx(
                      "border-zinc-500 border-2 bg-black rounded-xl md:h-5/6",
                      {
                        "h-3/5": screenSharing === true,
                      }
                    )}
                    playsInline
                    ref={userVideo}
                    autoPlay
                  />
                </div>
              )}
            </div>

            <div
              className={clsx("MessagesDiv", {
                hidden: isMessaging === false,
                "w-1/5 h-full  bg-white rounded-lg p-3 ": isMessaging === true,
              })}
            >
              <div className="h-5/6  overflow-auto">
                {messages.map((msg, index) => (
                  <div key={index}>
                    <strong>{msg.name}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <div className=" h-20 flex   gap-3 items-center ">
                <input
                  type="text"
                  placeholder="Send a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="rounded-2xl h-10 bg-zinc-100 p-3"
                />
                <button className="text-zinc-600" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {shown && (
          <div
            className={clsx(
              "fixed top-0 left-0 w-full h-full flex justify-start items-end  bg-black bg-opacity-50 z-50",
              {
                hidden: callAccepted === true,
              }
            )}
          >
            <div className="bg-slate-100 h-4/3 w-full md:w-1/2 lg:w-1/3 p-6 m-10 rounded shadow-md">
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
                  <MdContentCopy
                    onClick={() => setShown(false)}
                    className="cursor-pointer h-6 text-zinc-700 w-10 mt-4"
                  />
                </CopyToClipboard>
              </div>
              <h6 className="text-zinc-600 text-md">
                People who use this code must get your permission before they
                can join.
              </h6>
            </div>
          </div>
        )}
        <div className="w-screen  flex items-center  
          justify-around gap-x-96  fixed bottom-0 bg-zinc-900  md:h-20 md:z-0  md:flex md:gap-x-0 xl:gap-x-80">
          <div className="">
            <Time />
          </div>

          <div className="flex  gap-4 pl-24">
            {isMute ? (
              <IoMdMicOff
                onClick={toggleMute}
                className="text-white bg-red-500 rounded-3xl p-2 h-10 3xl:h-12 3xl:w-12 3xl:rounded-5xl w-10 cursor-pointer 
              hover:drop-shadow-md hover:bg-red-600"
              />
            ) : (
              <IoMdMic
                onClick={toggleMute}
                className="text-white bg-zinc-600 rounded-3xl 3xl:h-12 3xl:w-12 3xl:rounded-5xl p-2 h-10 w-10 cursor-pointer 
              hover:drop-shadow-lg hover:bg-zinc-500"
              />
            )}
            {isVideoMuted ? (
              <BiVideoOff
                onClick={toggleVideoOn}
                className="text-white bg-red-500 rounded-3xl 3xl:h-12 3xl:w-12 3xl:rounded-5xl p-2 h-10 w-10 cursor-pointer
            hover:drop-shadow-md hover:bg-red-600"
              />
            ) : (
              <BiVideo
                onClick={toggleVideoOn}
                className="text-white bg-zinc-600 rounded-3xl 3xl:h-12 3xl:w-12 3xl:rounded-5xl p-2 h-10 w-10 cursor-pointer
            hover:drop-shadow-lg hover:bg-zinc-500 "
              />
            )}
            {screenSharing ? (
              <MdOutlineStopScreenShare
                onClick={stopScreenSharing}
                className="text-white bg-red-500 rounded-3xl 3xl:h-12 3xl:w-12 3xl:rounded-5xl p-2 h-10 w-10 cursor-pointer
            hover:drop-shadow-md hover:bg-red-600"
              />
            ) : (
              <MdOutlineScreenShare
                onClick={startScreenShare}
                className="text-white bg-zinc-600 rounded-3xl 3xl:h-12 3xl:w-12 3xl:rounded-5xl p-2 h-10 w-10 cursor-pointer
              hover:drop-shadow-lg hover:bg-zinc-500"
              />
            )}
            <MdOutlineCallEnd
              onClick={leaveCall}
              className="text-white bg-zinc-600 rounded-3xl p-2 3xl:h-12 3xl:w-12 3xl:rounded-5xl h-10 w-10 cursor-pointer
            hover:drop-shadow-lg hover:bg-zinc-500"
            />
          </div>
          <div className="SideIcons flex text-zinc-100 gap-4 ">
            <IoMdInformationCircleOutline className="h-6 w-6" />
            <MdOutlinePeopleAlt className="h-6 w-6" />
            <MdOutlineMessage onClick={toggleMessages} className="h-6 w-6" />
            <RiShapesLine className="h-6 w-6" />
            <LiaUserLockSolid className="h-6 w-6" />
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingPage;
