import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { FaPhone, FaVideo, FaSearch, FaEllipsisH } from "react-icons/fa";
import { Avatar, Button, Input, message } from "antd";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import { all } from "axios";

const MainChatArea = ({ messages }) => {
  const { user } = useUser();
  const all_message = messages?.message?.data || [];
  const chatEndRef = useRef(null); // Ref để cuộn xuống cuối

  console.log(all_message);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [all_message]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };
  const handleSend = () => {};
  return (
    <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
      <div className="flex items-center justify-between bg-white !h-[60px] p-4 border-b">
        <div className="flex items-center">
          <Avatar
            alt={messages.sender}
            className="rounded-full"
            height="40"
            src={message.avatar || "img"}
            width="40"
          />
          <div className="ml-2">
            <h1 className="font-bold text-lg">
              {localStorage.getItem("username")}
            </h1>
            <div className="text-sm text-gray-500">
              {all_message.length} tin nhắn
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center space-x-4">
          <FaPhone className="icon-hover" />
          <FaVideo className="icon-hover" />
          <FaSearch className="icon-hover" />
          <FaEllipsisH className="icon-hover" />
        </div>
      </div>
      <div className="flex flex-1 p-1 h-[80px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2">
          {all_message.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.sender === 1 ? "justify-end" : "justify-start"
              }`}
            >
              <p>{message.sender === 1 ? "" : "Other"}</p>
              {message.sender !== 1 && (
                <Avatar
                  alt={message.sender_name}
                  src={message.sender_avatar || "img"}
                  className="mr-4"
                />
              )}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <p>{message.message}</p>
                <span className="text-xs text-gray-500">
                  {app.timeSince(message.created_at)}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <MessageInput
      // value={newMessage}
      // onChange={(e) => setNewMessage(e.target.value)}
      // onSend={sendMessage}
      // onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default MainChatArea;
