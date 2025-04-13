import React, { useState, useEffect } from "react";
import { Avatar, Button } from "antd";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";

const AudioCallLayout = ({ receiver, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false); // Trạng thái micro
  const [callDuration, setCallDuration] = useState(0); // Thời gian cuộc gọi

  // Tính thời gian cuộc gọi
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp khi component unmount
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Cuộc gọi âm thanh</h2>
        <Avatar
          size={80}
          src={
            receiver?.avatar ||
            "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          }
          className="mb-4"
        />
        <h3 className="text-lg font-semibold">
          {receiver?.username || "User"}
        </h3>
        <p className="text-gray-500 mb-6">{formatDuration(callDuration)}</p>
        <div className="flex justify-center space-x-4">
          <Button
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={() => setIsMuted(!isMuted)}
            shape="circle"
            size="large"
            type={isMuted ? "default" : "primary"}
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

export default AudioCallLayout;
