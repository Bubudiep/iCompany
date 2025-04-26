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
import { FaArrowDown } from "react-icons/fa"; // Icon để cuộn xuống

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
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false); // State để hiển thị nút cuộn xuống
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(
    messages?.message?.data || []
  );
  const [lastMessageId, setLastMessageId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const isGroupChat = messages?.is_group || false;
  const roomId = messages?.id;
  const receiver = messages?.members?.find((member) => member.id !== user.id);
  const chatName = isGroupChat ? messages?.name : receiver?.username || "User";
  const members = messages?.members || [];

  const getSenderName = (senderId) => {
    const member = members.find((m) => m.id === senderId);
    return member?.profile?.full_name || member?.username || "Unknown";
  };

  // Cuộn xuống cuối khi mở đoạn chat lần đầu
  useEffect(() => {
    if (filteredMessages.length > 0 && chatEndRef.current && !searchTerm) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomId]); // Chạy khi roomId thay đổi (tức là khi mở đoạn chat mới)

  // Khôi phục pinnedMessages từ API
  useEffect(() => {
    const pinnedFromApi = messages?.ghim || [];
    const pinnedWithSenderName = pinnedFromApi.map((msg) => ({
      ...msg,
      sender_username: getSenderName(msg.sender),
    }));
    setPinnedMessages(pinnedWithSenderName);
  }, [messages, roomId]);

  // Cập nhật danh sách tin nhắn khi messages.message.data thay đổi
  useEffect(() => {
    setFilteredMessages(messages?.message?.data || []);
    if (messages?.message?.data?.length > 0) {
      setLastMessageId(Math.max(...messages.message.data.map((msg) => msg.id)));
    }
  }, [messages?.message?.data]);

  // Tích hợp WebSocket để nhận tin nhắn và thông báo hệ thống thời gian thực
  useEffect(() => {
    if (window.socket) {
      window.socket.on("message", (data) => {
        console.log(data);
        if (data.data.room !== roomId) return;
        setFilteredMessages((prev) => [...prev, data.data]);
        setLastMessageId(data.data.id);
        setShouldScrollToBottom(true);
        // if (data.type === "message") {
        //   const newMessage = {
        //     ...data.data,
        //     type: "message",
        //     sender_username: getSenderName(data.data.sender),
        //   };
        //   setFilteredMessages((prev) => [...prev, newMessage]);
        //   setLastMessageId(newMessage.id);
        //   setShouldScrollToBottom(true);
        // } else if (data.type === "system") {
        //   const systemMessage = {
        //     ...data.data,
        //     type: "system",
        //     sender_username: getSenderName(data.data.sender),
        //   };
        //   setFilteredMessages((prev) => [...prev, systemMessage]);
        //   setLastMessageId(systemMessage.id);
        //   setShouldScrollToBottom(true);

        //   if (systemMessage.message.includes("Ghim tin nhắn")) {
        //     const pinnedMsgId = systemMessage.message_id;
        //     const pinnedMsg = filteredMessages.find(
        //       (msg) => msg.id === pinnedMsgId
        //     );
        //     if (pinnedMsg && pinnedMessages.length < 5) {
        //       setPinnedMessages((prev) => [
        //         ...prev,
        //         {
        //           ...pinnedMsg,
        //           sender_username: getSenderName(pinnedMsg.sender),
        //         },
        //       ]);
        //     }
        //   } else if (systemMessage.message.includes("Bỏ ghim tin nhắn")) {
        //     const unpinnedMsgId = systemMessage.message_id;
        //     setPinnedMessages((prev) =>
        //       prev.filter((msg) => msg.id !== unpinnedMsgId)
        //     );
        //   }
        // }
      });
      return () => {
        window.socket.off("message");
      };
    }
  }, [roomId, filteredMessages]);

  // Cuộn xuống cuối khi có tin nhắn mới hoặc thông báo hệ thống
  useEffect(() => {
    if (shouldScrollToBottom && chatEndRef.current && !searchTerm) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [filteredMessages, searchTerm, shouldScrollToBottom]);

  // Xử lý cuộn để tải tin nhắn cũ và kiểm tra hiển thị nút cuộn xuống
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Kiểm tra nếu người dùng ở gần cuối (cách 100px)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    setShowScrollToBottomButton(!isNearBottom);

    // Load tin nhắn cũ nếu cuộn lên đầu
    if (
      container.scrollTop === 0 &&
      !loadingOlder &&
      messages?.message?.data?.length > 0
    ) {
      const minId = Math.min(...messages.message.data.map((msg) => msg.id));
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
  }, [messages?.message?.data, loadingOlder]);

  const handleSearch = (value) => {
    const searchValue = typeof value === "string" ? value : "";
    setSearchTerm(searchValue);
    if (!searchValue) {
      setFilteredMessages(messages?.message?.data || []);
    } else {
      const filtered = (messages?.message?.data || []).filter((msg) =>
        msg.message.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  };

  const handlePinMessage = async (msg) => {
    try {
      const isAlreadyPinned = pinnedMessages.some((m) => m.id === msg.id);
      if (isAlreadyPinned) {
        api
          .post(`/chatbox/${roomId}/boghim/`, { message: msg.id }, user.token)
          .then((res) => {
            setPinnedMessages(res.room.ghim);
            setFilteredMessages((prev) => [...prev, res.message]);
            message.success("Đã bỏ ghim tin nhắn!");
          })
          .catch((e) => {
            console.log(e);
            message.error("Không thể bỏ ghim tin nhắn. Vui lòng thử lại.");
          });
      } else {
        if (pinnedMessages.length >= 5) {
          message.error("Bạn chỉ có thể ghim tối đa 5 tin nhắn!");
          return;
        }
        await api
          .post(`/chatbox/${roomId}/ghim/`, { message: msg.id }, user.token)
          .then((res) => {
            setFilteredMessages((prev) => [...prev, res.message]);
          });
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
    setShouldScrollToBottom(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessageWithScroll();
    }
  };

  // Hàm cuộn xuống cuối khi click icon
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollToBottomButton(false);
    }
  };
  // console.log("All messages: ", messages?.message?.data);

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
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
        <div className="flex flex-1 p-1 overflow-hidden relative">
          <div
            className="flex-1 overflow-y-auto p-2"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            <PinnedMessages
              pinnedMessages={pinnedMessages}
              isGroupChat={isGroupChat}
              receiver={receiver}
              user={user}
              handlePinMessage={handlePinMessage}
            />
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
          {/* Nút cuộn xuống cuối */}
          {showScrollToBottomButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-16 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
              style={{ zIndex: 20 }}
            >
              <FaArrowDown size={20} />
              {filteredMessages.length > 0 && (
                <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">
                  {/* hiển thị số lượng tin nhắn chưa đọc bên cạnh icon cuộn xuống (nếu người dùng không ở cuối danh sách): */}
                  {/* {filteredMessages.length - (lastVisibleMessageIndex || 0)} */}
                </span>
              )}
            </button>
          )}
        </div>
        <ReplyPreview
          replyingTo={replyingTo}
          user={user}
          isGroupChat={isGroupChat}
          receiver={receiver}
          handleCancelReply={handleCancelReply}
        />
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={sendMessageWithScroll}
          onKeyDown={handleKeyDown}
          members={members}
        />
        <Modal
          open={isCallModalVisible}
          onCancel={handleEndCall}
          footer={null}
          closable={false}
          styles={{ padding: 0, background: "transparent" }}
          centered
          width="100%"
          style={{ top: 0, height: "100vh", maxWidth: "100vw" }}
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
