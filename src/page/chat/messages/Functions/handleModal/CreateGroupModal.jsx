import {
  Modal,
  Avatar,
  Upload,
  Input,
  Tabs,
  Checkbox,
  Skeleton,
  Button,
  message,
} from "antd";
import React, { useEffect } from "react";
import { FaCamera } from "react-icons/fa";

const { TabPane } = Tabs;

const CreateGroupModal = ({
  visible,
  onCancel,
  availableUsers,
  groupName,
  setGroupName,
  host,
  setHost,
  admins,
  setAdmins,
  selectedMembers,
  setSelectedMembers,
  memberSearchTerm,
  setMemberSearchTerm,
  groupCover,
  setGroupCover,
  groupCoverURL,
  setGroupCoverURL,
  handleCreateGroup,
  user,
}) => {
  // Debug để kiểm tra dữ liệu
  useEffect(() => {
    // console.log("Available users:", availableUsers);
    // console.log("User:", user);
    console.log("Admins:", admins);
    console.log("Host id:", host);
    console.log("Selected members:", selectedMembers);
  }, [availableUsers, user, selectedMembers]);

  // Lọc danh sách thành viên dựa trên memberSearchTerm
  const filteredMembers =
    availableUsers?.filter((u) =>
      u?.username?.toLowerCase().includes(memberSearchTerm.toLowerCase())
    ) || [];

  // Sắp xếp danh sách thành viên theo alphabet
  const sortedMembersByAlphabet = [...filteredMembers].sort((a, b) =>
    a?.username?.localeCompare(b?.full_name, "vi", { sensitivity: "base" })
  );
  const sortedMembersByMNV = [...filteredMembers].sort((a, b) =>
    a?.full_name?.localeCompare(b?.username, "vi", { sensitivity: "base" })
  );
  // by gender
  const sortedMembersByGender = [...filteredMembers].sort((a, b) =>
    a?.gender?.localeCompare(b?.gender, "vi", { sensitivity: "base" })
  );

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleRemoveMember = (memberId) => {
    if (memberId === user?.id || memberId === host) {
      message.warning("Không thể xóa host hoặc chính bạn!");
      return;
    }
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    setAdmins((prev) => prev.filter((id) => id !== memberId));
  };

  const handleCoverChange = (info) => {
    const file = info.file;
    const fileType = file.type;
    if (!fileType.startsWith("image/")) {
      message.error("Vui lòng chọn file ảnh!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      setGroupCover(base64String);
      setGroupCoverURL(reader.result);
    };
    reader.onerror = () => {
      message.error("Không thể đọc file ảnh!");
    };
    reader.readAsDataURL(file);
  };

  // Lấy thông tin người tạo từ user hoặc availableUsers
  const getCreatorName = () => {
    if (host === user?.id) {
      return user?.info?.username || user?.full_name || "Unknown Creator";
    }
    console.log("Host:", host);

    const creator = availableUsers.find((u) => u.id === host);
    return creator?.info?.username || creator?.full_name || "Unknown Creator";
    // console.log("Creator:", creator);
  };

  return (
    <Modal
      className="popupcontent create-group-modal text-center"
      title="Tạo nhóm"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <div className="space-y-4">
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
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
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
        <Input
          placeholder="Nhập username, tên, MNV, số điện thoại, email..."
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
                id: user?.id,
                username: user?.username,
                full_name: user?.full_name,
              };
              const isCreator = memberId === host; // Kiểm tra nếu là người tạo nhóm
              const creatorName = getCreatorName();
              return (
                <div
                  key={memberId}
                  className="flex items-center bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                >
                  <span className="text-sm">
                    {member?.username || member?.full_name}
                    {isCreator && ` (${creatorName} - Creator)`}
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
              {availableUsers.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không có người dùng nào để hiển thị.
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </div>
              ) : (
                filteredMembers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <div className="ml-2">
                      <Avatar
                        size={40}
                        src={
                          u.avatar ||
                          "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                        }
                        alt="Avatar"
                        className="ml-2"
                      />
                    </div>
                    <span className="ml-2">{u.username}</span>
                  </div>
                ))
              )}
            </div>
          </TabPane>

          <TabPane tab="Alphabet" key="2">
            <div className="max-h-60 overflow-y-auto">
              {/* <div className="text-sm text-gray-500 mb-2">Theo Alphabet</div> */}
              {availableUsers.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không có người dùng nào để hiển thị.
                </div>
              ) : sortedMembersByAlphabet.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </div>
              ) : (
                sortedMembersByAlphabet.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <div className="ml-2">
                      <Avatar
                        size={40}
                        src={
                          u.avatar ||
                          "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                        }
                        className="ml-2"
                      />
                    </div>
                    <span className="ml-2">{u.username}</span>
                  </div>
                ))
              )}
            </div>
          </TabPane>
          <TabPane tab="Mã Nhân Viên" key="3">
            <div className="max-h-60 overflow-y-auto">
              {/* <div className="text-sm text-gray-500 mb-2">
                Theo Mã Nhân Viên
              </div> */}
              {availableUsers.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không có người dùng nào để hiển thị.
                </div>
              ) : sortedMembersByAlphabet.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </div>
              ) : (
                sortedMembersByMNV.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <div className="ml-2">
                      <Avatar
                        size={40}
                        src={
                          u.avatar ||
                          "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
                        }
                        className="ml-2"
                      />
                    </div>
                    <span className="ml-2">{u.full_name}</span>
                  </div>
                ))
              )}
            </div>
          </TabPane>
          <TabPane tab="Giới tính" key="4">
            <div className="max-h-60 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không có người dùng nào để hiển thị.
                </div>
              ) : sortedMembersByAlphabet.length === 0 ? (
                <div className="text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </div>
              ) : (
                sortedMembersByGender.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleMemberSelect(u.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(u.id)}
                      onChange={() => handleMemberSelect(u.id)}
                    />
                    <div className="ml-2">
                      <Avatar size={40} src={u.avatar} />
                    </div>
                    <span className="ml-2">{u.gender}</span>
                  </div>
                ))
              )}
            </div>
          </TabPane>
          <TabPane tab="Danh Bạ" key="5">
            <div className="text-sm text-gray-500">
              <Skeleton />
            </div>
          </TabPane>
        </Tabs>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" onClick={handleCreateGroup}>
            Tạo nhóm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
