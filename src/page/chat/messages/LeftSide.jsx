import React, { useEffect, useState } from "react";
import { FaPlus, FaCamera, FaUsers } from "react-icons/fa";
import {
  Avatar,
  Badge,
  Input,
  Modal,
  Button,
  Checkbox,
  Tabs,
  Skeleton,
  Upload,
  message,
  Select,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import app from "../../../components/app";
import api from "../../../components/api";

const { TabPane } = Tabs;
const { Option } = Select;

const LeftSide = ({ chatList, setChatList, user }) => {
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChatList, setFilteredChatList] = useState(chatList);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [host, setHost] = useState(user.id); // Mặc định host là người dùng hiện tại
  const [admins, setAdmins] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([user.id]); // Bao gồm user hiện tại
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [groupCover, setGroupCover] = useState(null); // Base64 string
  const [groupCoverURL, setGroupCoverURL] = useState(null);

  // Lấy danh sách người dùng từ user.staff
  useEffect(() => {
    if (user?.staff) {
      const filteredUsers = user.staff
        .filter((u) => u.id !== user.id)
        .map((u) => ({
          id: u.id,
          fullName:
            u.first_name && u.last_name
              ? `${u.first_name} ${u.last_name}`
              : u.username || "Unknown",
          username: u.username || "Unknown",
        }));
      setAvailableUsers(filteredUsers);
    }
  }, [user]);

  // Lọc danh sách chat khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm) {
      setFilteredChatList(chatList);
    } else {
      const filtered = chatList.filter((chat) => {
        if (chat.is_group) {
          return chat.name?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          const otherMember = chat.members.find(
            (member) => member.id !== user.id
          );
          const username = otherMember?.username || "";
          return username.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
      setFilteredChatList(filtered);
    }
  }, [searchTerm, chatList, user]);

  // Lọc danh sách thành viên khi tìm kiếm
  const filteredMembers = availableUsers.filter((u) =>
    u.fullName.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );
  const sortedMembersByAlphabet = [...filteredMembers].sort((a, b) =>
    a.fullName.localeCompare(b.fullName, "vi", { sensitivity: "base" })
  );

  const getTimeDisplay = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    if (diffInSeconds < 10) return "vừa xong";
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

    return app.timeSince(timestamp);
  };

  // Xử lý chọn thành viên
  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Xử lý xóa thành viên khỏi danh sách đã chọn
  const handleRemoveMember = (memberId) => {
    if (memberId === user.id || memberId === host) {
      message.warning("Không thể xóa host hoặc chính bạn!");
      return;
    }
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    setAdmins((prev) => prev.filter((id) => id !== memberId)); // Xóa khỏi admins nếu có
  };

  // Xử lý chọn ảnh bìa
  const handleCoverChange = (info) => {
    const file = info.file;
    const fileType = file.type;
    if (!fileType.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // Lấy base64 string (bỏ phần "data:image/jpeg;base64,")
      setGroupCover(base64String);
      setGroupCoverURL(reader.result); // Để hiển thị preview
    };
    reader.onerror = () => {
      message.error("Không thể đọc file ảnh!");
    };
    reader.readAsDataURL(file);
  };

  // Xử lý tạo group chat
  const handleCreateGroup = async () => {
    if (!groupName) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng nhập tên group!",
      });
      return;
    }
    if (selectedMembers.length < 2) {
      Modal.error({
        title: "Lỗi",
        content: "Vui lòng chọn ít nhất một thành viên khác ngoài bạn!",
      });
      return;
    }

    try {
      const groupData = {
        // id: null,
        name: groupName,
        host: host,
        admins: admins,
        members: selectedMembers,
        is_group: true,
        avatar: groupCover || null, // Gửi base64 string
      };

      const createRoomResponse = await api.post(
        "/chatbox/create_room/",
        groupData,
        user.token
      );
      // Kiểm tra response từ API
      console.log("API Response:", createRoomResponse);

      // API trả về trực tiếp object, không có .data
      const newRoom = createRoomResponse;

      // Kiểm tra xem newRoom có tồn tại và có id không
      if (!newRoom || !newRoom.id) {
        throw new Error("Không thể lấy ID của room mới từ API response");
      }

      console.log("New room:", newRoom);

      // Cập nhật chatList để hiển thị group mới trong danh sách
      // setChatList((prevChatList) => [...prevChatList, newRoom]);
      setChatList((prevChatList) => [newRoom, ...prevChatList]);

      // Reset các state sau khi tạo group
      setIsCreateGroupModalVisible(false);
      setGroupName("");
      setHost(user.id);
      setAdmins([]);
      setSelectedMembers([user.id]);
      setMemberSearchTerm("");
      setGroupCover(null);
      setGroupCoverURL(null);

      // Redirect đến URL: /app/chat/:id
      // nav(`/app/`);
      message.success("Tạo group chat thành công!");
      nav(`/app/chat/${newRoom.id}`);
    } catch (error) {
      console.error("Error creating group chat:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể tạo group chat. Vui lòng thử lại.",
      });
    }
  };
  // console.log("FilteredChatList: ", filteredChatList);

  return (
    <div className="left-side bg-white w-1/5 flex flex-col min-w-[280px] overflow-hidden">
      <div className="flex items-center p-4 justify-between">
        <div className="flex items-center">
          <Avatar
            alt="User Avatar"
            className="rounded-full"
            size={40}
            src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
          />
          <span className="ml-2 text-xl font-bold">
            {localStorage.getItem("username")}
          </span>
        </div>
        <Button
          type="primary"
          shape="circle"
          icon={<FaPlus />}
          onClick={() => setIsCreateGroupModalVisible(true)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex p-2 items-center">
          <Input
            className="bg-gray-600 rounded"
            placeholder="Tìm kiếm cuộc trò chuyện"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex p-3 items-center justify-between">
          <span className="font-bold">Ưu tiên</span>
          <span className="text-sm">Khác</span>
        </div>
        <h1 className="text-center">
          {filteredChatList.length === 0 &&
            "Không tìm thấy cuộc trò chuyện. Hãy bắt đầu 1 cuộc trò chuyện."}
        </h1>
        {/* count total chat */}
        <h1 className="text-center">
          số lượng cuộc trò chuyện: {filteredChatList.length}
        </h1>
        <div className="h-full overflow-auto">
          <div className="p-2 mt-2">
            {filteredChatList
              .sort(
                (a, b) => (b.last_message?.id || 0) - (a.last_message?.id || 0)
              )
              .map((chat) => {
                const isGroupChat = chat.is_group;
                const chatName = isGroupChat
                  ? chat.name
                  : chat.members.find((member) => member.id !== user.id)
                      ?.username || "Unknown";
                const chatAvatar = isGroupChat
                  ? chat.avatar
                  : chat.members.find((member) => member.id !== user.id)
                      ?.avatar ||
                    "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg";

                return (
                  <Link
                    key={chat.id}
                    className="flex items-center p-2 hover:bg-gray-500 rounded cursor-pointer relative"
                    to={`/app/chat/${chat.id}`}
                  >
                    <div className="relative">
                      <Avatar size={40} src={chatAvatar} />
                      {isGroupChat && (
                        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                          <FaUsers className="text-white" size={12} />
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="font-bold flex items-center">
                        {chatName}
                        {isGroupChat && (
                          <span className="ml-2 text-xs text-gray-500"></span>
                        )}
                      </div>
                      <div className="text-sm overflow-hidden text-nowrap text-ellipsis">
                        {chat.last_message?.sender === user.id && "Bạn: "}
                        {chat.last_message?.message
                          ? chat.last_message.message.length > 14
                            ? chat.last_message.message.slice(0, 15) + "..."
                            : chat.last_message.message
                          : "Chưa có tin nhắn"}
                      </div>
                    </div>
                    <div className="absolute top-0 right-0">
                      <div className="text-sm">
                        {chat.last_message?.created_at
                          ? getTimeDisplay(chat.last_message.created_at)
                          : ""}
                      </div>
                      {chat.not_read > 0 && (
                        <Badge count={chat.not_read} offset={[30, 5]} />
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      {/* Modal tạo group chat */}
      <Modal
        title="Tạo nhóm"
        open={isCreateGroupModalVisible}
        onCancel={() => {
          setIsCreateGroupModalVisible(false);
          setGroupName("");
          setHost(user.id);
          setAdmins([]);
          setSelectedMembers([user.id]);
          setMemberSearchTerm("");
          setGroupCover(null);
          setGroupCoverURL(null);
        }}
        footer={null}
        width={1000}
      >
        <div className="space-y-4">
          {/* Select cover group và nhập tên nhóm */}
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {groupCoverURL ? (
                <div className="relative">
                  <Avatar
                    size={100}
                    src={groupCoverURL}
                    className="border border-gray-300"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => {
                      setGroupCover(null);
                      setGroupCoverURL(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleCoverChange}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                    <FaCamera className="text-gray-500" />
                  </div>
                </Upload>
              )}
            </div>
            <div className="flex-1">
              <Input
                placeholder="Nhập tên nhóm..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>
          {/* Host và Admins trong 1 hàng */}
          <div className="flex space-x-4">
            {/* Host (Quản trị viên) */}
            <div className="flex-1">
              <label className="block mb-1">Host (Quản trị viên):</label>
              <Select
                value={host}
                onChange={(value) => {
                  setHost(value);
                  setSelectedMembers((prev) => [...new Set([...prev, value])]);
                }}
                style={{ width: "100%" }}
              >
                <Option value={user.id}>{user.username} (Bạn)</Option>
                {availableUsers.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.fullName}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Admins (Quản lý) */}
            <div className="flex-1">
              <label className="block mb-1">Admins (Quản lý):</label>
              <Select
                mode="multiple"
                value={admins}
                onChange={(values) => {
                  setAdmins(values);
                  setSelectedMembers((prev) => [
                    ...new Set([...prev, ...values]),
                  ]);
                }}
                style={{ width: "100%" }}
              >
                {availableUsers.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.fullName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Ô tìm kiếm thành viên */}
          <Input
            placeholder="Nhập tên, số điện thoại, email..."
            value={memberSearchTerm}
            onChange={(e) => setMemberSearchTerm(e.target.value)}
            allowClear
          />

          {/* Thanh hiển thị thành viên đã chọn */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap items-center p-2 bg-gray-100 rounded cursor-pointer">
              <span className="text-sm text-gray-700 mr-2">
                Đã chọn: {selectedMembers.length}/100
              </span>
              {selectedMembers.map((memberId) => {
                const member = availableUsers.find(
                  (u) => u.id === memberId
                ) || {
                  id: user.id,
                  fullName: user.username,
                };
                const isCreator = memberId === user.id;
                {
                  /* console.log(
                  "Member ID:",
                  memberId,
                  "User ID:",
                  user.id,
                  "Is creator:",
                  isCreator
                ); */
                }
                return (
                  <div
                    key={memberId}
                    className="flex items-center bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                  >
                    <span className="text-sm">
                      {member.fullName}
                      {isCreator && "Người tạo: "}
                      {member.id === host && "Host"}
                      {admins.includes(memberId) && " (Admin)"}
                    </span>
                    <button
                      className="ml-2 text-xs cursor-pointer"
                      onClick={() => handleRemoveMember(memberId)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tabs lọc thành viên */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tất cả" key="1">
              <div className="max-h-60 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-2">
                  Trò chuyện gần đây
                </div>
                {filteredMembers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <Avatar
                      size={40}
                      src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                      alt="Avatar"
                      className="ml-2"
                    />
                    <span className="ml-2">{u.fullName}</span>
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab="Alphabet" key="2">
              <div className="max-h-60 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-2">Theo Alphabet</div>
                {sortedMembersByAlphabet.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <Avatar
                      size={40}
                      src="https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                      className="ml-2"
                    />
                    <span className="ml-2">{u.fullName}</span>
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab="Bạn thân" key="3">
              <div className="text-sm text-gray-500">
                <Skeleton />
              </div>
            </TabPane>
            <TabPane tab="Đồng nghiệp" key="4">
              <div className="text-sm text-gray-500">
                <Skeleton />
              </div>
            </TabPane>
          </Tabs>

          {/* Nút Hủy và Tạo nhóm */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setIsCreateGroupModalVisible(false);
                setGroupName("");
                setHost(user.id);
                setAdmins([]);
                setSelectedMembers([user.id]);
                setMemberSearchTerm("");
                setGroupCover(null);
                setGroupCoverURL(null);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" onClick={handleCreateGroup}>
              Tạo nhóm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeftSide;
