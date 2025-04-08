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
  const [newMessage, setNewMessage] = useState("");
  const [showRightSide, setShowRightSide] = useState(false);

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
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      try {
        // Call API to send message
        const response = api.post(
          `/chatbox/${id_room}/chat/`,
          {
            message: newMessage,
          },
          user.token
        );
        // Sau khi gửi thành công, fetch lại toàn bộ tin nhắn
        fetchMessages();
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  return (
    <div className="flex flex-1">
      {id_room ? (
        messages !== null ? (
          <>
            <MainChatArea
              messages={messages}
              sendMessage={sendMessage}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              toggleRightSide={() => setShowRightSide(!showRightSide)}
            />
            {showRightSide && <RightSide />}
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
