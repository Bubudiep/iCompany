import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import { FaPhone, FaVideo } from "react-icons/fa";
import { Avatar, Button, Input, message } from "antd";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import { IoInformationSharp } from "react-icons/io5";
import api from "../../../components/api";

const MainChatArea = ({
  messages,
  sendMessage,
  newMessage,
  setNewMessage,
  toggleRightSide,
}) => {
  const { user } = useUser();
  const all_message = messages?.message?.data || [];
  const chatEndRef = useRef(null); // Ref để cuộn xuống cuối

  console.log(all_message);
  // console.log(setNewMessage);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [all_message]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
      <div className="flex items-center justify-between bg-white !h-[60px] p-4 border-b">
        <div className="flex items-center">
          <Avatar
            // alt={messages.name}
            className="rounded-full"
            height="40"
            src={message.avatar || "img"}
            width="40"
          />
          <div className="ml-2">
            <h1 className="font-bold text-lg">
              {/* {localStorage.getItem("username")} */}
              User: {user.id}
            </h1>
            <div className="text-sm text-gray-500">Đang hoạt động</div>
            {/* {receiver.isOnline ? "Đang hoạt động" : "Offline"} */}
          </div>
        </div>
        <div className="flex items-center space-x-4 cursor-pointer">
          <FaPhone className="icon-hover" />
          <FaVideo className="icon-hover" />
          <IoInformationSharp
            size={24}
            className="icon-hover"
            onClick={toggleRightSide}
          />
        </div>
      </div>
      {/* Chat area */}
      <div className="flex flex-1 p-1 h-[80px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2">
          {all_message
            .slice() // Tạo một bản sao của mảng để tránh thay đổi trực tiếp
            .reverse() // Đảo ngược thứ tự tin nhắn
            .map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  message.sender === user.id ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== user.id && (
                  <Avatar
                    alt={message.sender}
                    src={message.sender_avatar || "img"}
                    className="mr-2"
                  />
                )}
                <div
                  className={`p-2 mx-2 rounded-lg max-w-xs relative group ${
                    message.sender === user.id
                      ? "bg-blue-500 text-white" // Style cho tin nhắn của mình
                      : "bg-gray-200 text-black" // Style cho tin nhắn người khác
                  }`}
                >
                  <p>{message.message}</p>
                  {/* {index === all_message.length - 1 ? ( */}
                  <span className="text-xs">
                    {app.timeSince(message.created_at)}
                  </span>
                  {/* ) : (
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {app.timeSince(message.created_at)}
                    </span>
                  )} */}
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
    </div>
  );
};

export default MainChatArea;
