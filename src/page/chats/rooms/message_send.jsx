import React, { useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { Button, Input } from "antd";
import EmojiShow from "../../../components/ui/emojiPicker";
import { MdEmojiEmotions } from "react-icons/md";

const Message_send = () => {
  const [msg, setMsg] = useState("");
  const inputRef = useRef();
  const [openEmoji, setOpenEmoji] = useState(false);
  const handleEmoji = (e) => {
    setMsg((old) => `${old + e.emoji.trim()}`);
    inputRef?.current?.focus();
  };
  const handleSendMessage = () => {
    setMsg("");
    inputRef?.current?.focus();
  };
  return (
    <div className="send_tool fadeInTop flex flex-col mt-auto">
      <div className="flex justify-between items-center p-1 border-b-1 border-b-[#d6d6d6] shadow-2xl">
        <div className="left flex gap-1">
          <EmojiShow
            callback={handleEmoji}
            refocus={() => inputRef?.current?.focus()}
          >
            <Button
              type="text"
              icon={
                <MdEmojiEmotions size={20} className="mt-1 !text-gray-600" />
              }
            ></Button>
          </EmojiShow>
        </div>
        <div className="right"></div>
      </div>
      <div className="flex flex-1 justify-between items-center px-2 py-2 gap-2 bg-white">
        <div className="flex flex-1">
          <Input.TextArea
            rows={1}
            className="chat-input"
            placeholder="Nhập tin nhắn..."
            autoSize={{ maxRows: 3, minRows: 1 }}
            value={msg}
            classNames="py-2"
            ref={inputRef}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSendMessage();
                e.preventDefault();
              }
            }}
          />
        </div>
        <div
          className="send text-[#65b6ec] hover:text-[#0099ff] cursor-pointer transition-all duration-300 
          hover:mr-1 p-2"
        >
          <BiSend size={32} />
        </div>
      </div>
    </div>
  );
};

export default Message_send;
