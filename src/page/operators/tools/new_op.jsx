import { Button, DatePicker, Input, InputNumber, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaPlus, FaSave } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { GoAlertFill } from "react-icons/go";
import dayjs from "dayjs";

const Operator_news = () => {
  const [listUser, setListUser] = useState([]);
  useEffect(() => {
    setListUser([]);
    handleAddRow();
  }, []);
  const handleAddRow = () => {
    setListUser((prev) => [
      ...prev,
      {
        fullname: null,
        bank_code: null,
        bank_number: null,
        cccd_img: null,
        phone: null,
        cardid: null,
        address: null,
        old: null,
        sex: null,
        avatar: null,
        staff: null,
        note: null,
      },
    ]);
  };
  const handleChange = (index, field, value) => {
    const updatedUsers = [...listUser];
    updatedUsers[index][field] = value;
    setListUser(updatedUsers);
  };
  const handleSave = () => {
    console.log(listUser);
  };

  const handleImageCCCD = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUsers = [...listUser];
      updatedUsers[index].cccd_img = reader.result; // base64 string
      setListUser(updatedUsers);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteRow = (index) => {
    const updatedUsers = [...listUser];
    updatedUsers.splice(index, 1);
    setListUser(updatedUsers);
  };
  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUsers = [...listUser];
      updatedUsers[index].avatar = reader.result; // base64 string
      setListUser(updatedUsers);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{<BsPersonFillAdd />}</div>
          Thêm người lao động
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop overflow-hidden">
        <div className="whitebox h-full flex flex-col !p-0 !rounded-[4px]">
          <div className="flex p-2 border-b-1 border-[#0003]">
            <Button type="primary" icon={<FaPlus />} onClick={handleAddRow}>
              Thêm dòng
            </Button>
            <div className="ml-auto">
              <Button
                disabled={
                  listUser.filter((item) => item.fullname !== null).length == 0
                }
                type="primary"
                icon={<FaSave />}
                onClick={handleSave}
              >
                Lưu lại{" "}
                {listUser.filter((item) => item.fullname !== null).length > 0 &&
                  `(${
                    listUser.filter((item) => item.fullname !== null).length
                  })`}
              </Button>
            </div>
          </div>
          <div className="mr-0.5 my-0.5 flex flex-col overflow-y-auto px-1">
            {listUser.map((user, index) => (
              <div
                key={index}
                className="flex gap-2 items-center p-2 not-first:border-t-1 duration-300
                not-first:border-[#6a80ad33] relative hover:bg-[#f4f7fd] transition-all"
              >
                <Tooltip
                  title="Ảnh đại diện"
                  className="min-w-16.5 w-16.5 h-16.5 relative"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                      Ảnh
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Tooltip>
                <Tooltip
                  title="Mặt trước của căn cước công dân"
                  className="min-w-16.5 w-16.5 h-16.5 flex items-center justify-center relative bg-gray-200 
                  rounded-2xl text-gray-500"
                >
                  {user.cccd_img ? (
                    <img
                      src={user.cccd_img}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <>CCCD</>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageCCCD(index, e.target.files[0])}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Tooltip>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <Input
                    placeholder="Họ tên"
                    value={user.fullname}
                    className="require"
                    onChange={(e) =>
                      handleChange(index, "fullname", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Số điện thoại"
                    value={user.phone}
                    onChange={(e) =>
                      handleChange(index, "phone", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <DatePicker
                    placeholder="Ngày sinh"
                    className="w-[120px]"
                    format="DD/MM/YYYY"
                    value={user.old ? dayjs(user.old, "DD/MM/YYYY") : null}
                    onChange={(date, dateString) =>
                      handleChange(index, "old", dateString)
                    }
                    disabledDate={(current) => {
                      return current && current > dayjs().endOf("day");
                    }}
                  />
                  <Select
                    placeholder="Giới tính"
                    value={user.sex}
                    onChange={(e) => handleChange(index, "sex", e)}
                    options={["Nam", "Nữ"].map((cc) => ({
                      value: cc,
                      label: cc,
                    }))}
                    className="w-[120px]"
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <Input
                    placeholder="CMND/CCCD"
                    value={user.cardid}
                    onChange={(e) =>
                      handleChange(index, "cardid", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Địa chỉ"
                    value={user.address}
                    onChange={(e) =>
                      handleChange(index, "address", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <Select
                    placeholder="Ngân hàng"
                    value={user.bank_code}
                    onChange={(e) => handleChange(index, "bank_code", e)}
                    options={["Nam", "Nữ"].map((cc) => ({
                      value: cc,
                      label: cc,
                    }))}
                  />
                  <Input
                    placeholder="Số tài khoản"
                    value={user.bank_number}
                    onChange={(e) =>
                      handleChange(index, "bank_number", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <Select
                    placeholder="Người tuyển"
                    value={user.staff}
                    onChange={(e) => handleChange(index, "staff", e)}
                    options={["Nam", "Nữ"].map((cc) => ({
                      value: cc,
                      label: cc,
                    }))}
                  />
                  <Input
                    placeholder="Ghi chú"
                    value={user.note}
                    onChange={(e) =>
                      handleChange(index, "note", e.target.value)
                    }
                  />
                </div>
                <div className="ml-auto flex items-center gap-3">
                  {user.fullname === null && (
                    <Tooltip
                      title="Chưa nhập họ tên"
                      className="cursor-pointer text-[#ee1c00]"
                    >
                      <div className="p4">
                        <GoAlertFill />
                      </div>
                    </Tooltip>
                  )}
                  <div className="ml-1">
                    <Tooltip title={<div className="px-2">Xóa</div>}>
                      <Button
                        onClick={() => handleDeleteRow(index)}
                        type="delete"
                        icon={<FaXmark />}
                      ></Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operator_news;
