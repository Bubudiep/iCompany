import React from "react";
import {
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaImage,
  FaEllipsisH,
} from "react-icons/fa";

const MessageInput = ({ value, onChange, onSend, onKeyDown }) => {
  return (
    <div className="bg-white p-4 border-t">
      <div className="flex items-center">
        <input
          className="flex-1 p-2 rounded border"
          placeholder="Nhập tin nhắn..."
          type="text"
          value={value}
          onChange={(e) => onChange(e)}
          onKeyDown={onKeyDown}
        />
        <button
          onClick={onSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          Gửi
        </button>
        <div className="flex items-center space-x-2 ml-2 cursor-pointer">
          <FaSmile />
          <FaPaperclip />
          <FaMicrophone />
          <FaImage />
          <FaEllipsisH />
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
