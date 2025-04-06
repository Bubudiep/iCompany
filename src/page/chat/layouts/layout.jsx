import React from "react";
import "../../../assets/css/chat.css";

import RightSide from "../messages/RightSide";
import MainChatArea from "../messages/MainChatArea";
import LeftSide from "../messages/LeftSide";
import { Outlet } from "react-router-dom";
const Chat_layout = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftSide />
      <Outlet />
    </div>
  );
};

export default Chat_layout;
