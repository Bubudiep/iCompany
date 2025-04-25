import React from "react";
import { Button } from "antd";
import { FaReply } from "react-icons/fa";

const ReplyPreview = ({
  replyingTo,
  user,
  isGroupChat,
  receiver,
  handleCancelReply,
}) => {
  if (!replyingTo) return null;

  return (
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
  );
};

export default ReplyPreview;
