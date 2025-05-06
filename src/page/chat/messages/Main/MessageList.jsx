import React from "react";
import { Avatar, Spin, Tooltip, Button, Popover, Modal } from "antd";
import {
  FaThumbtack,
  FaReply,
  FaEllipsisH,
  FaShare,
  FaExclamationTriangle,
  FaTrash,
  FaRegCopy,
} from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { BsPinAngleFill } from "react-icons/bs";
import { RiUnpinFill } from "react-icons/ri";
import {
  FaRegFaceSmile,
  FaRegFaceSmileBeam,
  FaThumbtackSlash,
} from "react-icons/fa6";

const MessageList = ({
  messages,
  filteredMessages,
  loadingOlder,
  user,
  isGroupChat,
  receiver,
  pinnedMessages,
  handleReactionMessage,
  handleReplyMessage,
  handleMoreActions,
  handlePinMessage,
  getSenderName,
  getTimeDisplay,
  searchTerm,
}) => {
  const formatTimestampForDivider = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const moreActionsContent = (message) => (
    <div className="flex flex-col text-sm cursor-pointer">
      <button
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left cursor-pointer"
        onClick={() => handleCopyMessage(message)}
      >
        <FaRegCopy />
        Sao chép
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left cursor-pointer"
        // onClick={() => handlePin(message)}
      >
        <FaThumbtackSlash />
        Ghim
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left cursor-pointer"
        // onClick={() => handleForward(message)}
      >
        <FaShare />
        Chuyển tiếp
      </button>

      <button
        className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 text-left transition-all duration-200 hover:scale-105 cursor-pointer"
        onClick={() => handleReport(message)}
      >
        <FaExclamationTriangle className="group transition-transform duration-200 group-hover:rotate-12" />
        Báo cáo
      </button>

      <button
        className="group flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-100 transition-all duration-200 cursor-pointer"
        onClick={() => handleDelete(message)}
      >
        <FaTrash className="transition-transform duration-300 group-hover:-rotate-20 group-hover:scale-110" />
        <span className="group-hover:text-red-700">Xóa</span>
      </button>
    </div>
  );

  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message.content);
  };

  const handleReport = (message) => {
    message.success("Báo cáo thành công!");
  };

  const handleDelete = (message) => {
    Modal.confirm({
      title: "Xác nhận xóa tin nhắn",
      content: "Bạn có chắc chắn muốn xóa tin nhắn này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        // TODO: thực hiện xóa thật
        console.log("Deleted:", message);
      },
    });
  };

  return (
    <>
      {loadingOlder && (
        <div className="flex justify-center py-2">
          <Spin />
        </div>
      )}
      {messages?.message?.total === 0 && (
        <div className="flex justify-center my-4">
          <p className="text-gray-500 text-sm">
            Hãy nhắn gì đó để bắt đầu cuộc trò chuyện...
          </p>
        </div>
      )}
      {filteredMessages
        .map((msg) => ({
          ...msg,
          type: msg.isAction ? "system" : "message",
          sender_username: getSenderName(msg.sender),
        }))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((item, index, arr) => {
          // Kiểm tra khoảng cách thời gian với tin nhắn trước
          let showTimeDivider = false;
          if (index > 0) {
            const prevMessage = arr[index - 1];
            const currentTime = new Date(item.created_at).getTime();
            const prevTime = new Date(prevMessage.created_at).getTime();
            const timeDiff = (currentTime - prevTime) / 1000; // Chênh lệch thời gian (giây)
            if (timeDiff > 86400) {
              // Lớn hơn 1 ngày (86,400 giây)
              showTimeDivider = true;
            }
          }

          return (
            <React.Fragment key={item.id || index}>
              {/* Hiển thị thời gian nếu khoảng cách lớn hơn 1 ngày */}
              {showTimeDivider && (
                <div className="flex justify-center my-2">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500">
                    {formatTimestampForDivider(item.created_at)}
                  </div>
                </div>
              )}

              {item.type === "system" ? (
                <div className="flex justify-center my-2">
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
                    {item.message.includes("Ghim tin nhắn") && (
                      <BsPinAngleFill
                        className="text-yellow-500 mr-2"
                        size={12}
                      />
                    )}
                    {item.message.includes("Bỏ ghim tin nhắn") && (
                      <RiUnpinFill className="text-yellow-500 mr-2" size={12} />
                    )}
                    <span>
                      {item.sender === user.id
                        ? "Bạn"
                        : getSenderName(item.sender)}{" "}
                      {item.message}
                    </span>
                  </div>
                </div>
              ) : (
                (() => {
                  const message = item;
                  const repliedMessage = message.reply_to
                    ? filteredMessages.find(
                        (msg) => msg.id === message.reply_to
                      )
                    : null;

                  return (
                    <div
                      className={`flex mb-4 ${
                        message.sender === user.id
                          ? "justify-end"
                          : "justify-start"
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
                        {/* actions menu */}
                        <div
                          className={`absolute top-1/2 transform -translate-y-1/2 z-10
                          ${
                            message.sender === user.id
                              ? "left-0 -ml-25 flex-row-reverse"
                              : "right-0 -mr-25"
                          } flex space-x-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                          <Tooltip title="Bày tỏ cảm xúc">
                            <FaRegFaceSmile
                              className="text-gray-600 cursor-pointer hover:text-blue-500"
                              onClick={() => handleReactionMessage(message)}
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
                              pinnedMessages.some(
                                (msg) => msg.id === message.id
                              )
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
                          <Popover
                            content={moreActionsContent(message)}
                            trigger="click"
                            placement="bottomLeft"
                            className="mr-2"
                          >
                            <Tooltip title="Xem thêm">
                              <FaEllipsisH className="text-gray-600 cursor-pointer hover:text-blue-500" />
                            </Tooltip>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};

export default MessageList;
