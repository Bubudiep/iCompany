import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import {
  FaPhone,
  FaVideo,
  FaThumbtack,
  FaReply,
  FaEllipsisH,
  FaStar,
} from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import {
  Avatar,
  Spin,
  Input,
  Tooltip,
  message,
  Button,
  Modal,
  Divider,
  Popconfirm,
} from "antd";
import { useUser } from "../../../components/context/userContext";
import app from "../../../components/app";
import AudioCallLayout from "./AudioCallLayout";
import VideoCallLayout from "./VideoCallLayout";
import { AiOutlineLike } from "react-icons/ai";
import api from "../../../components/api";
import { BsPinAngleFill } from "react-icons/bs";
import { RiUnpinFill } from "react-icons/ri";
import RightSide from "./RightSide";
import { CiUser } from "react-icons/ci";
import { IoPersonAddSharp } from "react-icons/io5";
import {
  CameraOutlined,
  CopyOutlined,
  EditOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShareAltOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { FaCubesStacked } from "react-icons/fa6";

const { Search } = Input;

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
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // chat box information
  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleOk = () => {
    setIsAvatarModalOpen(false);
  };

  const handleCancel = () => {
    setIsAvatarModalOpen(false);
  };

  const handleNameClick = () => {
    setIsNameModalOpen(true);
  };

  const handleNameOk = () => {
    setIsNameModalOpen(false);
  };

  const handleNameCancel = () => {
    setIsNameModalOpen(false);
  };

  // Trạng thái để hiển thị layout gọi audio/video
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  // Trạng thái cho ghim tin nhắn
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [isPinnedMessagesVisible, setIsPinnedMessagesVisible] = useState(false); // Thu gọn mặc định

  // Trạng thái cho tìm kiếm tin nhắn
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(all_message);

  // Trạng thái để đồng bộ tin nhắn
  const [lastMessageId, setLastMessageId] = useState(null);

  // Trạng thái cho trả lời tin nhắn
  const [replyingTo, setReplyingTo] = useState(null);

  // Xác định loại chat (1-1 hay group) và thông tin hiển thị
  const isGroupChat = messages?.is_group || false;
  const roomId = messages?.id;
  const receiver = messages?.members?.find((member) => member.id !== user.id);
  const chatName = isGroupChat ? messages?.name : receiver?.username || "User";
  const members = messages?.members || [];

  // Lấy username hoặc full_name của người gửi
  const getSenderName = (senderId) => {
    const member = members.find((m) => m.id === senderId);
    if (!member) return "Unknown";
    return member.profile?.full_name || member.username || "Unknown";
  };

  // Khôi phục pinnedMessages từ API
  useEffect(() => {
    // Lấy danh sách tin nhắn ghim từ API
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
      // Lắng nghe sự kiện message từ WebSocket
      window.socket.on("message", (data) => {
        if (data.type === "message") {
          const newMessage = data.data;
          // Kiểm tra xem tin nhắn có thuộc phòng chat hiện tại không
          if (newMessage.room === roomId) {
            setFilteredMessages((prev) => [
              ...prev,
              {
                ...newMessage,
                type: "message",
                sender_username: getSenderName(newMessage.sender),
              },
            ]);
            // Cập nhật lastMessageId
            setLastMessageId(newMessage.id);
          }
        }
      });

      // Cleanup: Xóa listener khi component unmount hoặc roomId thay đổi
      return () => {
        window.socket.off("message");
      };
    }
  }, [roomId, window.socket]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current && !searchTerm) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredMessages, searchTerm]); // Thay all_message bằng filteredMessages
  // }, [all_message, searchTerm]);

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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessageWithScroll();
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

  const handleLikeMessage = (msg) => {
    message.success(`Bạn đã thích tin nhắn: "${msg.message}"`);
  };

  const handleAddToGroup = (user) => {
    message.success(
      `${user.username} đã được bạn ${user.username} thêm vào nhóm ${chatName}`
    );
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

  // Hàm gửi tin nhắn và cuộn xuống cuối
  const sendMessageWithScroll = () => {
    if (!newMessage.trim()) return;

    const messageToSend = replyingTo
      ? { message: newMessage, reply_to: replyingTo.id }
      : { message: newMessage };

    sendMessage(messageToSend);

    // Thêm tin nhắn vào danh sách ngay lập tức để hiển thị mà không cần đợi WebSocket
    const newMsg = {
      id: Date.now(), // ID tạm thời, sẽ được cập nhật khi nhận từ WebSocket
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

    // Cuộn xuống cuối sau khi gửi tin nhắn
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  // show all data from api
  // console.log("messages", messages);
  // console.log("total mesage: ", messages?.message?.data.length);
  // console.log("total mesage: ", messages?.message?.total);

  return (
    <div className="flex flex-1">
      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col bg-gray-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-white !h-[60px] p-4 border-b">
          <div className="flex items-center">
            <div className="relative">
              <Avatar
                onClick={handleAvatarClick}
                className="rounded-full cursor-pointer"
                size={40}
                src={messages?.avatar}
              />
            </div>

            <div className="ml-2 relative group">
              <div className="flex items-center space-x-2">
                <h1 className="font-bold">{chatName}</h1>
                <Tooltip title="Chỉnh sửa">
                  <EditOutlined
                    className="opacity-0 group-hover:opacity-100 text-sm cursor-pointer transition-opacity"
                    onClick={handleNameClick}
                  />
                </Tooltip>

                <Modal
                  title={isGroupChat ? "Đổi tên nhóm" : "Đặt tên gợi nhớ"}
                  open={isNameModalOpen}
                  onOk={handleNameOk}
                  onCancel={handleNameCancel}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar
                        size={64}
                        // src={avatarUrl}
                      />
                      <div className="absolute -bottom-1 right-0 bg-white border rounded-full p-1">
                        📷
                      </div>
                    </div>
                    {/*  nếu là group chat, chat 1-1 */}
                    {isGroupChat ? (
                      <p className="text-center mt-4 text-gray-600">
                        Bạn có chắc chắn muốn đổi tên nhóm, khi xác nhận tên
                        nhóm mới sẽ hiển thị với tất cả thành viên.
                      </p>
                    ) : (
                      <p className="text-center mt-4 text-gray-600">
                        Hãy đặt tên cho ... {user.username} một cái tên dễ nhớ.
                        <br />
                        Lưu ý: Tên gợi nhớ sẽ chỉ hiện thị với riêng bạn.
                      </p>
                    )}

                    <Input
                      className="mt-3"
                      value={chatName}
                      // onChange={(e) => setNewName(e.target.value)}
                    />

                    <div className="flex justify-end mt-5 w-full gap-2"></div>
                  </div>
                </Modal>
              </div>

              <div className="text-sm text-gray-500 flex items-center space-x-2">
                {isGroupChat ? (
                  <>
                    <CiUser className="inline mr-1" />
                    <span>{members.length} thành viên</span>
                  </>
                ) : (
                  <span className="text-sm text-green-500">
                    {receiver?.status || "Đang hoạt động"}
                  </span>
                )}{" "}
                <Divider
                  type="vertical"
                  className="h-4 border-black-solid w-2"
                />
                <Tooltip title="Phân loại đoạn chat">
                  <FaCubesStacked className="icon-hover cursor-pointer" />
                </Tooltip>
              </div>
            </div>

            <Modal
              centered
              title={isGroupChat ? "Thông tin nhóm" : "Thông tin đoạn chat"}
              open={isAvatarModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <div className="flex flex-col items-center">
                {/* Avatar nhóm */}
                <div className="relative cursor-pointer">
                  <Avatar src={user.avatar} size={72} />
                  {/* Tên nhóm */}
                  <span className="text-lg font-semibold ml-4 mr-2">
                    {chatName}
                  </span>
                  <Tooltip title="Đổi tên nhóm">
                    <EditOutlined
                      onClick={() => setIsNameModalOpen(true)}
                      className="cursor-pointer text-gray-500"
                    />
                  </Tooltip>
                  {/* )} */}
                </div>

                <Button className="mt-4 w-full" type="default">
                  Nhắn tin
                </Button>

                {/* Thành viên */}
                <div className="w-full mt-5">
                  <div className="mb-1 font-bold">
                    Thành viên ({members.length})
                  </div>
                  <div className="flex items-center gap-[-8px]">
                    {members.map((src, idx) => (
                      <Avatar
                        key={idx}
                        size={32}
                        src={user.avatar}
                        className="-ml-1"
                      />
                    ))}
                    <Avatar size={32}>...</Avatar>
                  </div>
                </div>

                {/* Ảnh/Video */}
                <div className="w-full mt-5">
                  <div className="text-gray-500 mb-1">Ảnh/Video</div>
                  <div className="flex gap-2 overflow-x-auto">
                    {/* {mediaList.map((src, idx) => ( */}
                    <img
                      // key={idx}
                      // src={src}
                      alt="media"
                      className="h-16 w-16 rounded object-cover"
                    />
                    {/* ))} */}
                    <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center text-xl">
                      →
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Link tham gia */}
                <div className="w-full flex items-center justify-between mb-2">
                  <h1>Link tham gia </h1>
                  <a
                    // href={joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 truncate"
                  >
                    {/* {joinLink} */}
                    https://hl.djc.me/g/rfgqjg415
                  </a>
                  <div className="">
                    <Tooltip title="Sao chép">
                      <CopyOutlined
                        // onClick={handleCopy}
                        className="cursor-pointer mr-2"
                      />
                    </Tooltip>
                    <Tooltip title="Chia sẻ">
                      <ShareAltOutlined
                        // onClick={handleCopy}
                        className="cursor-pointer"
                      />
                    </Tooltip>
                  </div>
                </div>

                {/* Quản lý nhóm */}
                <Button icon={<SettingOutlined />} className="w-full mb-2">
                  Quản lý nhóm
                </Button>

                {/* Rời nhóm */}
                <Popconfirm
                  title="Bạn chắc chắn muốn rời nhóm?"
                  onConfirm={() => message.warning("Bạn đã rời nhóm")}
                  okText="Ok"
                  cancelText="Hủy"
                >
                  <Button icon={<LogoutOutlined />} danger className="w-full">
                    Rời nhóm
                  </Button>
                </Popconfirm>
              </div>
            </Modal>
          </div>
          <div className="flex items-center space-x-4 cursor-pointer">
            <Search
              placeholder="Tìm tin nhắn..."
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <Tooltip title="Thêm bạn vào nhóm">
              <IoPersonAddSharp onClick={handleAddToGroup} />
            </Tooltip>
            <Tooltip title="Cuộc gọi thoại">
              <FaPhone className="icon-hover" onClick={handleAudioCall} />
            </Tooltip>

            <Tooltip title="Cuộc gọi video">
              <FaVideo className="icon-hover" onClick={handleVideoCall} />
            </Tooltip>
            <Tooltip title="Thông tin cuộc trò chuyện">
              <IoIosInformationCircle
                size={20}
                className="icon-hover"
                onClick={toggleRightSide}
              />
            </Tooltip>
          </div>
        </div>

        {/* Khu vực tin nhắn */}
        <div className="flex flex-1 p-1 overflow-hidden">
          <div
            className="flex-1 overflow-y-auto p-2"
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {/* Danh sách tin nhắn được ghim */}
            {pinnedMessages.length > 0 && (
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#e6f0fa",
                  zIndex: 10,
                  padding: "4px 8px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {isPinnedMessagesVisible ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-sm">
                        Danh sách ghim ({pinnedMessages.length})
                      </div>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => setIsPinnedMessagesVisible(false)}
                      >
                        Thu gọn
                      </Button>
                    </div>
                    {pinnedMessages.map((pinnedMsg) => (
                      <div
                        key={pinnedMsg.id}
                        className="flex justify-between items-center p-2 bg-white rounded mt-1"
                      >
                        <div className="text-sm">
                          <span className="font-semibold">
                            {pinnedMsg.sender === user.id
                              ? "Bạn"
                              : isGroupChat
                              ? pinnedMsg.sender_username
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
                          onClick={() => handlePinMessage(pinnedMsg)}
                        >
                          Bỏ ghim
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsPinnedMessagesVisible(true)}
                  >
                    <div className="text-sm text-blue-600">
                      Tin nhắn{" "}
                      <span className="font-semibold">
                        +{pinnedMessages.length} ghim
                      </span>
                    </div>
                    <BsPinAngleFill className="text-blue-600" />
                  </div>
                )}
              </div>
            )}

            {loadingOlder && (
              <div className="flex justify-center py-2">
                <Spin />
              </div>
            )}

            {/* Kết hợp danh sách tin nhắn và thông báo hệ thống từ API */}
            {filteredMessages
              .map((msg) => ({
                ...msg,
                type: msg.isAction ? "system" : "message",
                sender_username: getSenderName(msg.sender),
              }))
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map((item, index) => {
                if (item.type === "system") {
                  const isPinAction = item.message.includes("Ghim tin nhắn");
                  const isUnpinAction =
                    item.message.includes("Bỏ ghim tin nhắn");

                  return (
                    <div key={item.id} className="flex justify-center my-2">
                      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
                        {isPinAction && (
                          <BsPinAngleFill
                            className="text-yellow-500 mr-2"
                            size={12}
                          />
                        )}
                        {isUnpinAction && (
                          <RiUnpinFill
                            className="text-yellow-500 mr-2"
                            size={12}
                          />
                        )}
                        <span>
                          {item.sender === user.id
                            ? "Bạn"
                            : getSenderName(item.sender)}{" "}
                          {item.message}
                        </span>
                      </div>
                    </div>
                  );
                }
                {
                  /* if messages <= 0, show no messages, please send somthing */
                }
                {
                  messages?.message?.total === 0 && (
                    <p className="text-xs text-gray-600">
                      Vui lồng nhập tin nhắn
                    </p>
                  );
                }
                const message = item;
                const repliedMessage = message.reply_to
                  ? filteredMessages.find((msg) => msg.id === message.reply_to)
                  : null;
                // All messages are here
                return (
                  <div
                    key={message.id || index}
                    className={`flex mb-4 ${
                      message.sender === user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {/* messages in chatbox */}
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
                        {isGroupChat && message.sender !== user.id && (
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            {message.sender_username}
                          </p>
                        )}
                        {message.reply_to && repliedMessage && (
                          <div className="border-l-4 border-blue-400 pl-2 mb-2 bg-blue-50 rounded-r">
                            <p className="text-xs font-semibold text-blue-600">
                              Trả lời{" "}
                              {repliedMessage.sender === user.id
                                ? "bạn"
                                : repliedMessage.sender_username || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-600 italic">
                              {repliedMessage.message.length > 50
                                ? repliedMessage.message.slice(0, 50) + "..."
                                : repliedMessage.message}
                            </p>
                          </div>
                        )}

                        <p className="text-sm">{message.message}</p>
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
                              pinnedMessages.some(
                                (msg) => msg.id === message.id
                              )
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
                );
              })}
            <div ref={chatEndRef} style={{ height: "1px" }} />
          </div>
        </div>

        {/* Hiển thị tin nhắn đang trả lời phía trên ô nhập liệu */}
        {replyingTo && (
          <div className="bg-gray-100 p-2 border-t border-gray-300 flex items-center justify-between">
            <div className="flex items-center">
              <FaReply className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">
                  Trả lời{" "}
                  {replyingTo.sender === user.id
                    ? "bạn"
                    : isGroupChat
                    ? replyingTo.sender_username
                    : receiver?.username}
                  :
                </p>
                <p className="text-sm text-gray-700">
                  {replyingTo.message.length > 50
                    ? replyingTo.message.slice(0, 50) + "..."
                    : replyingTo.message}
                </p>
              </div>
            </div>
            <Button
              size="small"
              type="link"
              onClick={handleCancelReply}
              className="text-red-500"
            >
              Hủy
            </Button>
          </div>
        )}

        {/* Ô nhập liệu */}
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={sendMessageWithScroll}
          onKeyDown={handleKeyDown}
          members={messages?.members || []}
        />

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
