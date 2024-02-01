import React, {
  useState,
  useRef,
} from "react";
const PeerContext = React.createContext(null);
export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef({});
  const userVideo = useRef({});
  const connectionRef = useRef();
  const [user,setUser] = useState({name:null,picture:null})

  return (
    <PeerContext.Provider
      value={{
        me,
        // socket,
        setMe,
        stream,
        setStream,
        receivingCall,
        setReceivingCall,
        caller,
        setCaller,
        callerName,
        setCallerName,
        callerSignal,
        setCallerSignal,
        callAccepted,
        setCallAccepted,
        idToCall,
        setIdToCall,
        callEnded,
        setCallEnded,
        name,
        setName,
        myVideo,
        userVideo,
        connectionRef,
        user,
        setUser,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};