import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge, Popover } from "antd";
import { FaUsers, FaThumbtack } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import ShowMoreModal from "../Functions/handleModal/ShowMoreModal";
import PopoverMore from "../Functions/handleModal/PopoverMore";

const ChatItem = ({ chat, user, getTimeDisplay }) => {
  const isGroupChat = chat.is_group;
  const chatName = isGroupChat
    ? chat.name
    : chat.members.find((member) => member.id !== user.id)?.username ||
      "Unknown";
  const chatAvatar = isGroupChat
    ? chat.avatar
    : chat.members.find((member) => member.id !== user.id)?.avatar ||
      "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg";
  const onAction = (item) => {
    console.log("Bạn chọn:", item);
    // tuỳ logic thực tế: ví dụ gọi API xóa, ẩn hội thoại, v.v.
  };
  return (
    <>
      <Link
        className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer relative group"
        to={`/app/chat/${chat.id}`}
      >
        <div className="relative">
          <Avatar size={40} src={chatAvatar} />
          {isGroupChat && (
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
              <FaUsers className="text-white" size={12} />
            </div>
          )}
        </div>
        <div className="ml-2 flex-1">
          <div className="font-bold flex items-center">
            {chatName}
            {isGroupChat && (
              <span className="ml-2 text-xs text-gray-500"></span>
            )}
          </div>
          <div className="text-sm overflow-hidden text-nowrap text-ellipsis">
            {chat.last_message?.sender === user.id && "Bạn: "}
            {chat.last_message?.message
              ? chat.last_message.message.length > 14
                ? chat.last_message.message.slice(0, 15) + "..."
                : chat.last_message.message
              : "Chưa có tin nhắn"}
          </div>
        </div>
        <div className="absolute top-0 right-0 flex flex-col items-end">
          <div className="relative w-30 h-6 flex items-center justify-end">
            <div className="text-sm text-gray-700 group-hover:hidden">
              {chat.last_message?.created_at
                ? getTimeDisplay(chat.last_message.created_at)
                : ""}
            </div>
            <PopoverMore onAction={onAction}>
              <div
                className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                <IoIosMore size={20} className="text-gray-900" />
              </div>
            </PopoverMore>
          </div>
          {chat.not_read > 0 && (
            <Badge
              count={chat.not_read > 9 ? "9+" : chat.not_read}
              offset={[-5, 1]}
              style={{ backgroundColor: "#ff4d4f" }}
            />
          )}
        </div>
        {chat.is_pinned && (
          <div className="absolute top-0 left-0">
            <FaThumbtack size={20} color="#ff4d4f" />
          </div>
        )}
      </Link>
    </>
  );
};

export default ChatItem;
