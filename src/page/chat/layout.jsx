import React from "react";
import "../../assets/css/chat.css";

import RightSide from "../../components/messages/RightSide";
import MainChatArea from "../../components/messages/MainChatArea";
import LeftSide from "../../components/messages/LeftSide";
const Chat_layout = () => {
  return (
    <div className="flex flex-1 gap-1 pb-1">
      <LeftSide />
      <MainChatArea />
      <RightSide />
    </div>
  );
};

export default Chat_layout;
