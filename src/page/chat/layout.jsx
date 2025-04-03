import React from "react";
import "../../assets/css/chat.css";

import RightSide from "../../components/messages/RightSide";
import MainChatArea from "../../components/messages/MainChatArea";
import LeftSide from "../../components/messages/LeftSide";
const Chat_layout = () => {
  return (
    <>
      {/*left side  */}
      <LeftSide />
      {/* Main Chat Area  */}
      <MainChatArea />

      {/* right side */}
      <RightSide />
    </>
  );
};

export default Chat_layout;
