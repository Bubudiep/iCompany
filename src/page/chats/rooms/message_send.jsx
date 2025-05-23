import React, { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { Button, Input } from "antd";
import EmojiShow from "../../../components/ui/emojiPicker";
import { MdEmojiEmotions } from "react-icons/md";
import api from "../../../components/api";

const Message_send = ({
  room_id,
  user,
  setUser,
  setMesss,
  scrollToBottom,
  rooms,
}) => {
  const [msg, setMsg] = useState("");
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const handleEmoji = (e) => {
    setMsg((old) => `${old + e.emoji.trim()}`);
    inputRef?.current?.focus();
  };
  const handleSendMessage = () => {
    if (!msg || !room_id || !user.token || loading) return;
    setLoading(true);
    setOpenEmoji(false);
    api
      .post(
        `/chatbox/${room_id}/chat/`,
        {
          message: msg,
        },
        user.token
      )
      .then((res) => {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
        setMesss((old) => [...old, res]);
        setUser((old) => ({
          ...old,
          chatbox: old.chatbox.map((chat) =>
            chat.id == room_id
              ? {
                  ...chat,
                  not_read: 0,
                  last_message: res,
                  last_have_message_at: res.created_at,
                }
              : chat
          ),
        }));
        localStorage.setItem(
          "rooms",
          JSON.stringify(
            rooms.map((r) =>
              r.id == room_id
                ? {
                    ...r,
                    message: {
                      total: r.message.total + 1,
                      data: [...r.message.data, res],
                    },
                  }
                : r
            )
          )
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    setMsg("");
    inputRef?.current?.focus();
  };
  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  const emojiMap = {
    ":v": "😅",
    ":D": "😆",
    ":)": "😊",
    ":(": "😢",
    ":w": "🤨",
    ":@@": "🙄",
  };
  const replaceEmojis = (text) => {
    for (const [key, value] of Object.entries(emojiMap)) {
      text = text.replaceAll(key, value);
    }
    return text;
  };
  useEffect(() => {
    setMsg(replaceEmojis(msg));
  }, [msg]);
  return (
    <div className="send_tool flex flex-col mt-auto">
      <div className="flex justify-between items-center p-1 border-b-1 border-b-[#d6d6d6] shadow-2xl">
        <div className="left flex gap-1"></div>
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
        <div className="">
          <EmojiShow
            callback={handleEmoji}
            openEmoji={openEmoji}
            setOpenEmoji={setOpenEmoji}
            refocus={() => inputRef?.current?.focus()}
          >
            <Button
              type="text"
              className="!p-4"
              icon={
                <MdEmojiEmotions
                  size={28}
                  className="mt-1 !text-[#87b2e7] hover:!text-[#197efb] transition-all duration-300"
                />
              }
            ></Button>
          </EmojiShow>
        </div>
        <div
          className="send text-[#65b6ec] hover:text-[#0099ff] cursor-pointer 
          transition-all duration-300 p-2"
        >
          <BiSend size={32} />
        </div>
      </div>
    </div>
  );
};

export default Message_send;
