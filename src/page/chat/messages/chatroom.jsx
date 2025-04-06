import React, { useEffect, useState } from "react";
import MainChatArea from "./MainChatArea";
import RightSide from "./RightSide";
import { useParams } from "react-router-dom";
import { Empty } from "antd";
import { useUser } from "../../../components/context/userContext";
import api from "../../../components/api";

const Chat_room = () => {
  const { id_room } = useParams();
  const [messages, setMessages] = useState(null);
  const { user } = useUser();
  const fetchMessages = () => {
    if (id_room)
      api
        .get(`/chatbox/${id_room}`, user.token)
        .then((response) => {
          setMessages(response);
        })
        .catch((error) => {
          console.error(error);
        });
  };
  useEffect(() => {
    fetchMessages();
  }, [id_room]);
  return (
    <div className="flex flex-1">
      {id_room ? (
        messages !== null ? (
          <>
            <MainChatArea messages={messages} />
            {/* <RightSide /> */}
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <Empty description="Chọn một phòng chat" />
          </div>
        )
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <Empty description="Chọn một phòng chat" />
        </div>
      )}
    </div>
  );
};

export default Chat_room;
