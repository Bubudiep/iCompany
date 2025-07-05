import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { BsChatSquareText, BsGear } from "react-icons/bs";
import { LuChevronsRightLeft, LuListTodo, LuMailCheck } from "react-icons/lu";
import { IoGitCommitOutline } from "react-icons/io5";
import { FaEye, FaUser } from "react-icons/fa";
import Message_chat_box from "./message_box";
import { Button, Image, Spin, Tooltip } from "antd";
import Message_send from "./message_send";
import { GoDotFill } from "react-icons/go";

const Chat_rooms = () => {
  const id = useParams();
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]").filter(
    (room) => room != null && room != undefined
  );
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const [leftTab, setLeftTab] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [room, setRoom] = useState(
    JSON.parse(localStorage.getItem("rooms") || "[]")?.filter(
      (room) => room?.id == id?.id_room
    ) || {}
  );
  const [messs, setMesss] = useState(false);
  const [to, setTo] = useState({});
  const tools = [
    {
      title: "Danh sách công việc",
      icon: <LuListTodo size={20} />,
      tab: 3,
    },
    {
      title: "Danh sách phê duyệt",
      icon: <LuMailCheck size={20} />,
      tab: 2,
    },
    {
      title: "Tùy chỉnh cuộc trò chuyện",
      icon: <BsGear size={20} />,
      tab: 1,
    },
  ];
  const syncMess = (old_mes = []) => {
    api
      .get(`/chatbox/${id?.id_room}/`, user.token)
      .then((res) => {
        setIsGroup(res?.is_group);
        setTo(res?.members?.find((item) => item.id !== user.id));
        let max = 1;
        const combined = [...old_mes, ...res?.message?.data];
        const unique = Array.from(
          new Map(combined.map((msg) => [msg.id, msg])).values()
        );
        setUser((old) => ({
          ...old,
          chatbox: old.chatbox.map((box) =>
            box.id == id?.id_room ? { ...box, not_read: 0 } : box
          ),
          app_config: {
            ...old,
            chat_not_read:
              (old.chat_not_read || 0) -
              (old.chatbox.find((box) => box.id == id?.id_room)?.not_read || 0),
          },
        }));
        setRoom(res);
        setMesss(unique);
        max = Math.max(...unique.map((item) => item.id));
        localStorage.setItem(
          "rooms",
          JSON.stringify(
            rooms.map((r) =>
              r.id === res.id
                ? {
                    ...res,
                    not_read: 0,
                    message: { ...res.message, data: unique },
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
  };
  useEffect(() => {
    if (id?.id_room && messs?.length > 1) {
      const old = JSON.parse(localStorage.getItem("rooms") || "[]");
      const old_room = old.find((item) => item.id == id?.id_room);
      const combined = [...old_room?.message?.data, ...messs];
      const unique = Array.from(
        new Map(combined.map((msg) => [msg.id, msg])).values()
      );
      localStorage.setItem(
        "rooms",
        JSON.stringify([
          ...old.filter((item) => item.id != id?.id_room),
          {
            ...old_room,
            message: {
              total: unique.length,
              data: unique,
            },
          },
        ])
      );
    }
  }, [messs]);
  useEffect(() => {
    if (id?.id_room) {
      const old_data = rooms.find((room) => room && room?.id == id?.id_room);
      if (old_data) {
        setRoom(old_data);
        setMesss(old_data?.message?.data);
        setIsGroup(old_data?.is_group);
        setTo(old_data?.members?.find((item) => item.id !== user.id));
      }
      syncMess(old_data?.message?.data);
    }
    window.socket.on("message", (data) => {
      if (data.type === "message") {
        console.log("Data from socket messages: ", data);
      }
    });
  }, [id]);
  return (
    <>
      {id?.id_room ? (
        <div className="flex room_main">
          {!room.id ? (
            <>
              <div className="flex flex-1 p-10 flex-col gap-3 items-center justify-center">
                <Spin size="large" />
                <div className="text-[#999]">Đang tải dữ liệu...</div>
              </div>
            </>
          ) : (
            <>
              <div className="room_info">
                <div className="top_info min-h-[60px]">
                  <div className="avatar w-[50px] h-[50px] overflow-hidden">
                    {isGroup ? (
                      <></>
                    ) : (
                      <>
                        {to?.profile?.avatar_base64 ? (
                          <Image
                            src={to?.profile?.avatar_base64}
                            preview={{
                              mask: (
                                <span className="text-[14px]">
                                  <FaEye />
                                </span>
                              ),
                            }}
                          />
                        ) : (
                          <FaUser />
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="name text-[16px]">
                      {isGroup ? (
                        <></>
                      ) : (
                        <>
                          {to?.profile?.full_name || (
                            <>
                              {to?.cardID} ({to?.department_name})
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="remark flex items-center text-[#999]">
                      <IoGitCommitOutline className="mt-0.5 mr-1" size={18} />
                      <div className="text-[13px]">
                        {to?.department_name || "Bộ phận"} (
                        {to?.possition_name || "Chức vụ"})
                      </div>
                    </div>
                  </div>
                  <div className="tools ml-auto gap-2 flex mr-1 items-center">
                    {user?.onlines?.find((user) => user.id === to?.id) && (
                      <div
                        className="text-[#fff] bg-[#00a2ff] font-[500] flex gap-1 items-center
                        p-1.5 px-2 rounded-[4px]"
                      >
                        <GoDotFill className="mr-1" />
                        <div className="text-[11px]">Hoạt động</div>
                      </div>
                    )}
                    {tools.map(({ title, icon, tab }) => (
                      <Tooltip
                        key={tab}
                        color="white"
                        title={<div className="text-[#000]">{title}</div>}
                      >
                        <button
                          className={`chat_tools ${
                            leftTab === tab ? "active" : ""
                          }`}
                          onClick={() => {
                            if (leftTab === tab) {
                              setLeftTab(false);
                            } else {
                              setLeftTab(tab);
                            }
                          }}
                        >
                          {icon}
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <Message_chat_box
                  user={user}
                  messageList={messs}
                  room_id={id?.id_room}
                  setMesss={setMesss}
                  setUser={setUser}
                  rooms={rooms}
                />
              </div>
              {leftTab ? (
                <div className="room_config fadeInLeft">
                  <div className="title">Tùy chỉnh cuộc trò chuyện</div>
                  <div className="overflow-y-auto h-full">
                    <div className="p-4 py-10 text-center text-[#999]">
                      Đang phát triển
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col text-[#777] gap-2 flex-1 items-center justify-center">
          <div className="icon">
            <BsChatSquareText size={32} />
          </div>
          <div className="text">Chọn một cuộc trò chuyện để bắt đầu.</div>
        </div>
      )}
    </>
  );
};

export default Chat_rooms;
