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
  message,
} from "antd"; // Thêm Descriptions và Modal từ Ant Design
import { FaPencil } from "react-icons/fa6";
import { FaEdit, FaUser } from "react-icons/fa";
import { AiFillSignature } from "react-icons/ai";
import Update_profile from "../components/user/Update_profile";
import Change_pass from "../components/user/Change_pass";
import Card_bank_user from "../components/cards/user-bank-card";
import app from "../components/app";
import api from "../components/api";

const Profile = () => {
  const { user, setUser } = useUser();
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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const resizedBase64 = app.resizeImage(img, 500);
          api
            .patch(
              `/profile/${user?.info?.profile?.id}/`,
              { avatar_base64: resizedBase64 },
              user.token
            )
            .then((res) => {
              setUser({ ...user, info: { ...user?.info, profile: res } });
              setAvatarPreview(resizedBase64);
              message.success("Cập nhật thành công!");
            })
            .catch((e) => {
              console.log(e);
            });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div className="flex w-full h-full overflow-hidden">
        <div className="flex flex-col w-[260px] items-center py-2 bg-white border-r-1 border-[#0003]">
          <div className="avatar flex flex-col items-center">
            <div className="box w-[120px] h-[120px] bg-[#6991be] rounded-2xl flex items-center justify-center text-white overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : user?.info?.profile?.avatar_preview ? (
                <img
                  src={user.info.profile.avatar_preview}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <FaUser size={50} />
              )}
            </div>
            <label
              className="mt-1 cursor-pointer bg-[#98abc5] text-[11px] hover:underline
            text-[#fff] px-1 pt-0.5 rounded-[4px]"
            >
              Tải ảnh lên
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
            <div className="name text-center text-[16px] mt-2 text-[#000407]">
              {user?.info?.profile?.full_name || "Chưa có tên"}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[240px]">
            <div className="flex justify-between w-full mt-2">
              <div>Bộ phận</div>
              <div>{user?.info?.department_name || "-"}</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Chức vụ</div>
              <div>{user?.info?.possition_name || "-"}</div>
            </div>
            <Change_pass className="flex !w-full mt-1">
              <Button type="primary" className="flex !w-full">
                Đổi mật khẩu?
              </Button>
            </Change_pass>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-2 gap-2">
          <div className="whitebox">
            <div className="flex justify-between items-center px-2 mt-1 mb-3">
              <div className="flex items-center font-[500] text-[13px] gap-1">
                <AiFillSignature />
                Thông tin cá nhân
              </div>
              <div className="flex items-center gap-1">
                <Update_profile user={user} setUser={setUser}>
                  <Button
                    className="!text-[#999] hover:!text-[#09f]"
                    icon={<FaEdit />}
                  ></Button>
                </Update_profile>
              </div>
            </div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Họ và tên">
                {user?.info?.profile?.full_name || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                {user?.info?.profile?.phone || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Sinh nhật">
                {user?.info?.profile?.date_of_birth || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {user?.info?.profile?.gender ? (
                  <>{user?.info?.profile?.gender === "male" ? "Nam" : "Nữ"}</>
                ) : (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Link zalo">
                {user?.info?.profile?.zalo || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Link facebook">
                {user?.info?.profile?.facebook || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="whitebox !py-3">
            <Card_bank_user
              user_id={user?.id}
              user_type="staff"
              shadow={false}
            />
          </div>
          <div className="whitebox">
            <div className="flex font-[500] text-[13px] gap-1 items-center px-2 mt-1 mb-3">
              <AiFillSignature />
              Thông tin khác
            </div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã nhân viên">
                {user?.info?.cardID || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Phân loại">
                {user?.info?.isSuperAdmin
                  ? "Tài khoản BOSS"
                  : user?.info?.isAdmin
                  ? "Tài khoản Admin"
                  : "Nhân viên"}
              </Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">
                {user?.info?.username || (
                  <div className="text-[#999]">Chưa cập nhập</div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Mật khẩu">
                <Change_pass>
                  <Button type="primary">Đổi mật khẩu?</Button>
                </Change_pass>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
