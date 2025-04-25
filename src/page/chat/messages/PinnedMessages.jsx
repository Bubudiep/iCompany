import React, { useState } from "react";
import { Button } from "antd";
import { BsPinAngleFill } from "react-icons/bs";

const PinnedMessages = ({ pinnedMessages, isGroupChat, receiver, user, handlePinMessage }) => {
  const [isPinnedMessagesVisible, setIsPinnedMessagesVisible] = useState(false);

  return (
    pinnedMessages.length > 0 && (
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
    )
  );
};

export default PinnedMessages;