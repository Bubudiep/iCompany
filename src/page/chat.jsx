import React from "react";
import "../assets/css/chat.css";
import {
  FaCog,
  FaUserFriends,
  FaCommentDots,
  FaBell,
  FaEllipsisH,
  FaPhone,
  FaVideo,
  FaSearch,
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaImage,
  FaThumbtack,
  FaUserPlus,
} from "react-icons/fa";

const Chat = () => {
  return (
    <>
      {/*left side  */}
      <div class="left-side w-1/5 bg-gray-700 text-white flex flex-col">
        <div class="flex items-center p-4">
          <img
            alt="User Avatar"
            class="rounded-full"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
            width="40"
          />
          <span class="ml-2">Nguyễn Quang Huy</span>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="p-2">
            <input
              class="w-full p-2 rounded bg-gray-600 placeholder-white"
              placeholder="Tìm kiếm"
              type="text"
            />
          </div>
          <div class="p-2">
            <div class="flex items-center justify-between">
              <span class="font-bold">Ưu tiên</span>
              <span class="text-sm">Khác</span>
            </div>
            <div class="mt-2">
              {/* Chat List Items */}
              <div class="flex items-center p-2 hover:bg-blue-600 rounded cursor-pointer">
                <img
                  alt="Style of fashion"
                  class="rounded-full"
                  height="40"
                  src="https://storage.googleapis.com/a1aa/image/7AGzTgmyFdxqwN41M3WawJDoRabhCpaYJpVhnJKTLrk.jpg"
                  width="40"
                />
                <div class="ml-2">
                  <div class="font-bold">Mr A</div>
                  <div class="text-sm">Bạn: Hình ảnh</div>
                </div>
                <div class="ml-auto text-sm">7 giờ</div>
              </div>

              <div class="flex items-center p-2 hover:bg-blue-600 rounded cursor-pointer">
                <img
                  alt="Ảnh cho Học tập và Công v..."
                  class="rounded-full"
                  height="40"
                  src="https://storage.googleapis.com/a1aa/image/rnfhq_xKph5zf1eh0wDpWamBhURpIBWw2atqPhDkHLs.jpg"
                  width="40"
                />
                <div class="ml-2">
                  <div class="font-bold">Ms B</div>
                  <div class="text-sm">2 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-2">
          <div class="flex items-center justify-between ">
            <span class="font-bold">Home</span>
            <FaCog />
            <FaUserFriends />
            <FaCommentDots />
            <FaBell />
            <FaEllipsisH />
          </div>
        </div>
      </div>
      {/* Main Chat Area  */}
      <div class="flex-1 flex flex-col">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center">
            <img
              alt="DEV Team"
              class="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/wOjPVEQgLVtFaveS0SUzjGnh8G_YRxK6ETzmMOSPuN4.jpg"
              width="40"
            />
            <div class="ml-2">
              <div class="font-bold">Duck Team</div>
              <div class="text-sm text-gray-500">5 thành viên</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 cursor:pointer ">
            <FaPhone />
            <FaVideo />
            <FaSearch />
            <FaEllipsisH />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div class="flex items-start mb-4">
            <img
              alt="User Avatar"
              class="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              width="40"
            />
            <div class="ml-2">
              <div class="bg-white p-2 rounded shadow">
                <div class="font-bold">Mr A</div>
                <div class="text-sm">
                  <p>Chào mọi người</p>
                </div>
              </div>
              <div class="text-sm text-gray-500 mt-1">10:35 Hôm nay</div>
            </div>
          </div>

          <div class="flex items-start mb-4">
            <img
              alt="User Avatar"
              class="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              width="40"
            />
            <div class="ml-2">
              <div class="bg-white p-2 rounded shadow">
                <div class="font-bold">Nguyễn Quang Huy</div>
                <div class="text-sm">nice to meet you today</div>
              </div>
              <div class="text-sm text-gray-500 mt-1">10:36</div>
            </div>
          </div>

          <div class="flex items-start mb-4">
            <img
              alt="User Avatar"
              class="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              width="40"
            />
            <div class="ml-2">
              <div class="bg-white p-2 rounded shadow">
                <div class="font-bold">Ms B</div>

                <div class="text-sm">me too</div>
              </div>
              <div class="text-sm text-gray-500 mt-1">11:39</div>
            </div>
            {/* myself message in right*/}
            <div class="ml-auto">
              <div class="bg-blue-100 p-2 mt-10 rounded shadow">
                <div class="text-sm">hello everyone</div>
                <div class="text-sm text-gray-500 mt-1">11:40</div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t">
          <div class="flex items-center">
            <input
              class="flex-1 p-2 rounded border"
              placeholder="Nhập @, tin nhắn tới Duck Team"
              type="text"
            />
            <div class="flex items-center space-x-2 ml-2 cursor-pointer">
              <i class="fas fa-smile">Send</i>
              <FaSmile />
              <FaPaperclip />
              <FaMicrophone />
              <FaImage />
              <FaEllipsisH />
            </div>
          </div>
        </div>
      </div>
      {/* right side */}
      <div class="w-1/5 bg-white border-l p-4">
        <div class="flex items-center">
          <img
            alt="DEV Team"
            class="rounded-full"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/wOjPVEQgLVtFaveS0SUzjGnh8G_YRxK6ETzmMOSPuN4.jpg"
            width="40"
          />
          <div class="ml-2">
            <div class="font-bold">Duck Team</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center space-x-4">
            <div class="flex flex-col items-center">
              <span class="text-sm">
                <FaBell />
                Tắt thông báo
              </span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm">
                <FaThumbtack />
                Ghim hội thoại
              </span>
            </div>
            <div class="flex flex-col ">
              <span class="text-sm">
                <FaUserPlus />
                Thêm thành viên
              </span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm">
                <FaCog />
                Quản lý nhóm
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="font-bold">Thành viên nhóm</div>
          <div class="text-sm">5 thành viên</div>
        </div>
        <div class="mt-4">
          <div class="font-bold">Bảng tin nhóm</div>
          <div class="text-sm">Danh sách nhắc hẹn</div>
          <div class="text-sm">Ghi chú, ghim, bình chọn</div>
        </div>
        <div class="mt-4">
          <div class="font-bold">Ảnh/Video</div>
          <div class="text-sm">
            Chưa có Ảnh/Video được chia sẻ trong hội thoại này
          </div>
        </div>
        <div class="mt-4">
          <div class="font-bold">File</div>
          <div class="flex items-center space-x-2">
            <i class="fas fa-file-alt"></i>
            <div class="text-sm">.env</div>
            <div class="text-sm">153 B</div>
            <div class="text-sm">29/03/2025</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
