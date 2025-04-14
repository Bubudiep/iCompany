import React from "react";
import { useUser } from "../components/context/userContext";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Divider } from "antd"; // Thêm các thành phần từ Ant Design
import { FaArrowLeft } from "react-icons/fa"; // Biểu tượng quay lại
import { GrUpdate } from "react-icons/gr";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

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

  // Kiểm tra xem user có tồn tại không
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

  return (
    <div className="profile w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card
        className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        {/* Header với tiêu đề và nút quay lại */}
        <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
          <Button
            type="primary"
            icon={<FaArrowLeft className="text-white" />}
            onClick={() => navigate(-1)}
            className="hover:bg-blue-600 "
          />
          <h1 className="text-xl font-bold m-0">Hồ sơ cá nhân</h1>
          {/* update button */}
          <Button
            type="primary"
            className="hover:bg-blue-600"
            onClick={() => navigate("/update-profile")}
            icon={<GrUpdate className="text-white" />}
          />
        </div>

        {/* Nội dung chính với khả năng cuộn */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Avatar */}
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

          {/* Thông tin cá nhân */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center text-gray-800">
              Thông tin cá nhân
            </h2>
            <Divider className="my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">ID:</span>
                <span className="text-gray-900">{user.info.id}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Card ID:</span>
                <span className="text-gray-900">{user.info.cardID}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Username:</span>
                <span className="text-gray-900">{user.info.username}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Họ và tên:</span>
                <span className="text-gray-900">
                  {user.info.name || "Không có thông tin"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">
                  {user.info.email || "Không có thông tin"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">
                  Số điện thoại:
                </span>
                <span className="text-gray-900">
                  {user.info.phone || "Không có thông tin"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Địa chỉ:</span>
                <span className="text-gray-900">
                  {user.info.address || "Không có thông tin"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Vị trí:</span>
                <span className="text-gray-900">
                  {user.info.possition_name || "Không có thông tin"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Phòng ban:</span>
                <span className="text-gray-900">
                  {user.info.department_name || "Không có thông tin"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <span
                  className={`${
                    user.info.isActive ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {user.info.isActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Quyền Admin:</span>
                <span
                  className={`${
                    user.info.isAdmin || user.info.isSuperAdmin
                      ? "text-green-600"
                      : "text-gray-600"
                  } font-semibold`}
                >
                  {user.info.isSuperAdmin
                    ? "Super Admin"
                    : user.info.isAdmin
                    ? "Admin"
                    : "Không có"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Bị khóa:</span>
                <span
                  className={`${
                    user.info.isBan ? "text-red-600" : "text-green-600"
                  } font-semibold`}
                >
                  {user.info.isBan ? "Có" : "Không"}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Ngày tạo:</span>
                <span className="text-gray-900">
                  {formatDate(user.info.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">
                  Ngày cập nhật:
                </span>
                <span className="text-gray-900">
                  {formatDate(user.info.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
