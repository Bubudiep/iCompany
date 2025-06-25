import dayjs from "dayjs";
import React, { useState } from "react";
import { RiLoader4Fill } from "react-icons/ri";
import app from "../../../components/app";
import { Image } from "antd";

const Chat_message_card = ({ msg, index, user, messages }) => {
  const isMyMsg = msg.sender === user.id;
  const from = user?.company?.Staff?.find((staff) => staff.id === msg.sender);
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

export default Chat_message_card;
