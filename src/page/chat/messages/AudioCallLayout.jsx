import React, { useState, useEffect } from "react";
import { Avatar, Button } from "antd";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
  FaUser,
} from "react-icons/fa";

const AudioCallLayout = ({ receiver, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Giao diện chính (màn hình lớn) */}
      <div className="hidden md:flex flex-col items-center justify-between h-full w-full p-6">
        <div className="flex flex-col items-center">
          <Avatar
            size={120}
            src={
              receiver?.avatar ||
              "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            }
            className="mb-4"
          />
          <h3 className="text-xl font-semibold text-white">
            {receiver?.username || "User"}
          </h3>
          <p className="text-gray-400">{formatDuration(callDuration)}</p>
        </div>

        <div className="flex space-x-6">
          <Button
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={() => setIsMuted(!isMuted)}
            shape="circle"
            size="large"
            className={`text-white ${
              isMuted ? "bg-gray-600" : "bg-gray-500"
            } border-none`}
          />
          <Button
            icon={isVideoOn ? <FaVideo /> : <FaVideoSlash />}
            onClick={() => setIsVideoOn(!isVideoOn)}
            shape="circle"
            size="large"
            className="bg-gray-500 text-white border-none"
          />
          <Button
            icon={<FaUser />}
            shape="circle"
            size="large"
            className="bg-gray-500 text-white border-none"
          />
          <Button
            icon={<FaPhoneSlash />}
            onClick={onEndCall}
            shape="circle"
            size="large"
            className="bg-red-500 text-white border-none"
          />
        </div>
      </div>

      {/* Giao diện cho màn hình nhỏ (mobile) */}
      <div className="md:hidden flex flex-col items-center justify-between h-full w-full p-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center">
            <Avatar
              size={40}
              src={
                receiver?.avatar ||
                "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              }
              className="mr-2"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {receiver?.username || "User"}
              </h3>
              <p className="text-gray-400 text-sm">
                {formatDuration(callDuration)}
              </p>
            </div>
          </div>
          <p className="text-green-400 text-sm">Online</p>
        </div>

        <div className="flex space-x-4 mt-auto">
          <Button
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={() => setIsMuted(!isMuted)}
            shape="circle"
            size="large"
            className={`text-white ${
              isMuted ? "bg-gray-600" : "bg-gray-500"
            } border-none`}
          />
          <Button
            icon={isVideoOn ? <FaVideo /> : <FaVideoSlash />}
            onClick={() => setIsVideoOn(!isVideoOn)}
            shape="circle"
            size="large"
            className="bg-gray-500 text-white border-none"
          />
          <Button
            icon={<FaUser />}
            shape="circle"
            size="large"
            className="bg-gray-500 text-white border-none"
          />
          <Button
            icon={<FaPhoneSlash />}
            onClick={onEndCall}
            shape="circle"
            size="large"
            className="bg-red-500 text-white border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioCallLayout;
