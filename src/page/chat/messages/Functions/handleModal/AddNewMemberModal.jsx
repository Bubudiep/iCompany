import {
  Modal,
  Avatar,
  Input,
  Tabs,
  Checkbox,
  Skeleton,
  Button,
  message,
} from "antd";
import React, { useState } from "react";
import { useUser } from "../../../../../components/context/userContext";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const AddNewMemberModal = ({ visible, onClose }) => {
  const { user } = useUser();
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredChatList, setFilteredChatList] = useState(chatList);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [host, setHost] = useState(user.id);
  const [admins, setAdmins] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([user.id]);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");

  // Lọc danh sách thành viên khi tìm kiếm
  const filteredMembers = availableUsers.filter((u) =>
    u.fullName.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );
  const sortedMembersByAlphabet = [...filteredMembers].sort((a, b) =>
    a.fullName.localeCompare(b.fullName, "vi", { sensitivity: "base" })
  );
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
    setAdmins((prev) => prev.filter((id) => id !== memberId));
  };

  // xử lý thêm mới thành viên
  const handleAddNewMembers = () => {
    if (selectedMembers.length < 1) {
      message.error("Vui lòng thêm tối thieu 1 người");
      return;
    }
  };

  return (
    <Modal
      className="popupcontent text-center"
      title="Thêm thành viên"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className="space-y-4 mt-5">
        <Input
          placeholder="Tìm kiếm tên người, số điện thoại, email..."
          value={memberSearchTerm}
          onChange={(e) => setMemberSearchTerm(e.target.value)}
          allowClear
        />

        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap items-center p-2 bg-gray-100 rounded cursor-pointer">
            <span className="text-sm text-gray-700 mr-2">
              Đã chọn: {selectedMembers.length}/100
            </span>
            {selectedMembers.map((memberId) => {
              const member = availableUsers.find((u) => u.id === memberId) || {
                id: user.id,
                fullName: user.username,
              };
              const isCreator = memberId === user.id;
              return (
                <div
                  key={memberId}
                  className="flex items-center bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                >
                  <span className="text-sm">
                    {member.fullName}
                    {isCreator && "Bạn"}
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

        <Tabs defaultActiveKey="1">
          <TabPane tab="Tất cả" key="1">
            <div className="max-h-60 overflow-y-auto">
              <div className="text-sm text-left text-gray-500 mb-2">
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
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleAddNewMembers}>
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddNewMemberModal;
