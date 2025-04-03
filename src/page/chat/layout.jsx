import React from "react";
import "../../assets/css/chat.css";

import RightSide from "../../components/messages/RightSide";
import MainChatArea from "../../components/messages/MainChatArea";
import LeftSide from "../../components/messages/LeftSide";
const Chat_layout = () => {
  return (
    <div className="flex flex-1 gap-1 pb-1">
      <div className="left-side w-1/5 whitebox fadeInRight flex flex-col">
        <div className="flex items-center p-4">
          <img
            alt="User Avatar"
            className="rounded-full"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            width="40"
          />
          <span className="ml-2">Nguyễn Quang Huy</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex p-2">
            <input
              className="w-full p-2 rounded"
              placeholder="Tìm kiếm"
              type="text"
            />
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="font-bold">Ưu tiên</span>
              <span className="text-sm">Khác</span>
            </div>
            <div className="mt-2">
              {/* Chat List Items */}
              <div className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer">
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
                <div className="ml-auto text-sm">7 giờ</div>
              </div>

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
                  <div className="text-sm">2 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between cursor-pointer text-xl">
            <FaHome onClick={() => nav("/")} />
            <FaCog />
            <FaUserFriends />
            <FaCommentDots />
            <FaBell />
            <FaEllipsisH />
          </div>
        </div>
      </div>
      <div className="flex flex-1 fadeInTop whitebox !p-0">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center h-[60px] justify-between p-4 border-b border-[#c5c5c5]">
            <div className="flex items-center">
              <img
                alt="DEV Team"
                className="rounded-full"
                height="40"
                src="https://storage.googleapis.com/a1aa/image/wOjPVEQgLVtFaveS0SUzjGnh8G_YRxK6ETzmMOSPuN4.jpg"
                width="40"
              />
              <div className="ml-2">
                <div className="font-bold">Duck Team</div>
                <div className="text-sm text-gray-500">5 thành viên</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 cursor:pointer ">
              <FaPhone />
              <FaVideo />
              <FaSearch />
              <FaEllipsisH />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <div className="flex items-start mb-4">
              <img
                alt="User Avatar"
                className="rounded-full"
                height="40"
                src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                width="40"
              />
              <div className="ml-2">
                <div className="bg-white p-2 rounded shadow">
                  <div className="font-bold">Mr A</div>
                  <div className="text-sm">
                    <p>Chào mọi người</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">10:35 Hôm nay</div>
              </div>
            </div>

            <div className="flex items-start mb-4">
              <img
                alt="User Avatar"
                className="rounded-full"
                height="40"
                src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                width="40"
              />
              <div className="ml-2">
                <div className="bg-white p-2 rounded shadow">
                  <div className="font-bold">Nguyễn Huy</div>
                  <div className="text-sm">nice to meet you today</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">10:36</div>
              </div>
            </div>

            <div className="flex items-start mb-4">
              <img
                alt="User Avatar"
                className="rounded-full"
                height="40"
                src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                width="40"
              />
              <div className="ml-2">
                <div className="bg-white p-2 rounded shadow">
                  <div className="font-bold">Ms B</div>

                  <div className="text-sm">me too</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">11:39</div>
              </div>
              {/* myself message in right*/}
              <div className="ml-auto">
                <div className="bg-blue-100 p-2 mt-10 rounded shadow">
                  <div className="text-sm">hello everyone</div>
                  <div className="text-sm text-gray-500 mt-1">11:40</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <input
                className="flex-1 p-2 rounded border"
                placeholder="Nhập @, tin nhắn tới Duck Team"
                type="text"
              />
              <div className="flex items-center space-x-2 ml-2 cursor-pointer">
                <i className="fas fa-smile">Send</i>
                <FaSmile />
                <FaPaperclip />
                <FaMicrophone />
                <FaImage />
                <FaEllipsisH />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/5 border-l border-[#c5c5c5]">
          <div className="flex items-center px-3 h-[60px] border-[#c5c5c5] border-b-1">
            <img
              alt="DEV Team"
              className="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/wOjPVEQgLVtFaveS0SUzjGnh8G_YRxK6ETzmMOSPuN4.jpg"
              width="40"
            />
            <div className="ml-2">
              <div className="font-bold">Duck Team</div>
            </div>
          </div>
          <div className="cursor-pointer flex justify-between">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col items-center">
                <span className="text-sm">
                  <FaBell />
                  {/* Tắt thông báo */}
                </span>
              </div>
              <div className="flex flex-col items-center ">
                <span className="text-sm">
                  <FaThumbtack />
                  {/* Ghim hội thoại */}
                </span>
              </div>
              <div className="flex flex-col ">
                <span className="text-sm">
                  <FaUserPlus />
                  {/* Thêm thành viên */}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm">
                  <FaCog />
                  {/* Quản lý nhóm */}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-2">
            <div className="item">
              <div className="font-bold">Thành viên nhóm</div>
              <div className="text-sm">5 thành viên</div>
            </div>
            <div className="item">
              <div className="font-bold">Bảng tin nhóm</div>
              <div className="text-sm">Danh sách nhắc hẹn</div>
              <div className="text-sm">Ghi chú, ghim, bình chọn</div>
            </div>
            <div className="item">
              <div className="font-bold">Ảnh/Video</div>
              <div className="text-sm">
                Chưa có Ảnh/Video được chia sẻ trong hội thoại này
              </div>
            </div>
            <div className="item">
              <div className="font-bold">File</div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-file-alt"></i>
                <div className="text-sm">.env</div>
                <div className="text-sm">153 B</div>
                <div className="text-sm">29/03/2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <>
      {/*left side  */}
      <LeftSide />
      {/* Main Chat Area  */}
      <MainChatArea />

      {/* right side */}
      <RightSide />
    </>
  );
};

export default Chat_layout;
