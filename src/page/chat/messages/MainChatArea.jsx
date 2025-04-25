import React, { useEffect, useRef, useState } from "react";
import { message, Modal } from "antd";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import api from "../../../components/api";
import ChatHeader from "./ChatHeader";
import PinnedMessages from "./PinnedMessages";
import MessageList from "./MessageList";
import ReplyPreview from "./ReplyPreview";
import MessageInput from "./MessageInput";
import AudioCallLayout from "./AudioCallLayout";
import VideoCallLayout from "./VideoCallLayout";

const MainChatArea = ({
  messages,
  sendMessage,
  fetchOlderMessages,
  loadingOlder,
  newMessage,
  setNewMessage,
  toggleRightSide,
}) => {
  const { user } = useUser();
  const all_message = messages?.message?.data || [];
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(all_message);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  // Xác định loại chat và thông tin hiển thị
  const isGroupChat = messages?.is_group || false;
  const roomId = messages?.id;
  const receiver = messages?.members?.find((member) => member.id !== user.id);
  const chatName = isGroupChat ? messages?.name : receiver?.username || "User";
  const members = messages?.members || [];

  // Lấy username hoặc full_name của người gửi
  const getSenderName = (senderId) => {
    const member = members.find((m) => m.id === senderId);
    return member?.profile?.full_name || member?.username || "Unknown";
  };

  // Khôi phục pinnedMessages từ API
  useEffect(() => {
    const pinnedFromApi = messages?.ghim || [];
    const pinnedWithSenderName = pinnedFromApi.map((msg) => ({
      ...msg,
      sender_username: getSenderName(msg.sender),
    }));
    setPinnedMessages(pinnedWithSenderName);
  }, [messages, roomId]);

  // Cập nhật danh sách tin nhắn khi all_message thay đổi
  useEffect(() => {
    setFilteredMessages(all_message);
    if (all_message.length > 0) {
      setLastMessageId(Math.max(...all_message.map((msg) => msg.id)));
    }
  }, [all_message]);

  // Tích hợp WebSocket để nhận tin nhắn thời gian thực
  useEffect(() => {
    if (window.socket && roomId) {
      window.socket.on("message", (data) => {
        if (data.type === "message") {
          const newMessage = data.data;
          if (newMessage.room === roomId) {
            setFilteredMessages((prev) => [
              ...prev,
              {
                ...newMessage,
                type: "message",
                sender_username: getSenderName(newMessage.sender),
              },
            ]);
            setLastMessageId(newMessage.id);
          }
        }
      });
      return () => {
        window.socket.off("message");
      };
    }
  }, [roomId]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current && !searchTerm) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages, searchTerm]);

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
  const handlePinMessage = async (msg) => {
    try {
      const isAlreadyPinned = pinnedMessages.some((m) => m.id === msg.id);
      if (isAlreadyPinned) {
        await api.post(
          `/chatbox/${roomId}/boghim/`,
          { message: msg.id },
          user.token
        );
        setPinnedMessages((prev) => prev.filter((m) => m.id !== msg.id));
        message.success("Đã bỏ ghim tin nhắn!");
      } else {
        if (pinnedMessages.length >= 5) {
          message.error("Bạn chỉ có thể ghim tối đa 5 tin nhắn!");
          return;
        }
        await api.post(
          `/chatbox/${roomId}/ghim/`,
          { message: msg.id },
          user.token
        );
        const msgWithSenderName = {
          ...msg,
          sender_username: getSenderName(msg.sender),
        };
        setPinnedMessages((prev) => [...prev, msgWithSenderName]);
        message.success("Đã ghim tin nhắn!");
      }
    } catch (error) {
      console.error("Error pinning/unpinning message:", error);
      message.error("Không thể ghim/bỏ ghim tin nhắn. Vui lòng thử lại.");
    }
  };

  const getTimeDisplay = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    if (diffInSeconds < 10) return "vừa xong";
    return app.timeSince(timestamp);
  };

  const handleAudioCall = () => {
    setIsCallModalVisible(true);
  };

  const handleEndCall = () => {
    setIsCallModalVisible(false);
  };

  const handleVideoCall = () => {
    setIsVideoCallActive(true);
  };

  const handleEndAudioCall = () => {
    setIsAudioCallActive(false);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
  };

  const handleLikeMessage = (msg) => {
    message.success(`Bạn đã thích tin nhắn: "${msg.message}"`);
  };

  const handleReplyMessage = (msg) => {
    setReplyingTo(msg);
    setNewMessage("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setNewMessage("");
  };

  const handleMoreActions = (msg) => {
    message.info(`Hiển thị thêm tùy chọn cho tin nhắn: "${msg.message}"`);
  };

  const sendMessageWithScroll = () => {
    if (!newMessage.trim()) return;
    const messageToSend = replyingTo
      ? { message: newMessage, reply_to: replyingTo.id }
      : { message: newMessage };
    sendMessage(messageToSend);
    const newMsg = {
      id: Date.now(),
      isAction: false,
      message: newMessage,
      attachment: null,
      socket_sended: true,
      created_at: new Date().toISOString(),
      ghim_by: null,
      room: roomId,
      sender: user.id,
      reply_to: replyingTo ? replyingTo.id : null,
      mention_users: [],
      type: "message",
      sender_username: getSenderName(user.id),
    };
    setFilteredMessages((prev) => [...prev, newMsg]);
    setLastMessageId(newMsg.id);
    setReplyingTo(null);
    setNewMessage("");
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessageWithScroll();
    }
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
        {/* Header */}
        <ChatHeader
          chatName={chatName}
          isGroupChat={isGroupChat}
          members={members}
          avatar={messages?.avatar}
          receiver={receiver}
          toggleRightSide={toggleRightSide}
          handleSearch={handleSearch}
          handleAudioCall={handleAudioCall}
          handleVideoCall={handleVideoCall}
        />

        {/* Khu vực tin nhắn */}
        <div className="flex flex-1 p-1 overflow-hidden">
          <div
            className="flex-1 overflow-y-auto p-2"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {/* Tin nhắn ghim */}
            <PinnedMessages
              pinnedMessages={pinnedMessages}
              isGroupChat={isGroupChat}
              receiver={receiver}
              user={user}
              handlePinMessage={handlePinMessage}
            />

            {/* Danh sách tin nhắn */}
            <MessageList
              messages={messages}
              filteredMessages={filteredMessages}
              loadingOlder={loadingOlder}
              user={user}
              isGroupChat={isGroupChat}
              receiver={receiver}
              pinnedMessages={pinnedMessages}
              handleLikeMessage={handleLikeMessage}
              handleReplyMessage={handleReplyMessage}
              handleMoreActions={handleMoreActions}
              handlePinMessage={handlePinMessage}
              getSenderName={getSenderName}
              getTimeDisplay={getTimeDisplay}
              searchTerm={searchTerm}
            />

            <div ref={chatEndRef} style={{ height: "1px" }} />
          </div>
        </div>

        {/* Hiển thị tin nhắn đang trả lời */}
        <ReplyPreview
          replyingTo={replyingTo}
          user={user}
          isGroupChat={isGroupChat}
          receiver={receiver}
          handleCancelReply={handleCancelReply}
        />

        {/* Ô nhập liệu */}
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={sendMessageWithScroll}
          onKeyDown={handleKeyDown}
          members={members}
        />

        {/* Modal cuộc gọi */}
        <Modal
          open={isCallModalVisible}
          onCancel={handleEndCall}
          footer={null}
          closable={false}
          centered
          width="100%"
          style={{
            padding: 0,
            background: "transparent",
            top: 0,
            height: "100vh",
            maxWidth: "100vw",
          }}
        >
          <AudioCallLayout receiver={receiver} onEndCall={handleEndCall} />
        </Modal>

        {isAudioCallActive && (
          <AudioCallLayout
            receiver={isGroupChat ? { username: chatName } : receiver}
            onEndCall={handleEndAudioCall}
          />
        )}
        {isVideoCallActive && (
          <VideoCallLayout
            receiver={isGroupChat ? { username: chatName } : receiver}
            onEndCall={handleEndVideoCall}
          />
        )}
      </div>
    </div>
  );
};

export default MainChatArea;
