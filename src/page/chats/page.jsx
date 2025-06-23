import React, { useEffect, useState } from "react";
import LeftNav from "../../components/layout/LeftNav";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import { Button, Empty, Image, Tooltip } from "antd";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import New_chats from "../../components/chat/new_chat";
import { FaEye, FaUser } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const Chat_page = () => {
  const id = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [chatboxs, setChatboxs] = useState([]);
  useEffect(() => {
    const all_rooms = JSON.parse(localStorage.getItem("rooms") || "[]").filter(
      (r) => r != null && r != undefined
    );
    localStorage.setItem(
      "rooms",
      JSON.stringify([
        ...all_rooms.map((old_chat) => {
          const find = user?.chatbox?.find((cbox) => cbox.id === old_chat.id);
          if (find) {
            return { ...old_chat, ...find };
          }
        }),
        ...user?.chatbox?.filter(
          (new_chat) => !all_rooms.find((item) => item.id === new_chat.id)
        ),
      ])
    );
    const all_chatBox = JSON.parse(
      localStorage.getItem("rooms") || "[]"
    ).filter((r) => r != null && r != undefined);
    setChatboxs(all_chatBox);
  }, [user?.chatbox, id?.id_room]);
  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftNav>
        <div className="tools p-2 flex items-center justify-between h-[60px] border-b-1 border-b-[#d6d6d6]">
          <div className="text-[18px]">{chatboxs.length} cuộc trò chuyện</div>
          <New_chats>
            <Button
              type="primary"
              icon={<HiOutlineChatBubbleLeftRight size={18} className="mt-1" />}
            ></Button>
          </New_chats>
        </div>
        {chatboxs.length > 0 ? (
          <div className="chat_items">
            {chatboxs
              .sort(
                (a, b) =>
                  new Date(b?.last_have_message_at || "1999-01-01 01:01:01") -
                  new Date(a?.last_have_message_at || "1999-01-01 01:01:01")
              )
              .map((chat) => {
                const to = chat?.members?.find((item) => item.id != user?.id);
                return (
                  <Link
                    to={`/app/chat/${chat.id}`}
                    key={chat.id}
                    className={`item fadeInTop ${
                      id?.id_room == chat.id ? "active" : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="avatar !rounded-[12px]">
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
                          <FaUser size={20} />
                        )}
                      </div>
                      {user?.onlines?.find((user) => user.id === to?.id) && (
                        <Tooltip title="Đang hoạt động">
                          <div
                            className="absolute right-0 bottom-0
                            w-[12px] h-[12px] bg-[#07c400] rounded-full border-2 border-[#fff]"
                          ></div>
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="name">
                        {to?.profile?.full_name || to?.cardID}
                      </div>
                      <div className="msg">
                        {chat?.last_message ? (
                          <>
                            {chat?.last_message?.sender === user.id ? (
                              "Bạn: "
                            ) : (
                              <>
                                {to?.profile?.nick_name ||
                                  to?.profile?.full_name ||
                                  to?.cardID}
                                :{" "}
                              </>
                            )}
                            {chat?.last_message?.message}
                          </>
                        ) : (
                          <>Chưa có tin nhắn</>
                        )}
                      </div>
                    </div>
                    {chat?.not_read > 0 && (
                      <div
                        className="unread absolute w-[18px] h-[18px] bg-[red] flex pt-0.1 right-2
                        items-center justify-center text-white rounded-full text-[10px] font-[bold]"
                      >
                        {chat?.not_read}
                      </div>
                    )}
                  </Link>
                );
              })}
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center">
            <Empty description="Chưa có cuộc trò chuyện nào!" />
            <New_chats>
              <Button
                type="primary"
                icon={
                  <HiOutlineChatBubbleLeftRight size={18} className="mt-1" />
                }
              >
                Cuộc trò chuyện mới
              </Button>
            </New_chats>
          </div>
        )}
      </LeftNav>
      <Outlet context={{ rooms: chatboxs }} key={location.pathname} />
    </div>
  );
};

export default Chat_page;
