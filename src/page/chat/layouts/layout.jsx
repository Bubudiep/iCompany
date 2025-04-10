import React, { useEffect, useState } from "react";
import "../../../assets/css/chat.css";
// import RightSide from "../messages/RightSide";
// import MainChatArea from "../messages/MainChatArea";
import LeftSide from "../messages/LeftSide";
import { Outlet } from "react-router-dom";
import { message } from "antd";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
const Chat_layout = () => {
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
  }, []); // Thêm token vào dependency array

  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftSide chatList={chatList} user={user} />
      <Outlet context={{ setChatList,chatList }} />
    </div>
  );
};

export default Chat_layout;
