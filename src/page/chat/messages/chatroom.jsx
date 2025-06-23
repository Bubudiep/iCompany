import React, { useEffect, useState } from "react";
import MainChatArea from "./Main/MainChatArea";
import RightSide from "./Right/RightSide";
import { useOutletContext, useParams } from "react-router-dom";
import { Empty, Spin } from "antd";
import { useUser } from "../../../components/context/userContext";
import api from "../../../components/api";

const Chat_room = () => {
  const { setChatList } = useOutletContext();
  const { id_room } = useParams();
  // const [messages, setMessages] = useState("");
  const [messages, setMessages] = useState({
    id: null,
    not_read: 0,
    message: { total: 0, data: [] },
    ghim: [],
    admin: [],
    avatar: null,
    company: null,
    created_at: null,
    host: null,
    is_group: false,
    last_have_message_at: null,
    members: [],
    members_add_members: false,
    members_change_avatar: false,
    members_change_name: false,
    members_remove_members: false,
    name: "",
  });
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [showRightSide, setShowRightSide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const fetchMessages = async () => {
    if (id_room) {
      setLoading(true);
      try {
        const response = await api.get(`/chatbox/${id_room}/`, user.token);
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
          ghim: responseData.ghim || [],
          admin: responseData.admin || [],
          avatar: responseData.avatar || null,
          company: responseData.company || null,
          created_at: responseData.created_at || null,
          host: responseData.host || null,
          is_group: responseData.is_group || false,
          last_have_message_at: responseData.last_have_message_at || null,
          members: responseData.members || [],
          members_add_members: responseData.members_add_members || false,
          members_change_avatar: responseData.members_change_avatar || false,
          members_change_name: responseData.members_change_avatar || false,
          members_remove_members: responseData.members_remove_members || false,
          name: responseData.name || "",
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
        const url =
          nextPageUrl ||
          `/message/?room_id=${id_room}&last_id=${lastId}&page_size=30`;
        const response = await api.get(url, user.token);
        console.log("Raw API response from fetchOlderMessages:", response);

        // API /message/ trả về cấu trúc: { total, next, results }
        const responseData = response || {};
        const olderMessages = Array.isArray(responseData.results)
          ? responseData.results
          : [];

        // Kiểm tra xem tin nhắn có thuộc đoạn chat hiện tại không
        const filteredMessages = olderMessages.filter(
          (msg) => msg.room === parseInt(id_room)
        );

        // Lưu URL của trang tiếp theo, should be https://vieclamvp.vn/api/message/?last_id=173&page=2&page_size=30&room_id=1
        // Lưu URL của trang tiếp theo, thay thế http thành https
        const nextUrl = responseData.next
          ? responseData.next.replace("http://", "https://")
          : null;
        setNextPageUrl(nextUrl);

        // Loại bỏ tin nhắn trùng lặp và cập nhật messages
        setMessages((prevMessages) => {
          const existingIds = new Set(
            prevMessages.message.data.map((msg) => msg.id)
          );
          const newMessages = filteredMessages.filter(
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
          return updatedMessages;
        });

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // console.log("messages.message.data:", messages?.message?.data);

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
              setMessages={setMessages}
              sendMessage={sendMessage}
              fetchOlderMessages={fetchOlderMessages}
              loadingOlder={loadingOlder}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              toggleRightSide={() => setShowRightSide(!showRightSide)}
            />
            {showRightSide && (
              <RightSide
                members={messages?.members}
                isGroupChat={messages?.is_group}
                chatName={messages?.name}
                avatar={messages?.avatar_base64}
                host={messages?.host}
                company={messages?.company}
                created_at={messages?.created_at}
                ghim={messages.ghim}
              />
            )}
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
