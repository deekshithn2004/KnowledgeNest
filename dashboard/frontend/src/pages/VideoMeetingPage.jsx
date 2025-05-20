// frontend/src/pages/VideoMeetingPage.jsx
import React from 'react';

const VideoMeetingPage = () => {
  // Assuming your video SDK project is deployed at some URL
  const videoSdkUrl = process.env.REACT_APP_VIDEO_SDK_URL || 'http://localhost:3000/react-rtc-demo';
  
  return (
    <div className="w-full h-screen">
      <iframe 
        src={videoSdkUrl} 
        title="Video Meeting"
        className="w-full h-full border-none" 
        allow="camera; microphone; fullscreen; display-capture; autoplay"
      />
    </div>
  );
};

export default VideoMeetingPage;