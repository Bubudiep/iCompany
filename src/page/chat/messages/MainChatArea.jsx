import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import {
  FaPhone,
  FaVideo,
  FaThumbtack,
  FaReply,
  FaEllipsisH,
} from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { Avatar, Spin, Input, Tooltip, message, Button } from "antd";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import { IoInformationSharp } from "react-icons/io5";
import AudioCallLayout from "./AudioCallLayout";
import VideoCallLayout from "./VideoCallLayout";
import { IoIosList } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";

const { Search } = Input;

const MainChatArea = ({
  messages,
  sendMessage,
  fetchOlderMessages,
  loadingOlder,
  newMessage,
  setNewMessage,
  toggleRightSide,
  fetchLatestMessages,
}) => {
  const { user } = useUser();
  const all_message = messages?.message?.data || [];
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);

  // Trạng thái để hiển thị layout gọi audio/video
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  // Trạng thái cho ghim tin nhắn
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [isPinnedMessagesVisible, setIsPinnedMessagesVisible] = useState(true); // Trạng thái hiển thị/ẩn danh sách ghim

  // Trạng thái cho tìm kiếm tin nhắn
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(all_message);

  // Trạng thái để đồng bộ tin nhắn
  const [lastMessageId, setLastMessageId] = useState(null);

  const receiver = messages?.members?.find((member) => member.id !== user.id);

  // Cập nhật danh sách tin nhắn khi all_message thay đổi
  useEffect(() => {
    setFilteredMessages(all_message);
    if (all_message.length > 0) {
      setLastMessageId(Math.max(...all_message.map((msg) => msg.id)));
    }
  }, [all_message]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current && !searchTerm) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [all_message, searchTerm]);

  // Xử lý cuộn để tải tin nhắn cũ
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container.scrollTop === 0 && !loadingOlder && all_message.length > 0) {
      const minId = Math.min(...all_message.map((msg) => msg.id));
      setLastScrollHeight(container.scrollHeight);
      fetchOlderMessages(minId);
    }
  };

  useEffect(() => {
    if (loadingOlder) return;

    const container = chatContainerRef.current;
    if (container && lastScrollHeight) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - lastScrollHeight;
      setLastScrollHeight(0);
    }
  }, [all_message, loadingOlder]);

  // Xử lý tìm kiếm tin nhắn
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      setFilteredMessages(all_message);
    } else {
      const filtered = all_message.filter((msg) =>
        msg.message.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  };

  // Xử lý ghim tin nhắn
  const handlePinMessage = (message) => {
    if (pinnedMessages.some((msg) => msg.id === message.id)) {
      setPinnedMessages((prev) => prev.filter((msg) => msg.id !== message.id));
      message.success("Đã bỏ ghim tin nhắn!");
    } else {
      if (pinnedMessages.length >= 3) {
        message.error("Bạn chỉ có thể ghim tối đa 3 tin nhắn!");
        return;
      }
      setPinnedMessages((prev) => [...prev, message]);
      message.success("Đã ghim tin nhắn!");
    }
  };

  // Đồng bộ tin nhắn (giả lập bằng setInterval)
  useEffect(() => {
    const syncMessages = async () => {
      if (lastMessageId && fetchLatestMessages) {
        try {
          await fetchLatestMessages(lastMessageId);
        } catch (error) {
          console.error("Error syncing messages:", error);
        }
      }
    };

    const interval = setInterval(syncMessages, 5000);
    return () => clearInterval(interval);
  }, [lastMessageId, fetchLatestMessages]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const getTimeDisplay = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    if (diffInSeconds < 10) {
      return "vừa xong";
    }

    return app.timeSince(timestamp);
  };

  const handleAudioCall = () => {
    setIsAudioCallActive(true);
  };

  const handleEndAudioCall = () => {
    setIsAudioCallActive(false);
  };

  const handleVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
  };

  const handleLikeMessage = (message) => {
    message.success(`Bạn đã thích tin nhắn: "${message.message}"`);
  };

  const handleReplyMessage = (message) => {
    setNewMessage(
      `Trả lời ${message.sender === user.id ? "bạn" : receiver?.username}: ${
        message.message
      } - `
    );
  };

  const handleMoreActions = (message) => {
    message.info(`Hiển thị thêm tùy chọn cho tin nhắn: "${message.message}"`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
      <div className="flex items-center justify-between bg-white !h-[60px] p-4 border-b">
        <div className="flex items-center">
          <Avatar
            className="rounded-full"
            size={40}
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          />
          <div className="ml-2">
            <h1 className="font-bold text-lg">
              {receiver?.username || "User"}
            </h1>
            <div className="text-sm text-gray-500">Đang hoạt động</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 cursor-pointer">
          <Search
            placeholder="Tìm tin nhắn..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <FaPhone className="icon-hover" onClick={handleAudioCall} />
          <FaVideo className="icon-hover" onClick={handleVideoCall} />
          <IoIosInformationCircle
            size={20}
            className="icon-hover"
            onClick={toggleRightSide}
          />
        </div>
      </div>

      <div className="flex flex-1 p-1 overflow-hidden">
        <div
          className="flex-1 overflow-y-auto p-2"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {/* Hiển thị danh sách tin nhắn được ghim */}
          {pinnedMessages.length > 0 && (
            <div
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f0f2f5",
                zIndex: 10,
                padding: "8px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex justify-between items-center">
                <div className="font-bold text-sm">
                  Danh sách ghim ({pinnedMessages.length})
                </div>
                <Button
                  size="small"
                  type="link"
                  onClick={() =>
                    setIsPinnedMessagesVisible(!isPinnedMessagesVisible)
                  }
                >
                  {isPinnedMessagesVisible ? "Thu gọn" : "Hiện ghim"}
                </Button>
              </div>
              {isPinnedMessagesVisible &&
                pinnedMessages.map((pinnedMsg) => (
                  <div
                    key={pinnedMsg.id}
                    className="flex justify-between items-center p-2 bg-white rounded mt-1"
                  >
                    <div className="text-sm">
                      <span className="font-semibold">
                        {pinnedMsg.sender === user.id
                          ? "Bạn"
                          : receiver?.username}
                        :{" "}
                      </span>
                      {pinnedMsg.message.length > 50
                        ? pinnedMsg.message.slice(0, 50) + "..."
                        : pinnedMsg.message}
                    </div>
                    <Button
                      size="small"
                      type="link"
                      onClick={() =>
                        setPinnedMessages((prev) =>
                          prev.filter((msg) => msg.id !== pinnedMsg.id)
                        )
                      }
                    >
                      Bỏ ghim
                    </Button>
                  </div>
                ))}
            </div>
          )}

          {loadingOlder && (
            <div className="flex justify-center py-2">
              <Spin />
            </div>
          )}

          {filteredMessages
            .sort((a, b) => a.id - b.id)
            .filter(
              (message) =>
                message && typeof message === "object" && "sender" in message
            )
            .map((message, index) => (
              <div
                key={message.id || index}
                className={`flex mb-4 ${
                  message.sender === user.id ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== user.id && (
                  <Avatar
                    alt={message.sender.toString()}
                    src={
                      message.sender_avatar ||
                      "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                    }
                    className="mr-2"
                  />
                )}
                <div className="relative group">
                  <div
                    className={`p-2 mx-2 rounded-lg max-w-xs ${
                      message.sender === user.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    } ${
                      searchTerm &&
                      message.message
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                        ? "border border-yellow-500"
                        : ""
                    }`}
                  >
                    <p>{message.message}</p>
                    <span className="text-xs">
                      {getTimeDisplay(
                        message.created_at || new Date().toISOString()
                      )}
                    </span>
                  </div>
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 ${
                      message.sender === user.id
                        ? "left-0 -ml-25"
                        : "right-0 -mr-25"
                    } flex space-x-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    <Tooltip title="Thích">
                      <AiOutlineLike
                        className="text-gray-600 cursor-pointer hover:text-blue-500"
                        onClick={() => handleLikeMessage(message)}
                      />
                    </Tooltip>
                    <Tooltip title="Trả lời">
                      <FaReply
                        className="text-gray-600 cursor-pointer hover:text-blue-500"
                        onClick={() => handleReplyMessage(message)}
                      />
                    </Tooltip>
                    <Tooltip
                      title={
                        pinnedMessages.some((msg) => msg.id === message.id)
                          ? "Bỏ ghim"
                          : "Ghim tin nhắn"
                      }
                    >
                      <FaThumbtack
                        className={`cursor-pointer ${
                          pinnedMessages.some((msg) => msg.id === message.id)
                            ? "text-yellow-500"
                            : "text-gray-600"
                        } hover:text-yellow-500`}
                        onClick={() => handlePinMessage(message)}
                      />
                    </Tooltip>
                    <Tooltip title="More actions">
                      <FaEllipsisH
                        className="text-gray-600 cursor-pointer hover:text-blue-500"
                        onClick={() => handleMoreActions(message)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          <div ref={chatEndRef} style={{ height: "1px" }} />
        </div>
      </div>

      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={sendMessage}
        onKeyDown={handleKeyDown}
        members={messages?.members || []}
      />

      {isAudioCallActive && (
        <AudioCallLayout receiver={receiver} onEndCall={handleEndAudioCall} />
      )}

      {isVideoCallActive && (
        <VideoCallLayout receiver={receiver} onEndCall={handleEndVideoCall} />
      )}
    </div>
  );
};

export default MainChatArea;
