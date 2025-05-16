import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../components/api";
import { useUser } from "../../../components/context/userContext";
import { BsChatSquareText } from "react-icons/bs";
import { LuChevronsRightLeft } from "react-icons/lu";
import { IoGitCommitOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Chat_rooms = () => {
  const id = useParams();
  const { user, setUser } = useUser();
  const [isGroup, setIsGroup] = useState(false);
  const [room, setRoom] = useState({});
  const [messs, setMesss] = useState([]);
  const [to, setTo] = useState({});
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
            <div className="top_info">
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
            </div>
            <div className="chat_view"></div>
            <div className="send_tool"></div>
          </div>
          <div className="room_config">
            <div className="title">Tùy chỉnh cuộc trò chuyện</div>
          </div>
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
