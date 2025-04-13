import React, { useEffect, useState } from "react";
import MainChatArea from "./MainChatArea";
import RightSide from "./RightSide";
import { useOutletContext, useParams } from "react-router-dom";
import { Empty, Spin } from "antd";
import { useUser } from "../../../components/context/userContext";
import api from "../../../components/api";

const Chat_room = () => {
  const { setChatList } = useOutletContext();
  const { id_room } = useParams();
  const [messages, setMessages] = useState({
    id: null,
    not_read: 0,
    message: { total: 0, data: [] },
    members: [],
  });
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [showRightSide, setShowRightSide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null); // Lưu URL của trang tiếp theo

  const fetchMessages = async () => {
    if (id_room) {
      setLoading(true);
      try {
        const response = await api.get(`/chatbox/${id_room}`, user.token);
        const responseData = response.data || response;
        setChatList((old) =>
          old.map((item) =>
            item.id === parseInt(id_room) ? { ...item, not_read: 0 } : item
          )
        );
        setMessages({
          id: responseData.id || null,
          not_read: responseData.not_read || 0,
          message: {
            total: responseData.message?.total || 0,
            data: responseData.message?.data || [],
          },
          members: responseData.members || [],
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages({
          id: null,
          not_read: 0,
          message: { total: 0, data: [] },
          members: [],
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchOlderMessages = async (lastId) => {
    if (id_room && lastId && !loadingOlder) {
      setLoadingOlder(true);
      try {
        // Nếu có nextPageUrl, sử dụng nó; nếu không, gọi API với last_id
        const url =
          nextPageUrl ||
          `/message/?room_id=${id_room}&last_id=${lastId}&page_size=30`;
        const response = await api.get(url, user.token);
        const responseData = response.data || response;
        console.log("Raw response from fetchOlderMessages:", responseData);

        // Lấy danh sách tin nhắn từ results
        let olderMessages = [];
        if (responseData && Array.isArray(responseData.results)) {
          olderMessages = responseData.results;
        } else {
          console.warn("Results is not an array:", responseData);
          olderMessages = [];
        }

        // Lưu URL của trang tiếp theo
        setNextPageUrl(responseData.next || null);
        console.log("Older messages fetched:", olderMessages);

        // Loại bỏ tin nhắn trùng lặp dựa trên id
        setMessages((prevMessages) => {
          const existingIds = new Set(
            prevMessages.message.data.map((msg) => msg.id)
          );
          const newMessages = olderMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );

          return {
            ...prevMessages,
            message: {
              ...prevMessages.message,
              data: [...newMessages, ...prevMessages.message.data],
            },
          };
        });
      } catch (error) {
        console.error("Error fetching older messages:", error);
      } finally {
        setLoadingOlder(false);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    setNextPageUrl(null); // Reset nextPageUrl khi chuyển phòng chat
  }, [id_room]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const response = await api.post(
          `/chatbox/${id_room}/chat/`,
          { message: newMessage },
          user.token
        );
        console.log("Sent message response:", response);
        const responseData = response.data || response;

        if (!responseData || typeof responseData !== "object") {
          throw new Error("Invalid response format from sendMessage API");
        }

        setChatList((old) =>
          old.map((item) =>
            item.id === parseInt(id_room)
              ? { ...item, not_read: 0, last_message: responseData }
              : item
          )
        );

        const newSentMessage = {
          id: responseData.id || Date.now(),
          message: responseData.message || newMessage,
          sender: user.id,
          created_at: responseData.created_at || new Date().toISOString(),
          attachment: responseData.attachment || null,
          socket_sended: responseData.socket_sended || false,
          room: parseInt(id_room),
          reply_to: responseData.reply_to || null,
          mention_users: responseData.mention_users || [],
        };

        setMessages((prevMessages) => {
          const updatedMessages = {
            ...prevMessages,
            message: {
              ...prevMessages.message,
              total: prevMessages.message.total + 1,
              data: [...prevMessages.message.data, newSentMessage],
            },
          };
          console.log("Updated messages in sendMessage:", updatedMessages);
          console.log("New sent message:", newSentMessage);
          return updatedMessages;
        });

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-1">
      {id_room ? (
        loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : messages.message.data.length > 0 || messages !== null ? (
          <>
            <MainChatArea
              messages={messages}
              sendMessage={sendMessage}
              fetchOlderMessages={fetchOlderMessages}
              loadingOlder={loadingOlder}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              toggleRightSide={() => setShowRightSide(!showRightSide)}
            />
            {showRightSide && <RightSide />}
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <Empty description="Chưa có tin nhắn trong phòng chat này" />
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
