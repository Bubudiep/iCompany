import React from "react";
import { useUser } from "../components/context/userContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useUser(); // Lấy user và logout từ context
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi logout

  const handleLogout = () => {
    // logout(); // Gọi hàm logout từ context
    navigate("/login"); // Chuyển hướng về trang đăng nhập
    // clear cookies

    window.localStorage.clear();
  };

  // Kiểm tra xem user có tồn tại không
  if (!user) {
    return (
      <div className="profile w-full text-center">
        <h1 className="text-center font-bold">Profile</h1>
        <p>Vui lòng đăng nhập để xem thông tin.</p>
      </div>
    );
  }

  return (
    <div className="profile w-full text-center">
      <h1 className="text-center font-bold">Profile</h1>
      <div className="mt-4">
        <p>
          <strong>Username:</strong> {user.username || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "N/A"}
        </p>
        <p>
          <strong>ID:</strong> {user.id || "N/A"}
        </p>
        {/* Hiển thị thêm thông tin nếu có */}
        {user.avatar && (
          <div className="mt-4">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto"
            />
          </div>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
