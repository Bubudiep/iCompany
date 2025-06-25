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
import { Image, message, Spin } from "antd";
import { RiLoader4Fill } from "react-icons/ri";
import Chat_message_card from "./message_card";

const Message_chat_box = ({
  messageList,
  user,
  setUser,
  room_id,
  setMesss,
  rooms,
}) => {
  const [last, setlast] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const box_ref = useRef();
  const [haveNewMessage, sethaveNewMessage] = useState(false);
  const location = useLocation();
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      sethaveNewMessage(false);
    }, 300);
  };
  useEffect(() => {
    const handleUserActivity = (e) => {
      console.log(e);
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
      if (box_ref?.current && e?.type === "wheel") {
        const { scrollTop, scrollHeight, clientHeight } = box_ref?.current;
        const isBottom = scrollTop - clientHeight <= -scrollHeight + 10;
        if (isBottom && !loading) {
          console.log("load tin nhắn cũ....");
          setLoading(true);
          const minId = Math.min(...messageList.map((m) => m.id));
          api
            .get(`/message/?room_id=${room_id}&last_id=${minId}`, user?.token)
            .then((res) => {
              if (res?.count === 0) {
                setlast(true);
                message.info("Không còn tin nhắn nữa!");
              }
              setMesss((old) => [...old, ...res.results]);
            })
            .finally(() => setLoading(false));
        }
      }
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
  }, [user?.chatbox, loading]);
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, []);
  useEffect(() => {
    const this_room = user?.chatbox?.find((box) => box?.id == room_id);
    if (this_room?.new_message) {
      const { scrollTop, scrollHeight, clientHeight } = box_ref?.current;
      console.log(scrollHeight, scrollTop);
      const isBottom = scrollTop >= -200;
      console.log("Load tin nhắn mới...", isBottom);
      const combined = [...messageList, ...this_room?.new_message];
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
      {loading && (
        <div className="absolute top-2 z-[101] left-[50%] flex justify-center w-0">
          <div
            className="text-[#0084ff] text-nowrap bg-white 
            p-2 px-12 gap-2 rounded-[8px] flex flex-col shadow shadow-[#0003]"
          >
            <Spin className="!mt-2" />
            Đang tải...
          </div>
        </div>
      )}
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
        {!messageList ? (
          <></>
        ) : messageList.length > 0 ? (
          <div className="msgs" ref={box_ref}>
            <div ref={bottomRef} />
            {messageList
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((msg, index) => (
                <Chat_message_card
                  key={msg.id}
                  user={user}
                  msg={msg}
                  index={index}
                  messageList={messageList}
                />
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
        messageList={messageList}
        setMesss={setMesss}
        rooms={rooms}
      />
    </div>
  );
};

export default Message_chat_box;
