import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaUserFriends,
  FaCommentDots,
  FaBell,
  FaEllipsisH,
  FaHome,
} from "react-icons/fa";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useUser } from "../context/userContext";
// import api from "../components/api";

const LeftSide = () => {
  const nav = useNavigate();
  const { user, setUser } = useUser();
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    api
      .get("/chatbox/", user.token)
      .then((data) => setChatList(data))
      .catch((error) => console.error("Error fetching chats:", error));
    console.log("chat++", chatList);
  }, []);

  return (
    <>
      <div className="left-side w-1/5  flex flex-col">
        <div className="flex items-center p-4">
          <img
            alt="User Avatar"
            className="rounded-full"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            width="40"
          />
          <span className="ml-2 text-xl font-bold">Nguyễn Văn A</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="flex p-2">
            <input
              className="w-full p-2 rounded"
              placeholder="Tìm kiếm"
              type="text"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="font-bold">Ưu tiên</span>
              <span className="text-sm">Khác</span>
            </div>
            <div className="mt-2">
              {/* Chat List Items */}
              {/* {chatList.map((chat) => ( */}
              <div
                // key={chat.id}
                className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer"
              >
                <img
                  alt="Style of fashion"
                  className="rounded-full"
                  height="40"
                  src="https://storage.googleapis.com/a1aa/image/7AGzTgmyFdxqwN41M3WawJDoRabhCpaYJpVhnJKTLrk.jpg"
                  width="40"
                />
                <div className="ml-2">
                  <div className="font-bold">Mr A</div>
                  <div className="text-sm">Bạn: Hình ảnh</div>
                </div>
                <div className="ml-auto">
                  <div className="ml-auto text-sm">7 giờ</div>
                  <Badge count={5} offset={[10, 10]}></Badge>
                </div>
              </div>
              {/* ))} */}

              <div className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer">
                <img
                  alt="Ảnh cho Học tập và Công v..."
                  className="rounded-full"
                  height="40"
                  src="https://storage.googleapis.com/a1aa/image/rnfhq_xKph5zf1eh0wDpWamBhURpIBWw2atqPhDkHLs.jpg"
                  width="40"
                />
                <div className="ml-2">
                  <div className="font-bold">Ms B</div>
                  <div className="text-sm">Toi day</div>
                </div>
                <div className="ml-auto">
                  <div className="ml-auto text-sm">1 giờ</div>
                  <Badge count={0} offset={[10, 10]}></Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between cursor-pointer text-xl">
            <FaHome onClick={() => nav("/")} />
            <FaCog onClick={() => nav("/settings")} />
            <FaUserFriends />
            <FaCommentDots />
            <FaBell />
            <FaEllipsisH />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSide;
