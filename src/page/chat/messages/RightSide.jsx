import React from "react";
import { Avatar, Button, Collapse } from "antd";
import {
  BellOutlined,
  PushpinOutlined,
  UserAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useUser } from "../../../components/context/userContext";

const { Panel } = Collapse;

const RightSide = ({ members, avatar, chatName, isGroupChat, ghim }) => {
  const { user } = useUser();
  return (
    <div className="w-1/3 bg-white p-2 rounded-lg shadow">
      {/* Thông tin nhóm hoặc người nhận */}
      <h1 className="text-xl font-bold text-center mb-8">
        {isGroupChat ? "Thống tin nhóm" : "Thống tin người hội thoại"}
      </h1>
      <div className="text-center">
        <Avatar
          size={64}
          src={
            avatar ||
            "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          }
          className="mx-auto mb-2"
        />
        {/* Tên người nhận hoaặc nhóm chat */}
        <div className="font-bold text-lg">
          {isGroupChat
            ? chatName
            : members.find((member) => member.id !== user.id)?.username ||
              "Unknown"}
        </div>
      </div>

      {/* Các nút chức năng */}
      <div className="flex justify-around cursor-pointer text-sm">
        <div className="flex flex-col items-center">
          <BellOutlined />
          <span>Tắt thông báo</span>
        </div>
        <div className="flex flex-col items-center">
          <PushpinOutlined />
          <span>Ghim hội thoại</span>
        </div>
        {isGroupChat && (
          <>
            <div className="flex flex-col items-center">
              <UserAddOutlined />
              <span>Thêm thành viên</span>
            </div>
            <div className="flex flex-col items-center">
              <SettingOutlined />
              <span>Quản lý nhóm</span>
            </div>
          </>
        )}
      </div>

      {/* Các mục mở rộng */}
      <Collapse bordered={false} defaultActiveKey={["3"]} className="mt-6">
        {/* Thành viên nhóm */}
        <Panel
          header={<span className="font-bold">Thành viên nhóm</span>}
          key="1"
        >
          <p className="flex items-center text-sm">
            <i className="fas fa-users mr-2"></i> {members.length} thành viên
          </p>
          {members.map((member) => (
            <p key={member.id} className="flex items-center text-sm mt-2">
              <Avatar
                size={24}
                src={
                  member.profile?.avatar ||
                  "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                }
                className="mr-2"
              />
              {member.profile?.full_name || member.username || "Unknown"}
              {member.isActive && (
                <span className="ml-auto text-green-500">● Đang hoạt động</span>
              )}
            </p>
          ))}
        </Panel>

        {/* Bảng tin nhóm */}
        <Panel
          header={<span className="font-bold">Bảng tin nhóm</span>}
          key="2"
        >
          <h2 className="text-sm">Tin nhắn ghim:</h2>
          {ghim.length > 0 ? (
            ghim.map((msg) => (
              <p key={msg.id} className="text-sm">
                {members.find((member) => member.id === msg.sender)?.username}:{" "}
                {msg.message.length > 50
                  ? msg.message.slice(0, 50) + "..."
                  : msg.message}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">Chưa có tin nhắn ghim</p>
          )}
          <p className="text-sm mt-2">Danh sách nhắc hẹn (Chưa có dữ liệu)</p>
          <p className="text-sm">Ghi chú, bình chọn (Chưa có dữ liệu)</p>
        </Panel>

        {/* Ảnh/Video */}
        <Panel header={<span className="font-bold">Ảnh/Video</span>} key="3">
          {/* show 3 images */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <img
                key={index}
                src={`https://picsum.photos/200/300?random=${index}`}
                alt={`Image ${index}`}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Chưa có Ảnh/Video được chia sẻ trong hội thoại này
          </p>
        </Panel>

        {/* File */}
        <Panel header={<span className="font-bold">File</span>} key="4">
          <p className="text-sm text-gray-500">
            {/* Chưa có File được chia sẻ trong hội thoại này */}
          </p>
          {/* Ví dụ placeholder cho file (nếu có dữ liệu từ API) */}
          <div className="flex items-center space-x-2 text-sm">
            <img
              src={`https://picsum.photos/200/300?random=1`}
              alt="img"
              width={24}
              height={24}
              className=""
            />
            <span>153 B</span>
            <span>29/03/2025</span>
          </div>
        </Panel>
      </Collapse>

      <Button type="primary" block shape="round" size="medium" className="mt-4">
        Xem tất cả
      </Button>
    </div>
  );
};

export default RightSide;
