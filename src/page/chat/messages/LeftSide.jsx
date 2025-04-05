import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaUserFriends,
  FaCommentDots,
  FaBell,
  FaEllipsisH,
  FaHome,
} from "react-icons/fa";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../components/api";

const LeftSide = () => {
  const nav = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await api.get("/api/chatbox/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token
          },
        });
        setChatList(response.data); // Giả sử API trả về array trực tiếp
      } catch (error) {
        console.error("Error fetching chats:", error);
        // Xử lý lỗi (hiển thị thông báo)
      }
    };

    fetchChatList();
  }, []);

  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    // Hàm format thời gian
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours} giờ ${minutes}`;
  };

  return (
    <div className="left-side w-1/5 flex flex-col">
      {/*  header */}
      <div className="flex items-center p-4">
        <img
          alt="User Avatar"
          className="rounded-full"
          height="40"
          src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          width="40"
        />
        {/* user name of current user get from localstorage */}
        <span className="ml-2 text-xl font-bold">
          {localStorage.getItem("username")}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <div className="flex p-2">
          <input
            className="w-full p-2 rounded"
            placeholder="Tìm kiếm"
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">Ưu tiên</span>
            <span className="text-sm">Khác</span>
          </div>

          <div className="mt-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer"
                onClick={() => nav(`/chat/${chat.id}`)} // Thêm navigate
              >
                <img
                  alt={chat.name}
                  className="rounded-full"
                  height="40"
                  src={chat.avatar || "https://via.placeholder.com/40"}
                  width="40"
                />

                <div className="ml-2 flex-1">
                  <div className="font-bold">{chat.name}</div>
                  <div className="text-sm text-ellipsis overflow-hidden">
                    {chat.lastMessage?.sender === "you" && "Bạn: "}
                    {chat.lastMessage?.content || "Chưa có tin nhắn"}
                  </div>
                </div>

                <div className="ml-auto text-right">
                  <div className="text-sm">
                    {chat.lastMessage?.timestamp
                      ? formatTime(chat.lastMessage.timestamp)
                      : ""}
                  </div>
                  {chat.not_read > 0 && (
                    <Badge
                      count={chat.not_read}
                      offset={[10, 10]}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phần footer giữ nguyên */}
      <div className="p-2">
        <div className="flex items-center justify-between cursor-pointer text-xl">
          <FaHome onClick={() => nav("/")} />
          <FaCog onClick={() => nav("/settings")} />
          <FaUserFriends />
          <FaCommentDots />
          <FaBell />
          <FaEllipsisH />
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
