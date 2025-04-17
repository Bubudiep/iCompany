import {
  Descriptions,
  Input,
  InputNumber,
  Modal,
  Select,
  Button,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const Baoung_OP = ({ op, onClose, open, update }) => {
  const [soTien, setSoTien] = useState(null);
  const [lyDo, setLyDo] = useState("");
  const [nguoiThuHuong, setNguoiThuHuong] = useState(null);
  const [hinhThuc, setHinhThuc] = useState(null);
  const [ghiChu, setGhiChu] = useState("");

  useEffect(() => {
    if (open && op) {
      // Reset dữ liệu khi mở lại modal
      setSoTien(null);
      setLyDo("");
      setNguoiThuHuong(null);
      setHinhThuc(null);
      setGhiChu("");
    }
  }, [open, op]);

  const handleSave = () => {
    if (!soTien || !lyDo || !nguoiThuHuong || !hinhThuc) {
      message.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    const data = {
      soTien,
      lyDo,
      nguoiThuHuong,
      hinhThuc,
      ghiChu,
      opId: op?.id,
    };
    update?.(data); // gọi hàm cập nhật từ props
    onClose(); // đóng modal sau khi lưu
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`${op?.ho_ten || ""} - Báo ứng`}
      className="popupcontent"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-2">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Họ và tên">{op?.ho_ten}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {op?.ngaysinh}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {op?.gioi_tinh}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{op?.sdt}</Descriptions.Item>
          <Descriptions.Item label="Số CCCD">{op?.so_cccd}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{op?.diachi}</Descriptions.Item>
        </Descriptions>

        <div className="text-lg font-semibold mt-4">Thông tin báo ứng</div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Số tiền">
            <div className="flex gap-1 items-center">
              <InputNumber
                value={soTien}
                onChange={setSoTien}
                placeholder="Nhập số tiền"
                className="!w-[150px]"
                min={200000}
                max={2000000}
                step={100000}
                formatter={
                  (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") // 1000000 => 1.000.000
                }
                parser={
                  (value) => value.replace(/\./g, "").replace(/[^0-9]/g, "") // bỏ dấu chấm khi parse ngược lại
                }
              />
              <span>vnđ</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Lý do">
            <Input
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              placeholder="Nhập lý do báo ứng"
            />
          </Descriptions.Item>

          <Descriptions.Item label="Người thụ hưởng và Hình thức">
            <div className="flex flex-col gap-2">
              <Select
                value={hinhThuc}
                onChange={setHinhThuc}
                className="w-[200px]"
                placeholder="Chọn hình thức"
              >
                <Option value="chuyenkhoan">Chuyển khoản</Option>
                <Option value="thanhtoan">Thanh toán tiền mặt</Option>
              </Select>
              {hinhThuc && (
                <Select
                  value={nguoiThuHuong}
                  onChange={setNguoiThuHuong}
                  className="w-[200px]"
                  placeholder="Chọn người thụ hưởng"
                >
                  <Option value="nguoilaodong">Người lao động</Option>
                  <Option value="nguoituyen">Người tuyển</Option>
                </Select>
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            <TextArea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="Ghi chú thêm (nếu có)"
              rows={3}
            />
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default Baoung_OP;
