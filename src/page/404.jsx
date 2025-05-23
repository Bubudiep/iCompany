import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-1 justify-center min-h-screen px-14">
      <div className="text-center flex gap-2 flex-col mt-32">
        <h1 className="text-6xl font-bold text-[#6f89aa]">404</h1>
        <p className="text-2xl text-[#aab5c4]">
          Oops! Trang bạn tìm kiếm không tồn tại.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
