import React from "react";
import { Avatar, Button, Collapse } from "antd";
import {
  BellOutlined,
  PushpinOutlined,
  UserAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

const RightSide = () => {
  return (
    <div className="w-1/4 bg-white p-2 rounded-lg shadow">
      {/* Header */}
      <div className="text-center">
        <Avatar
          size={64}
          src="https://via.placeholder.com/64"
          className="mx-auto mb-2"
        />
        <div className="font-bold text-lg">DEV Team</div>
        {/* <Button
          type="link"
          icon={<SettingOutlined />}
          className="text-gray-500"
        /> */}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around mt-4">
        <div className="flex flex-col items-center">
          <BellOutlined className="text-xl mb-1" />
          {/* <span className="text-sm">Tắt thông báo</span> */}
        </div>
        <div className="flex flex-col items-center">
          <PushpinOutlined className="text-xl mb-1" />
          {/* <span className="text-sm">Ghim hội thoại</span> */}
        </div>
        <div className="flex flex-col items-center">
          <UserAddOutlined className="text-xl mb-1" />
          {/* <span className="text-sm">Thêm thành viên</span> */}
        </div>
        <div className="flex flex-col items-center">
          <SettingOutlined className="text-xl mb-1" />
          {/* <span className="text-sm">Quản lý nhóm</span> */}
        </div>
      </div>

      {/* Group Info Sections */}
      <Collapse bordered={false} defaultActiveKey={["1"]} className="mt-6">
        {/* Thành viên nhóm */}
        <Panel
          header={<span className="font-bold">Thành viên nhóm</span>}
          key="1"
        >
          <p className="flex items-center text-sm">
            <i className="fas fa-users mr-2"></i> 3 thành viên
          </p>
        </Panel>

        {/* Bảng tin nhóm */}
        <Panel
          header={<span className="font-bold">Bảng tin nhóm</span>}
          key="2"
        >
          <p className="text-sm">Danh sách nhắc hẹn</p>
          <p className="text-sm">Ghi chú, ghim, bình chọn</p>
        </Panel>

        {/* Ảnh/Video */}
        <Panel header={<span className="font-bold">Ảnh/Video</span>} key="3">
          <p className="text-sm text-gray-500">
            Chưa có Ảnh/Video được chia sẻ trong hội thoại này
          </p>
        </Panel>

        {/* File */}
        <Panel header={<span className="font-bold">File</span>} key="4">
          <div className="flex items-center space-x-2 text-sm">
            <img
              src="/path/to/env-icon.png"
              alt="img"
              width={24}
              height={24}
              className=""
            />
            <span>153 B</span>
            <span>29/03/2025</span>
          </div>
        </Panel>
      </Collapse>

      {/* View All Button */}
      <Button type="primary" block shape="round" size="medium" className="mt-4">
        Xem tất cả
      </Button>
    </div>
  );
};

export default RightSide;
