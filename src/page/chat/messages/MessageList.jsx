import React, { useState } from "react";
import { Avatar, Spin, Tooltip, Button } from "antd";
import { FaThumbtack, FaReply, FaEllipsisH } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { BsPinAngleFill } from "react-icons/bs";
import { RiUnpinFill } from "react-icons/ri";

const MessageList = ({
  messages,
  //   filteredMessages,
  loadingOlder,
  user,
  isGroupChat,
  receiver,
  pinnedMessages,
  handleLikeMessage,
  handleReplyMessage,
  handleMoreActions,
  handlePinMessage,
  getSenderName,
  getTimeDisplay,
}) => {
  const all_message = messages?.message?.data || [];
  // Trạng thái cho tìm kiếm tin nhắn
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(all_message);
  return (
    <>
      {/* Loading older messages */}
      {loadingOlder && (
        <div className="flex justify-center py-2">
          <Spin />
        </div>
      )}

      {/* Thông báo khi không có tin nhắn */}
      {messages?.message?.total === 0 && (
        <div className="flex justify-center my-4">
          <p className="text-gray-500 text-sm">
            Hãy nhắn gì đó để bắt đầu cuộc trò chuyện...
          </p>
        </div>
      )}
      {/* // http://localhost:5175/app/operators */}

      {/* Danh sách tin nhắn */}
      {filteredMessages
        .map((msg) => ({
          ...msg,
          type: msg.isAction ? "system" : "message",
          sender_username: getSenderName(msg.sender),
        }))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((item, index) => {
          if (item.type === "system") {
            const isPinAction = item.message.includes("Ghim tin nhắn");
            const isUnpinAction = item.message.includes("Bỏ ghim tin nhắn");

            return (
              <div key={item.id} className="flex justify-center my-2">
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
                  {isPinAction && (
                    <BsPinAngleFill
                      className="text-yellow-500 mr-2"
                      size={12}
                    />
                  )}
                  {isUnpinAction && (
                    <RiUnpinFill className="text-yellow-500 mr-2" size={12} />
                  )}
                  <span>
                    {item.sender === user.id
                      ? "Bạn"
                      : getSenderName(item.sender)}{" "}
                    {item.message}
                  </span>
                </div>
              </div>
            );
          }

          /* Tin nhắn */
          const message = item;
          const repliedMessage = message.reply_to
            ? filteredMessages.find((msg) => msg.id === message.reply_to)
            : null;

          return (
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
              <div className="relative group">
                <div
                  className={`p-2 mx-2 rounded-lg max-w-xs ${
                    message.sender === user.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } ${
                    searchTerm &&
                    message.message
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                      ? "border border-yellow-500"
                      : ""
                  }`}
                >
                  {isGroupChat && message.sender !== user.id && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {message.sender_username}
                    </p>
                  )}
                  {message.reply_to && repliedMessage && (
                    <div className="border-l-4 border-blue-400 pl-2 mb-2 bg-blue-50 rounded-r">
                      <p className="text-xs font-semibold text-blue-600">
                        Trả lời{" "}
                        {repliedMessage.sender === user.id
                          ? "bạn"
                          : repliedMessage.sender_username || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        {repliedMessage.message.length > 50
                          ? repliedMessage.message.slice(0, 50) + "..."
                          : repliedMessage.message}
                      </p>
                    </div>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <span className="text-xs">
                    {getTimeDisplay(
                      message.created_at || new Date().toISOString()
                    )}
                  </span>
                </div>
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 ${
                    message.sender === user.id
                      ? "left-0 -ml-25"
                      : "right-0 -mr-25"
                  } flex space-x-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  <Tooltip title="Thích">
                    <AiOutlineLike
                      className="text-gray-600 cursor-pointer hover:text-blue-500"
                      onClick={() => handleLikeMessage(message)}
                    />
                  </Tooltip>
                  <Tooltip title="Trả lời">
                    <FaReply
                      className="text-gray-600 cursor-pointer hover:text-blue-500"
                      onClick={() => handleReplyMessage(message)}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      pinnedMessages.some((msg) => msg.id === message.id)
                        ? "Bỏ ghim"
                        : "Ghim tin nhắn"
                    }
                  >
                    <FaThumbtack
                      className={`cursor-pointer ${
                        pinnedMessages.some((msg) => msg.id === message.id)
                          ? "text-yellow-500"
                          : "text-gray-600"
                      } hover:text-yellow-500`}
                      onClick={() => handlePinMessage(message)}
                    />
                  </Tooltip>
                  <Tooltip title="More actions">
                    <FaEllipsisH
                      className="text-gray-600 cursor-pointer hover:text-blue-500"
                      onClick={() => handleMoreActions(message)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default MessageList;
