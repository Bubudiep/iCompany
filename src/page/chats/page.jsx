import React, { useEffect, useState } from "react";
import LeftNav from "../../components/layout/LeftNav";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/userContext";
import { Button, Empty, Tooltip } from "antd";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import New_chats from "../../components/chat/new_chat";
import { FaUser } from "react-icons/fa";

const Chat_page = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [chatboxs, setChatboxs] = useState([]);
  const [activeChat, setActiveChat] = useState(0);
  useEffect(() => {
    setChatboxs(user?.chatbox);
  }, [user?.chatbox]);
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
            {chatboxs.map((chat) => {
              const to = chat?.members?.find((item) => item.id != user?.id);
              return (
                <Link
                  to={`/app/chat/${chat.id}`}
                  key={chat.id}
                  className={`item ${
                    activeChat.id === chat.id ? "active" : ""
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="avatar">
                    {to?.profile?.avatar ? (
                      <img src={to?.profile?.avatar} />
                    ) : (
                      <FaUser size={20} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="name">
                      {to?.profile?.full_name || to?.cardID}
                    </div>
                    <div className="msg">
                      {chat?.last_message ? <></> : <>Chưa có tin nhắn</>}
                    </div>
                  </div>
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
      <Outlet context={{ chat: activeChat }} key={location.pathname} />
    </div>
  );
};

export default Chat_page;
