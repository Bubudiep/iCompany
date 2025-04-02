import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-140 bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600">
          Oops! Trang bạn tìm kiếm không tồn tại.
        </p>
        <a
          href="/"
          className="mt-4 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
