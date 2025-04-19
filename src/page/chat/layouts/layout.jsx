import React, { useEffect, useState } from "react";
import "../../../assets/css/chat.css";
import LeftSide from "../messages/LeftSide";
import { Outlet } from "react-router-dom";
import { message } from "antd";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
const Chat_layout = () => {
  const [chatList, setChatList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user.token) {
      console.error("No token found now. Redirect to login or show an error.");
      return;
    }
    const getChatList = () => {
      api
        .get("/chatbox/?page_size=99", user.token)

        .then((res) => {
          setChatList(res.results);
        })
        .catch((error) => {
          message.error("Error fetching chat list!");
          console.error("Error fetching chat list:", error);
        });
    };

    getChatList();
  }, [user.token]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftSide chatList={chatList} setChatList={setChatList} user={user} />
      <Outlet context={{ setChatList, chatList }} />
    </div>
  );
};

export default Chat_layout;
