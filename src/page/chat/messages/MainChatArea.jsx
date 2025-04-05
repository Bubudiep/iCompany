import React, { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { FaPhone, FaVideo, FaSearch, FaEllipsisH } from "react-icons/fa";
import api from "../../../components/api";
import { formatTimeStr } from "antd/es/statistic/utils";

const MainChatArea = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin chatbox - giả sử API trả về như mẫu bạn cung cấp
        const chatResponse = await api.get(`/api/chatbox/${chatId}/`);
        setChatInfo(chatResponse.data);

        // Nếu có last_message, thêm vào danh sách tin nhắn
        if (chatResponse.data.last_message) {
          setMessages([formatMessage(chatResponse.data.last_message)]);
        }

        // Lấy lịch sử tin nhắn
        const messagesResponse = await api.get(
          `/api/messages/?chatbox=${chatId}`
        );
        setMessages((prev) => [
          ...messagesResponse.data.results.map(formatMessage),
          ...prev,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (chatId) {
      fetchData();
    }
  }, [chatId]);

  // Format tin nhắn từ API thành định dạng component cần
  const formatMessage = (msg) => ({
    id: msg.id,
    content: msg.message || msg.content, // Sử dụng trường 'message' hoặc 'content' tùy API
    timestamp: msg.created_at || new Date().toISOString(),
    // sender: msg.sender_id === currentUserId ? "current_user" : "other",
    sender_name: msg.sender_name || "Unknown",
    sender_avatar: msg.sender_avatar || "https://via.placeholder.com/40",
  });

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post("/api/messages/", {
        chatbox: chatId,
        message: newMessage, // Hoặc 'content' tùy API
      });

      setMessages((prev) => [...prev, formatMessage(response.data)]);
      setNewMessage("");

      // Cập nhật last_message trong chatInfo
      setChatInfo((prev) => ({
        ...prev,
        last_message: response.data,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ... (giữ nguyên các hàm handleKeyDown, scrollToBottom, formatTime)

  if (!chatInfo)
    return (
      <div className="flex-1 flex items-center justify-center">Loading...</div>
    );

  // Lấy thông tin hiển thị từ chatInfo
  const getDisplayInfo = () => {
    if (!chatInfo.members || chatInfo.members.length === 0) {
      return { name: "Unknown Chat", membersCount: 0 };
    }

    // Nếu là chat 1-1, hiển thị tên thành viên còn lại
    if (chatInfo.members.length === 1) {
      return {
        name: chatInfo.members[0].cardID || "User",
        membersCount: 1,
      };
    }

    // Nếu là nhóm, hiển thị tên nhóm hoặc danh sách thành viên
    return {
      name: chatInfo.name || `Group (${chatInfo.members.length})`,
      membersCount: chatInfo.members.length,
    };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <img
            alt={displayInfo.name}
            className="rounded-full"
            height="40"
            src={chatInfo.avatar || "https://via.placeholder.com/40"}
            width="40"
          />
          <div className="ml-2">
            <div className="font-bold">{displayInfo.name}</div>
            <div className="text-sm text-gray-500">
              {displayInfo.membersCount} thành viên
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <FaPhone className="icon-hover" />
          <FaVideo className="icon-hover" />
          <FaSearch className="icon-hover" />
          <FaEllipsisH className="icon-hover" />
        </div>
      </div>

      {/* Messages area - giữ nguyên */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start mb-4 ${
              msg.sender === "current_user" ? "justify-end" : ""
            }`}
          >
            {msg.sender !== "current_user" && (
              <img
                alt={msg.sender_name}
                className="rounded-full"
                height="40"
                src={msg.sender_avatar}
                width="40"
              />
            )}
            <div
              className={`ml-2 max-w-[70%] ${
                msg.sender === "current_user" ? "ml-auto" : ""
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.sender === "current_user"
                    ? "bg-blue-500 text-white"
                    : "bg-white shadow"
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender === "current_user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTimeStr(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message input - giữ nguyên */}
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={sendMessage}
        // onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default MainChatArea;
