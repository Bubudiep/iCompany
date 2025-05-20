import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { BsChatSquareText, BsGear } from "react-icons/bs";
import { LuChevronsRightLeft, LuListTodo, LuMailCheck } from "react-icons/lu";
import { IoGitCommitOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Message_chat_box from "./message_box";
import { Button, Tooltip } from "antd";
import Message_send from "./message_send";

const Chat_rooms = () => {
  const id = useParams();
  const { user, setUser } = useUser();
  const [leftTab, setLeftTab] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [room, setRoom] = useState({});
  const [messs, setMesss] = useState([]);
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
  const syncMess = (id) => {
    api.get(`/chatbox/${id}/`, user.token).then((res) => {
      setIsGroup(res?.is_group);
      setRoom(res);
      setMesss(res?.message?.data);
      setTo(res?.members?.find((item) => item.id !== user.id));
    });
  };
  useEffect(() => {
    if (id?.id_room) {
      syncMess(id.id_room);
    }
  }, [id]);
  return (
    <>
      {id?.id_room ? (
        <div className="flex room_main">
          <div className="room_info">
            <div className="top_info fadeInBot min-h-[60px]">
              <div className="avatar">
                {isGroup ? (
                  <></>
                ) : (
                  <>{to?.profile?.avatar ? <></> : <FaUser />}</>
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
              <div className="tools ml-auto gap-2 flex mr-1">
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
            <Message_chat_box message={messs} />
            <Message_send />
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
