import React from "react";

const ScreenShareVideo = ({ stream }) => {
  return (
    <video
      className="w-full h-full object-cover"
      playsInline
      autoPlay
      muted // Screen share stream should be muted to prevent echo
      ref={(ref) => {
        if (ref) ref.srcObject = stream;
      }}
    />
  );
};

export default ScreenShareVideo;
