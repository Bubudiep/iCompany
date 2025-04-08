import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaUserFriends,
  FaCommentDots,
  FaBell,
  FaEllipsisH,
  FaHome,
} from "react-icons/fa";
import { Avatar, Badge, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";

const LeftSide = () => {
  const nav = useNavigate();
  const [chatList, setChatList] = useState([]);
  const { user } = useUser();

  // Lấy danh sách cuộc trò chuyện từ API
  useEffect(() => {
    // Kiểm tra xem có token hay không
    if (!user.token) {
      console.error("No token found now. Redirect to login or show an error.");
      // Chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo
      return;
    }
    const getChatList = () => {
      api
        .get("/chatbox/", user.token)
        .then((res) => {
          setChatList(res.results);
        })
        .catch((error) => {
          message.error("Error fetching chat list!");
          console.error("Error fetching chat list:", error);
        });
    };

    getChatList();
  }, [user.token, nav]); // Thêm token vào dependency array

  return (
    <div className="left-side bg-white w-1/5 flex flex-col border-r-1 border-gray-400 rounded-r-xl">
      <div className="flex items-center p-4">
        <Avatar
          alt="User Avatar"
          className="rounded-full"
          height="40"
          src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          width="40"
        />
        <span className="ml-2 text-xl font-bold">
          {localStorage.getItem("username")}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto border border-t border-gray-400 rounded-xl">
        <div className="flex p-2">
          <Input
            className="bg-gray-600 rounded"
            placeholder="Tìm kiếm cuộc trò chuyện"
            allowClear
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="p-2 text-xxl font-medium text-center">
          Danh sách cuộc trò chuyện: {chatList.length}
        </h2>
        <h1>
          {chatList === 0 &&
            "Không tìm thấy cuộc trò chuyện. Hãy bắt đầu 1 cuộc trò chuyện."}
        </h1>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">Ưu tiên</span>
            <span className="text-sm">Khác</span>
          </div>

          <div className="mt-2">
            {chatList.map((chat) => (
              <Link
                key={chat.id}
                className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer relative"
                to={`/app/chat/${chat.id}`}
              >
                <Avatar size={40} src={chat.avatar} />
                {/* Nội dung */}
                <div className="ml-2 flex-1">
                  <div className="font-bold">
                    {
                      chat.members.find((member) => member.id !== user.id)
                        .username
                    }
                  </div>
                  <div className="text-sm overflow-hidden text-nowrap text-ellipsis">
                    {chat.last_message?.sender === user.id && "Bạn: "}
                    {chat.last_message?.message.length > 14
                      ? chat.last_message?.message.slice(0, 15) + "..."
                      : chat.last_message?.message || "Chưa có tin nhắn"}
                  </div>
                </div>
                {/* Thời gian và Badge */}
                <div className="absolute top-0 right-0">
                  <div className="text-sm">
                    {app.timeSince(chat?.last_message?.created_at)}
                  </div>
                  {chat.not_read > 0 && (
                    <Badge count={chat.not_read} offset={[30, 5]} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Phần footer*/}
      <div className="p-2">
        <div className="flex items-center justify-between cursor-pointer text-xl">
          <FaHome onClick={() => nav("/")} />
          <FaCog onClick={() => nav("/settings")} />
          <FaUserFriends onClick={() => nav("/friends")} />
          {/* <FaCommentDots onClick={() => nav("/messages")} /> */}
          <FaBell onClick={() => nav("/notifications")} />
          <FaEllipsisH onClick={() => nav("/more")} />
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
