import React, { useEffect, useState } from "react";
import icon from "../../../assets/image/chat_icon.png";
import { TbNotification } from "react-icons/tb";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import TimeSinceText from "./../../../components/ui/timesinceText";
import dayjs from "dayjs";

const Message_chat_box = ({ messages, user }) => {
  const [loading, setLoading] = useState(false);
  const msg_box = (msg, index) => {
    const isMyMsg = msg.sender === user.id;
    const from = user?.company?.staff?.find((staff) => staff.id === msg.sender);
    return (
      <div className={`msg ${isMyMsg ? "me" : "other"}`}>
        {isMyMsg ? <></> : <div className="avatar"></div>}
        <div className="box">
          <div className="text-[15px]">{msg.message}</div>
          {messages?.[index + 1]?.sender === msg.sender &&
          dayjs(messages?.[index + 1]?.created_at).diff(
            dayjs(msg?.created_at),
            "hour"
          ) <= 1 ? (
            <></>
          ) : (
            <div className="time text-[11px] text-[#818181]">
              {dayjs(msg.created_at).format("hh:mm")}
            </div>
          )}
        </div>
      </div>
    );
  };
  useEffect(() => {}, []);
  return (
    <div className="chat_view fadeInTop">
      {!messages ? (
        <></>
      ) : messages.length > 0 ? (
        <div className="msgs">
          {messages
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
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
  );
};

export default Message_chat_box;
