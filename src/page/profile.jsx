import React from "react";
import { useUser } from "../components/context/userContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useUser();

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
    </div>
  );
};

export default Profile;
