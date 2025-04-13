import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import { FaPhone, FaVideo } from "react-icons/fa";
import { Avatar, Spin } from "antd";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import { IoInformationSharp } from "react-icons/io5";
import AudioCallLayout from "./AudioCallLayout"; // Import layout gọi audio
import VideoCallLayout from "./VideoCallLayout"; // Import layout gọi video
import { IoIosList } from "react-icons/io";

const MainChatArea = ({
  messages,
  sendMessage,
  fetchOlderMessages,
  loadingOlder,
  newMessage,
  setNewMessage,
  toggleRightSide,
}) => {
  const { user } = useUser();
  const all_message = messages?.message?.data || [];
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);

  // Trạng thái để hiển thị layout gọi audio/video
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const receiver = messages?.members?.find((member) => member.id !== user.id);

  useEffect(() => {
    console.log("All messages in MainChatArea:", all_message);
    console.log("Last message:", all_message[all_message.length - 1]);
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [all_message.length]);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container.scrollTop === 0 && !loadingOlder && all_message.length > 0) {
      const minId = Math.min(...all_message.map((msg) => msg.id));
      setLastScrollHeight(container.scrollHeight);
      fetchOlderMessages(minId);
    }
  };

  useEffect(() => {
    if (loadingOlder) return;

    const container = chatContainerRef.current;
    if (container && lastScrollHeight) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - lastScrollHeight;
      setLastScrollHeight(0);
    }
  }, [all_message, loadingOlder]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const getTimeDisplay = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    if (diffInSeconds < 10) {
      return "vừa xong";
    }

    return app.timeSince(timestamp);
  };

  // Hàm để bắt đầu/kết thúc cuộc gọi audio
  const handleAudioCall = () => {
    console.log("Audio call button clicked");
    setIsAudioCallActive(true);
    console.log("isAudioCallActive set to:", true);
  };

  const handleEndAudioCall = () => {
    console.log("Ending audio call");
    setIsAudioCallActive(false);
    console.log("isAudioCallActive set to:", false);
  };

  // Hàm để bắt đầu/kết thúc cuộc gọi video
  const handleVideoCall = () => {
    console.log("Video call button clicked");
    setIsVideoCallActive(true);
    console.log("isVideoCallActive set to:", true);
  };

  const handleEndVideoCall = () => {
    console.log("Ending video call");
    setIsVideoCallActive(false);
    console.log("isVideoCallActive set to:", false);
  };

  // Log trạng thái để debug
  useEffect(() => {
    console.log("Current isAudioCallActive:", isAudioCallActive);
    console.log("Current isVideoCallActive:", isVideoCallActive);
  }, [isAudioCallActive, isVideoCallActive]);
  return (
    <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
      <div className="flex items-center justify-between bg-white !h-[60px] p-4 border-b">
        <div className="flex items-center">
          <Avatar
            className="rounded-full"
            size={40}
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          />
          <div className="ml-2">
            <h1 className="font-bold text-lg">
              {receiver?.username || "User"}
            </h1>
            <div className="text-sm text-gray-500">Đang hoạt động</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 cursor-pointer">
          <FaPhone className="icon-hover" onClick={handleAudioCall} />
          <FaVideo className="icon-hover" onClick={handleVideoCall} />
          <IoIosList className="icon-hover" onClick={toggleRightSide} />
        </div>
      </div>
      <div className="flex flex-1 p-1 overflow-hidden">
        <div
          className="flex-1 overflow-y-auto p-2"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {loadingOlder && (
            <div className="flex justify-center py-2">
              <Spin />
            </div>
          )}
          {all_message
            .sort((a, b) => a.id - b.id)
            .filter(
              (message) =>
                message && typeof message === "object" && "sender" in message
            )
            .map((message, index) => (
              <div
                key={message.id || index}
                className={`flex mb-4 ${
                  message.sender === user.id ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== user.id && (
                  <Avatar
                    alt={message.sender.toString()}
                    src={
                      message.sender_avatar ||
                      "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                    }
                    className="mr-2"
                  />
                )}
                <div
                  className={`p-2 mx-2 rounded-lg max-w-xs relative group ${
                    message.sender === user.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{message.message}</p>
                  <span className="text-xs">
                    {getTimeDisplay(
                      message.created_at || new Date().toISOString()
                    )}
                  </span>
                </div>
              </div>
            ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={sendMessage}
        onKeyDown={handleKeyDown}
      />

      {/* Hiển thị layout gọi audio nếu đang active */}
      {isAudioCallActive ? (
        <AudioCallLayout receiver={receiver} onEndCall={handleEndAudioCall} />
      ) : (
        console.log("AudioCallLayout not rendered")
      )}

      {/* Hiển thị layout gọi video nếu đang active */}
      {isVideoCallActive ? (
        <VideoCallLayout receiver={receiver} onEndCall={handleEndVideoCall} />
      ) : (
        console.log("VideoCallLayout not rendered")
      )}
    </div>
  );
};

export default MainChatArea;
