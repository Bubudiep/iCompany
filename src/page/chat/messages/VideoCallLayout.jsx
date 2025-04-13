import React, { useState, useEffect } from "react";
import { Avatar, Button } from "antd";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo as FaVideoOn,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const VideoCallLayout = ({ receiver, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false); // Trạng thái micro
  const [isCameraOff, setIsCameraOff] = useState(false); // Trạng thái camera
  const [callDuration, setCallDuration] = useState(0); // Thời gian cuộc gọi

  // Tính thời gian cuộc gọi
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-300 flex flex-col items-center justify-center z-50">
      <div className="relative w-full h-full flex flex-col">
        {/* Video của người nhận (giả lập) */}
        <div className="flex-1 flex items-center justify-center bg-gray-400">
          {isCameraOff ? (
            <Avatar
              size={120}
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <span>Video của {receiver?.username || "User"} (giả lập)</span>
            </div>
          )}
        </div>

        {/* Video của người gọi (giả lập, hiển thị nhỏ ở góc) */}
        <div className="absolute bottom-4 right-4 w-40 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
          {isCameraOff ? (
            <Avatar
              size={60}
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            />
          ) : (
            <span className="text-white">Video của bạn (giả lập)</span>
          )}
        </div>

        {/* Thông tin cuộc gọi */}
        <div className="absolute top-4 left-4 text-white">
          <h3 className="text-lg font-semibold">
            {receiver?.username || "User"}
          </h3>
          <p>{formatDuration(callDuration)}</p>
        </div>

        {/* Nút điều khiển */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <Button
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={() => setIsMuted(!isMuted)}
            shape="circle"
            size="large"
            type={isMuted ? "default" : "primary"}
          />
          <Button
            icon={isCameraOff ? <FaVideoSlash /> : <FaVideoOn />}
            onClick={() => setIsCameraOff(!isCameraOff)}
            shape="circle"
            size="large"
            type={isCameraOff ? "default" : "primary"}
          />
          <Button
            icon={<FaPhoneSlash />}
            onClick={onEndCall}
            shape="circle"
            size="large"
            danger
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCallLayout;
