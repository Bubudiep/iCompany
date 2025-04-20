import React, { useEffect, useState } from "react";
import { useUser } from "../components/context/userContext";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Descriptions,
  Modal,
  Form,
  Input,
} from "antd"; // Thêm Descriptions và Modal từ Ant Design
import { FaPencil } from "react-icons/fa6";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleEditClick = () => {
    form.setFieldsValue(user.info); // Đặt giá trị mặc định cho form chỉnh sửa
    setIsEditModalVisible(true); // Mở modal chỉnh sửa
  };

  const handleOk = () => {
    // Gửi dữ liệu đã chỉnh sửa (có thể là API request hoặc logic khác)
    console.log(form.getFieldsValue());
    setIsEditModalVisible(false); // Đóng modal sau khi lưu
  };

  const handleCancel = () => {
    setIsEditModalVisible(false); // Đóng modal nếu huỷ
  };

  if (!user) {
    return (
      <div className="profile w-full min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96 text-center shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin.</p>
          <Button
            type="primary"
            className="mt-4"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
        </Card>
      </div>
    );
  }
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <>
      <div className="flex w-full h-full overflow-hidden bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="flex justify-center mb-6">
            <Avatar
              size={120}
              src={
                user.avatar ||
                "https://storage.googleapis.com/a1aa/image/RtLv4dlHyyndA-ZLn4qCkJ-q3cFMfic7sYoyL19xHlc.jpg"
              }
              className="border-4 border-blue-500 shadow-md"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center text-gray-800">
              Thông tin cá nhân
              <Button
                icon={<FaPencil />}
                type="edit"
                onClick={handleEditClick}
              ></Button>
            </h2>
            <Divider className="my-2" />
            <div className="flex gap-2 justify-center">
              <div className="emp-card">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mã nhân viên">
                    {user.info.cardID}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phòng ban">
                    {user.info.department_name || "Không có thông tin"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chức vụ">
                    {user.info.possition_name || "Không có thông tin"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quyền Admin" span={2}>
                    <span
                      className={
                        user.info.isAdmin || user.info.isSuperAdmin
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      {user.info.isSuperAdmin
                        ? "Super Admin"
                        : user.info.isAdmin
                        ? "Admin"
                        : "Không có"}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ và tên">
                  {user.info?.profile?.full_name || "Không có thông tin"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user.info.email || "Không có thông tin"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {user.info.phone || "Không có thông tin"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {user.info.address || "Không có thông tin"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={2}>
                  <span
                    className={
                      user.info.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {user.info.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {formatDate(user.info.created_at)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                  {formatDate(user.info.updated_at)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isEditModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Họ và tên" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Profile;
