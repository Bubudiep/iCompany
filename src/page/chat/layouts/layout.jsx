import React from "react";
import "../../../assets/css/chat.css";

import RightSide from "../messages/RightSide";
import MainChatArea from "../messages/MainChatArea";
import LeftSide from "../messages/LeftSide";
const Chat_layout = () => {
  return (
    <div className="flex flex-1">
      {/*left side  */}
      <LeftSide />
      {/* Main Chat Area  */}
      <MainChatArea />

      {/* right side */}
      <RightSide />
    </div>
  );
};

export default Chat_layout;
