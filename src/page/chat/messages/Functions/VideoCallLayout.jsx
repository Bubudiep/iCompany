import React, { useState, useEffect } from "react";
import { Avatar, Button } from "antd";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo as FaVideoOn,
  FaVideoSlash,
  FaPhoneSlash,
  FaUser,
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 ml-auto mr-auto m-30 w-3/5">
      {/* Giao diện chính (màn hình lớn) */}
      <div className="hidden md:flex flex-col items-center justify-between h-full w-4/4 p-6">
        {/* Video của người nhận (giả lập) */}
        <div className="flex-1 flex items-center justify-center w-full h-full">
          {isCameraOff ? (
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
          ) : (
            <>
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Avatar
                  size={500}
                  src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                />
                {/* <span className="text-white text-lg">
                  Video của {receiver?.username || "User"} (giả lập)
                </span> */}
              </div>
            </>
          )}
        </div>

        {/* Video của người gọi (giả lập, hiển thị nhỏ ở góc) */}
        <div className="absolute bottom-20 right-6 w-40 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
          {isCameraOff ? (
            <Avatar
              size={60}
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            />
          ) : (
            <>
              {/* <span className="text-white text-sm">Video của bạn (giả lập)</span> */}
              <Avatar
                size={60}
                src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              />
            </>
          )}
        </div>

        {/* Nút điều khiển */}
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
            icon={isCameraOff ? <FaVideoSlash /> : <FaVideoOn />}
            onClick={() => setIsCameraOff(!isCameraOff)}
            shape="circle"
            size="large"
            className={`text-white ${
              isCameraOff ? "bg-gray-600" : "bg-gray-500"
            } border-none`}
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
        {/* Thông tin cuộc gọi */}
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

        {/* Video của người nhận (giả lập) */}
        <div className="flex-1 flex items-center justify-center w-full h-full">
          {isCameraOff ? (
            <Avatar
              size={80}
              src={
                receiver?.avatar ||
                "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-white text-sm">
                Video của {receiver?.username || "User"} (giả lập)
              </span>
            </div>
          )}
        </div>

        {/* Video của người gọi (giả lập, hiển thị nhỏ ở góc) */}
        <div className="absolute bottom-20 right-4 w-24 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
          {isCameraOff ? (
            <Avatar
              size={40}
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            />
          ) : (
            <span className="text-white text-xs">Video của bạn (giả lập)</span>
          )}
        </div>

        {/* Nút điều khiển */}
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
            icon={isCameraOff ? <FaVideoSlash /> : <FaVideoOn />}
            onClick={() => setIsCameraOff(!isCameraOff)}
            shape="circle"
            size="large"
            className={`text-white ${
              isCameraOff ? "bg-gray-600" : "bg-gray-500"
            } border-none`}
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

export default VideoCallLayout;
