import React from "react";
import { Avatar, Button, Collapse, message } from "antd";
import { Tooltip } from "antd";
import {
  BellOutlined,
  PushpinOutlined,
  UserAddOutlined,
  SettingOutlined,
  FolderOutlined,
  FileImageOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useUser } from "../../../../components/context/userContext";
import { MdOutlineDelete, MdOutlineReportProblem } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { IoNotificationsOffOutline } from "react-icons/io5";

const { Panel } = Collapse;

const RightSide = ({ members, avatar, chatName, isGroupChat, ghim }) => {
  const { user } = useUser();

  const handleTurnOffNotification = () => {
    message.success("Thông báo đã tắt!");
  };
  const pinChatbox = () => {
    message.success("Pin chatbox thành công!");
  };
  const handleAddMember = () => {
    message.success("Thêm thành viên thành công!");
  };
  const handleManageGroup = () => {
    message.success("Quản lý nhóm thành công!");
  };

  const handleReport = () => {
    message.success("Báo cáo thành công!");
  };

  const handleClearHistory = () => {
    message.success("Xóa lịch sử trò chuyện thành công!");
  };

  const handleLeaveGroup = () => {
    message.success("Bạn đã rời khỏi cuộc trò chuyện nây!");
  };
  const handleViewAllMembers = () => {
    message.success("Xem các người hội thoại trong nhóm!");
  };

  const handleShowPinnedMessages = () => {
    message.success("Xem tin nhóm ghim!");
  };

  return (
    <div className="w-full md:w-[350px] bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded-lg shadow-lg overflow-y-auto h-full max-h-screen">
      <h1 className="text-xl font-bold text-center mb-6">
        {isGroupChat ? "Thông tin nhóm" : "Thông tin người hội thoại"}
      </h1>

      {/* Avatar và tên */}
      <div className="flex flex-col items-center mb-6 cursor-pointer">
        <Avatar
          size={72}
          src={
            avatar || "https://storage.googleapis.com/a1aa/image/default.jpg"
          }
        />
        <div className="font-semibold text-lg text-center">
          {isGroupChat
            ? chatName
            : members.find((member) => member.id !== user.id)?.username ||
              "Unknown"}
        </div>
      </div>

      {/* Nút chức năng chính */}
      <div
        className={`text-xl text-gray-700 dark:text-white mb-6 flex ${
          isGroupChat ? "justify-around" : "justify-center gap-10"
        }`}
      >
        <Tooltip title="Tắt thông báo">
          <Button
            size="large"
            type="text"
            icon={<BellOutlined />}
            onClick={handleTurnOffNotification}
          />
          {/* <IoNotificationsOffOutline /> */}
        </Tooltip>
        <Tooltip title="Ghim hội thoại">
          <Button
            size="large"
            type="text"
            icon={<PushpinOutlined />}
            onClick={pinChatbox}
          />
        </Tooltip>
        {isGroupChat && (
          <>
            <Tooltip title="Thêm thành viên">
              <Button
                size="large"
                type="text"
                icon={<UserAddOutlined />}
                onClick={handleAddMember}
              />
            </Tooltip>
            <Tooltip title="Quản lý nhóm">
              <Button
                size="large"
                type="text"
                icon={<SettingOutlined />}
                onClick={handleManageGroup}
              />
            </Tooltip>
          </>
        )}
      </div>

      {/* Thông tin nhóm */}
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        className="mb-4 text-sm"
        accordion
      >
        {/* Thành viên nhóm */}
        {isGroupChat && (
          <Panel
            header={<span className="font-semibold">👥 Thành viên nhóm</span>}
            key="1"
          >
            <p className="text-gray-600 text-center mt-0">
              {members.length} thành viên
            </p>
            <div className="space-y-0 max-h-64 overflow-y-auto pr-2 cursor-pointer">
              {members.map((member) => {
                const avatar =
                  member.profile?.avatar ||
                  "https://storage.googleapis.com/a1aa/image/default.jpg";
                const name =
                  member.profile?.full_name || member.username || "Không rõ";

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <Avatar size={30} src={avatar} />
                    <span className="text-sm font-medium text-gray-800">
                      {name}
                    </span>
                    {member.isActive && (
                      <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                        <span className="text-green-500 text-base">●</span>{" "}
                        Online
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-2">
              <Button
                size="small"
                type="text"
                icon={<PlusOutlined />}
                onClick={handleAddMember}
              >
                Thêm thành viên
              </Button>
              {/* Xem tất cả thành viên */}
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                onClick={handleViewAllMembers}
              >
                Xem tất cả
              </Button>
            </div>
          </Panel>
        )}

        {/* Ghim */}
        {isGroupChat && (
          <Panel
            header={<span className="font-semibold">📌 Bảng tin nhóm</span>}
            key="2"
          >
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              <h2 className="text-sm font-medium text-gray-700">
                Tin nhắn ghim:
              </h2>
              {ghim.length > 0 ? (
                ghim.map((msg) => {
                  const senderName =
                    members.find((m) => m.id === msg.sender)?.username ||
                    "Ẩn danh";
                  const shortMsg =
                    msg.message.length > 80
                      ? msg.message.slice(0, 80) + "..."
                      : msg.message;

                  return (
                    /* Tin nhắn đã ghim */
                    <div
                      key={msg.id}
                      onClick={() => handleShowPinnedMessages(msg)}
                      className="bg-gray-100 p-3 rounded-md hover:bg-gray-300 cursor-pointer"
                    >
                      <span className="block text-sm font-medium">
                        {senderName}:
                      </span>
                      <span className="text-sm text-gray-600">{shortMsg}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">Chưa có tin nhắn ghim</p>
              )}
            </div>
          </Panel>
        )}

        {/* Ảnh / Video */}
        <Panel
          header={<span className="font-bold">🖼 Ảnh / Video</span>}
          key="3"
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2">
            {[...Array(9)].map((_, index) => (
              <img
                key={index}
                src={`https://picsum.photos/200/200?random=${index}`}
                alt={`Image ${index}`}
                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
          <Button type="primary" block className="mt-3 rounded">
            Xem tất cả
          </Button>
        </Panel>

        {/* File */}
        <Panel header={<span className="font-bold">📁 File</span>} key="4">
          <p className="text-sm text-gray-500">Chưa có file được chia sẻ.</p>
        </Panel>

        {/* Link */}
        <Panel header={<span className="font-bold">🔗 Link</span>} key="5">
          <p className="text-sm text-gray-500">Chưa có link được chia sẻ.</p>
        </Panel>

        {/* Bảo mật */}
        <Panel
          header={<span className="font-bold">🔐 Thiết lập bảo mật</span>}
          key="6"
        >
          <p className="text-sm text-gray-500">
            Chưa có thiết lập bảo mật nào.
          </p>
        </Panel>
      </Collapse>

      {/* Hành động */}
      <div className="mt-6 space-y-2">
        <Button icon={<MdOutlineReportProblem />} block onClick={handleReport}>
          Báo cáo hội thoại
        </Button>
        <Button
          icon={<MdOutlineDelete />}
          block
          danger
          onClick={handleClearHistory}
        >
          Xóa lịch sử trò chuyện
        </Button>
        {isGroupChat && (
          <Button icon={<CiLogout />} block danger onClick={handleLeaveGroup}>
            Rời khỏi nhóm
          </Button>
        )}
      </div>
    </div>
  );
};

export default RightSide;
