import React, { useEffect, useRef, useState } from "react";
import icon from "../../../assets/image/chat_icon.png";
import { TbNotification } from "react-icons/tb";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import TimeSinceText from "./../../../components/ui/timesinceText";
import dayjs from "dayjs";
import Message_send from "./message_send";
import api from "../../../components/api";
import { useLocation } from "react-router-dom";
import app from "../../../components/app";
import { Image } from "antd";
import { RiLoader4Fill } from "react-icons/ri";

const Message_chat_box = ({
  messages,
  user,
  setUser,
  room_id,
  setMesss,
  rooms,
}) => {
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const box_ref = useRef();
  const [haveNewMessage, sethaveNewMessage] = useState(false);
  const location = useLocation();
  const msg_box = (msg, index) => {
    const isMyMsg = msg.sender === user.id;
    const from = user?.company?.Staff?.find((staff) => staff.id === msg.sender);
    console.log(from, msg.sender);
    return (
      <>
        {messages?.[index - 1]?.id ? (
          dayjs(messages?.[index + 1]?.created_at).format("DD") !==
            dayjs(msg?.created_at).format("DD") && (
            <div className="flex justify-center text-[#999] text-[13px]">
              <div className="bg-[#ffffffa2] rounded-[6px] p-1 px-2 my-0.5">
                {app.timeDiff(msg?.created_at)}
              </div>
            </div>
          )
        ) : (
          <>
            {/* <div className="flex justify-center text-[#999] text-[13px]">
              <div className="bg-[#ffffffa2] rounded-[6px] p-1 px-2 my-0.5">
                {app.timeDiff(msg?.created_at)}
              </div>
            </div> */}
          </>
        )}
        <div className={`msg ${isMyMsg ? "me" : "other"}`}>
          {isMyMsg ? (
            <></>
          ) : messages?.[index + 1]?.sender === msg.sender &&
            dayjs(messages?.[index + 1]?.created_at).diff(
              dayjs(msg?.created_at),
              "minute"
            ) <= 2 ? (
            <div className="w-[38px]"></div>
          ) : (
            <div className="avatar">
              <Image
                className="w-full h-full"
                src={from?.profile?.avatar_base64}
              />
            </div>
          )}
          <div className="box">
            <div className="text-[15px] whitespace-pre-line">{msg.message}</div>
            <div className="time text-[11px] text-[#818181] flex items-center">
              {messages?.[index - 1]?.sender === msg.sender &&
              dayjs(messages?.[index - 1]?.created_at).diff(
                dayjs(msg?.created_at),
                "minute"
              ) <= 2 ? (
                <></>
              ) : (
                <>{dayjs(msg.created_at).format("HH:mm")}</>
              )}
              {msg?.sending && (
                <div className="ml-auto text-[#0088e2]">
                  <RiLoader4Fill className="spining" />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      sethaveNewMessage(false);
    }, 300);
  };
  useEffect(() => {
    const handleUserActivity = (e) => {
      const old_chat = user?.chatbox?.find((box) => box.id == room_id);
      if (old_chat && old_chat.not_read > 0) {
        api.post(`/chatbox/${room_id}/readed/`, {}, user.token).then(() => {
          setUser((old) => {
            const config = old.app_config || {};
            return {
              ...old,
              chatbox: old.chatbox.map((item) =>
                item.id === old_chat.id ? { ...item, not_read: 0 } : item
              ),
              app_config: {
                ...config,
                chat_not_read: (config.chat_not_read || 0) - old_chat.not_read,
              },
            };
          });
        });
      }
      const { scrollTop, scrollHeight, clientHeight } = box_ref.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 100;
      sethaveNewMessage(false);
    };
    const events = ["click", "keydown", "wheel", "touchstart", "scroll"];
    events.forEach((event) =>
      document.addEventListener(event, handleUserActivity)
    );
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleUserActivity)
      );
    };
  }, [user?.chatbox]);
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, []);
  useEffect(() => {
    const this_room = user?.chatbox?.find((box) => box?.id == room_id);
    if (this_room?.new_message) {
      const { scrollTop, scrollHeight, clientHeight } = box_ref.current;
      console.log(scrollHeight, scrollTop);
      const isBottom = scrollTop >= -200;
      console.log("Load tin nhắn mới...", isBottom);
      const combined = [...messages, ...this_room?.new_message];
      const unique = Array.from(
        new Map(combined.map((msg) => [msg.id, msg])).values()
      );
      setMesss((old) => {
        localStorage.setItem(
          "rooms",
          JSON.stringify(
            rooms.map((r) =>
              r.id == room_id
                ? {
                    ...r,
                    message: {
                      total: unique.length,
                      data: unique,
                    },
                  }
                : r
            )
          )
        );
        return unique;
      });
      setTimeout(() => {
        if (isBottom) {
          scrollToBottom();
        } else {
          sethaveNewMessage(true);
        }
      }, 300);
    }
  }, [user?.chatbox?.find((box) => box.id == room_id)?.new_message, location]);
  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {haveNewMessage && (
        <div className="absolute top-2 z-[101] left-[50%] flex justify-center w-0">
          <div
            onClick={() => {
              scrollToBottom();
            }}
            className="text-[#0084ff] border-1 text-nowrap bg-white 
            p-1.5 px-3 rounded-[8px] shadow shadow-[#0003] font-[500]"
          >
            Có tin nhắn mới
          </div>
        </div>
      )}
      <div className="chat_view">
        {!messages ? (
          <></>
        ) : messages.length > 0 ? (
          <div className="msgs" ref={box_ref}>
            <div ref={bottomRef} />
            {messages
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((msg, index) => (
                <div key={msg.id}>{msg_box(msg, index)}</div>
              ))}
          </div>
        ) : (
          <div className="flex flex-1 items-start pt-10 justify-center fadeInTop">
            <div className="whitebox !p-6 gap-4 !px-12">
              <div className="flex flex-col gap-4">
                <div className="icon flex gap-4">
                  <div className="icon max-w-[100px] flex items-center">
                    <img src={icon} className="w-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-[32px] font-[700] text-[#00aeff]">
                      Chat
                    </div>
                    <div className="text-[14px] font-[500] flex items-center gap-1 text-[#00aeff]">
                      <TbNotification className="text-[#00aeff] text-[20px]" />
                      Không mất lịch sử trò chuyện
                    </div>
                    <div className="text-[14px] font-[500] flex items-center gap-1 text-[#00aeff]">
                      <AiOutlineAppstoreAdd className="text-[#00aeff] text-[20px]" />
                      Tiện ích thêm với phê duyệt và giao việc
                    </div>
                  </div>
                </div>
                <div className="description text-[#1672af] font-[400] text-[16px]">
                  " Gửi lời chào để chia sẻ những câu chuyện cùng nhau! "
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Message_send
        room_id={room_id}
        user={user}
        scrollToBottom={scrollToBottom}
        setUser={setUser}
        messages={messages}
        setMesss={setMesss}
        rooms={rooms}
      />
    </div>
  );
};

export default Message_chat_box;
