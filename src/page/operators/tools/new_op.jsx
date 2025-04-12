import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaDownload, FaPlus, FaSave, FaUpload } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { GoAlertFill } from "react-icons/go";
import dayjs from "dayjs";
import { useUser } from "../../../components/context/userContext";
import api from "../../../components/api";
import { useNavigate } from "react-router-dom";
import app from "../../../components/app";
import * as XLSX from "xlsx";

const Operator_news = () => {
  const [listUser, setListUser] = useState([]);
  const { user } = useUser();
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [banks, setBanks] = useState([]);
  const [vendors, setVendors] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    setListUser([]);
    handleAddRow();
    api
      .get("/banks/")
      .then((res) => {
        setBanks(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const handleDownloadTemplate = () => {
    // Tạo một sheet với tiêu đề
    const headers = [
      [
        "Họ tên",
        "Số CCCD",
        "Ngày sinh",
        "Giới tính",
        "Địa chỉ",
        "Số điện thoại",
        "Mã ngân hàng",
        "Số tài khoản",
        "Loại tài khoản",
        "Loại",
        "Người tuyển",
        "Vendor",
        "Ghi chú",
        "Ngày vào làm",
        "Công ty vào làm",
        "Tên đi làm",
        "Nhà chính",
      ],
      [
        "Nguyễn Văn A",
        "123456789012",
        "1990-01-01",
        "Nam",
        "123 Đường ABC, HN",
        "0912345678",
        "970415",
        "1234567890",
        "Chính chủ",
        "Người mới",
        "MNV-000001",
        "",
        "",
        "2025-05-15",
        "Compal",
        "Nguyễn Văn A",
        "",
      ],
    ];
    // Sheet 2: Danh sách ngân hàng mẫu
    const data2 = [
      ["Mã ngân hàng (BIN)", "Tên viết tắt", "Tên đầy đủ"],
      ...banks.map((bank) => [bank.bin, bank.shortName, bank.name]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(data2);

    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NLD");
    XLSX.utils.book_append_sheet(workbook, ws2, "Ngân hàng");
    // Xuất file
    XLSX.writeFile(workbook, "File_mẫu_Thêm_người_lao_động.xlsx");
  };
  const handleImportExcel = (e) => {
    setListUser([]);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (data.length > 0) {
        if (data[0]?.["Họ tên"]) {
          const newUsers = data
            .filter(
              (row) => row["Họ tên"] !== "" && row["Họ tên"] !== "Hướng dẫn"
            )
            .map((row) => ({
              fullname: row["Họ tên"] || null,
              cardid: row["Số CCCD"] || null,
              address: row["Địa chỉ"] || null,
              old: row["Ngày sinh"] || null,
              sex: row["Giới tính"] || null,
              phone: row["Số điện thoại"] || null,
              bank_code: row["Mã ngân hàng"] || null,
              bank_number: row["Số tài khoản"] || null,
              bank_type: row["Loại tài khoản"] || "Chính chủ",
              type: row["Loại"] || "Người mới",
              avatar: null,
              cccd_img: null,
              note: row["Ghi chú"] || null,
              staff: null,
              type: "Người mới",
              customer: row["Công ty vào làm"] || null,
              work_date: row["Ngày vào làm"] || null,
              work_name: row["Tên đi làm"] || null,
              supplier: row["Nhà chính"] || null,
            }));
          setListUser((prev) => [...prev, ...newUsers]);
          e.target.value = "";
        } else {
          message.error("Định dạng không khớp!");
        }
      } else {
        message.error("Không có dữ liệu để import!");
      }
    };
    reader.readAsBinaryString(file);
  };
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
        bank_type: null,
        type: "Người mới",
      },
    ]);
  };
  const handleChange = (index, field, value) => {
    const updatedUsers = [...listUser];
    updatedUsers[index][field] = value;
    setListUser(updatedUsers);
  };
  const handleSave = () => {
    const add_data = {
      operators: listUser,
      date: date,
    };
    api
      .post("/op/add/", add_data, user.token)
      .then((res) => {
        message.success("Thêm mới thành công!");
        Modal.confirm({
          title: "Thêm thành công!",
          content:
            "Bạn có muốn sang trang quản lý người lao động để kiểm tra hoặc cập nhập không!",
          onOk: () => {
            nav("/app/operators/all");
          },
          okText: "Sang trang quản lý",
          cancelText: "Thêm mới",
          onCancel: () => {
            setListUser([]);
            handleAddRow();
          },
        });
      })
      .catch((e) => {
        console.log(e);
        message.error(e?.response?.data?.detail || "Có lỗi khi thêm NLĐ mới!");
      });
  };

  const handleImageCCCD = async (index, file, e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const newsize = app.resizeImage(img, 800, "image/png");
        const updatedUsers = [...listUser];
        updatedUsers[index].cccd_img = newsize;
        setListUser(updatedUsers);
        e.target.value = null;
      };
      img.src = reader.result;
    };
    if (file) {
      const qr = await app.handleReadQR(file);
      if (qr) {
        console.log(qr);
        handleChange(index, "fullname", qr.ho_va_ten);
        handleChange(index, "cardid", qr.so_cccd);
        handleChange(index, "address", qr.que_quan);
        handleChange(index, "sex", qr.gioi_tinh);
        handleChange(index, "old", qr.ngay_sinh);
        reader.readAsDataURL(file);
      } else {
        message.error("Không có mã QR hoặc mã QR không phải CCCD!");
      }
    }
  };
  const handleDeleteRow = (index) => {
    const updatedUsers = [...listUser];
    updatedUsers.splice(index, 1);
    setListUser(updatedUsers);
  };
  const handleImageChange = (index, file, e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const newsize = app.resizeImage(img, 200, "image/png");
        const updatedUsers = [...listUser];
        updatedUsers[index].avatar = newsize;
        setListUser(updatedUsers);
        e.target.value = null;
      };
      img.src = reader.result;
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
          <div className="flex p-2 border-b-1 border-[#0003] gap-2">
            <Button type="primary" icon={<FaPlus />} onClick={handleAddRow}>
              Thêm 1 dòng
            </Button>
            <Button icon={<FaDownload />} onClick={handleDownloadTemplate}>
              Tải Excel mẫu
            </Button>
            <>
              <input
                type="file"
                id="import-excel"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleImportExcel}
              />
              <label htmlFor="import-excel" className="btn">
                <FaUpload />
                Nhập từ Excel
              </label>
            </>
            <div className="ml-auto flex gap-2">
              <Tooltip title="Ngày phỏng vấn" trigger="hover">
                <Input
                  disabled={
                    listUser.filter((item) => item.fullname !== null).length ==
                    0
                  }
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Tooltip>
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
          <div className="mx-0.5 my-0.5 flex flex-col overflow-y-auto px-1 h-full">
            {listUser.map((op, index) => (
              <div
                key={index}
                className="flex gap-2 items-center p-2 not-first:border-t-1 duration-300
                not-first:border-[#6a80ad33] relative hover:bg-[#f4f7fd] transition-all"
              >
                <Tooltip
                  title="Ảnh đại diện"
                  className="min-w-26 w-26 h-26 relative"
                >
                  {op.avatar ? (
                    <img
                      src={op.avatar}
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
                      handleImageChange(index, e.target.files[0], e)
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Tooltip>
                <Tooltip
                  title="Mặt trước của căn cước công dân"
                  className={`${
                    op.cardid ? "min-w-0 !w-0 " : "min-w-26 w-26 "
                  }h-26 flex items-center justify-center relative bg-gray-200 overflow-hidden
                  rounded text-gray-500 transition-all duration-300`}
                >
                  {op.cccd_img ? (
                    <img
                      src={op.cccd_img}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <>CCCD</>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageCCCD(index, e.target.files[0], e)
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Tooltip>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <Input
                    placeholder="Họ tên"
                    value={op.fullname}
                    className="require"
                    onChange={(e) =>
                      handleChange(index, "fullname", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Số điện thoại"
                    value={op.phone}
                    onChange={(e) =>
                      handleChange(index, "phone", e.target.value)
                    }
                  />
                  <Input
                    placeholder="CMND/CCCD"
                    value={op.cardid}
                    onChange={(e) =>
                      handleChange(index, "cardid", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <DatePicker
                    placeholder="Ngày sinh"
                    className="w-[120px]"
                    format="YYYY-MM-DD"
                    value={op.old ? dayjs(op.old, "YYYY-MM-DD") : null}
                    onChange={(date, dateString) =>
                      handleChange(index, "old", dateString)
                    }
                    disabledDate={(current) => {
                      return current && current > dayjs().endOf("day");
                    }}
                  />
                  <Select
                    placeholder="Giới tính"
                    value={op.sex}
                    onChange={(e) => handleChange(index, "sex", e)}
                    options={["Nam", "Nữ"].map((cc) => ({
                      value: cc,
                      label: cc,
                    }))}
                    className="w-[120px]"
                  />
                  <Input
                    placeholder="Địa chỉ"
                    value={op.address}
                    className="!w-[120px]"
                    onChange={(e) =>
                      handleChange(index, "address", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[160px] max-w-[160px]">
                  <Tooltip trigger="focus">
                    <Select
                      placeholder="Ngân hàng"
                      value={op.bank_code}
                      onChange={(e) => handleChange(index, "bank_code", e)}
                      showSearch={true}
                      options={banks.map((bank) => ({
                        value: bank.bin,
                        label: `${bank.shortName} - ${bank.name}`,
                      }))}
                      filterOption={(input, option) =>
                        option?.label
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Tooltip>
                  <Select
                    placeholder="Loại tài khoản"
                    value={op.bank_type}
                    defaultValue="Chính chủ"
                    onChange={(e) => handleChange(index, "bank_type", e)}
                    options={["Chính chủ", "Người thân", "Mượn"].map(
                      (type) => ({
                        value: type,
                        label: type,
                      })
                    )}
                  />
                  <Input
                    placeholder="Số tài khoản"
                    value={op.bank_number}
                    onChange={(e) =>
                      handleChange(index, "bank_number", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <Select
                    placeholder="Phân loại"
                    showSearch={true}
                    value={op.type}
                    onChange={(e) => handleChange(index, "type", e)}
                    options={["Người mới", "Người của vendor"].map((type) => ({
                      value: type,
                      label: type,
                    }))}
                  />
                  {op.type === "Người mới" ? (
                    <Select
                      placeholder="Người tuyển"
                      showSearch={true}
                      value={op.staff}
                      onChange={(e) => handleChange(index, "staff", e)}
                      options={user?.staff?.map((staff) => ({
                        value: staff.id,
                        label: `${staff.username} (${staff.cardID})`,
                      }))}
                      filterOption={(input, option) =>
                        option?.label
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  ) : (
                    <Select
                      placeholder="Chọn vendor"
                      showSearch={true}
                      value={op.staff}
                      onChange={(e) => handleChange(index, "staff", e)}
                      options={user?.staff?.map((staff) => ({
                        value: staff.id,
                        label: `${staff.username} (${staff.cardID})`,
                      }))}
                      filterOption={(input, option) =>
                        option?.label
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  )}
                  <Input
                    placeholder="Ghi chú"
                    value={op.note}
                    onChange={(e) =>
                      handleChange(index, "note", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <DatePicker
                    placeholder="Ngày vào làm"
                    className="w-[160px]"
                    format="YYYY-MM-DD"
                    value={op.old ? dayjs(op.work_date, "YYYY-MM-DD") : null}
                    onChange={(date, dateString) =>
                      handleChange(index, "work_date", dateString)
                    }
                    disabledDate={(current) => {
                      return current && current > dayjs().endOf("day");
                    }}
                  />
                  <Select
                    placeholder="Công ty"
                    value={op.customer}
                    onChange={(e) => handleChange(index, "customer", e)}
                    options={["Công ty A", "Công ty B"].map((cc) => ({
                      value: cc,
                      label: cc,
                    }))}
                    className="w-[160px]"
                  />
                  <Input
                    className="!w-[160px]"
                    placeholder="Tên đi làm"
                    value={op.work_name}
                    onChange={(e) =>
                      handleChange(index, "work_name", e.target.value)
                    }
                  />
                </div>
                <div className="flex h-full flex-col justify-start gap-1 min-w-[160px]">
                  <Select
                    placeholder="Nhà chính"
                    value={op.supplier}
                    onChange={(e) => handleChange(index, "supplier", e)}
                    options={["Nhà chính A", "Nhà chính B"].map((cc) => ({
                      value: cc,
                      label: cc,
                    }))}
                    className="w-[160px]"
                  />
                </div>
                <div className="ml-auto flex items-center gap-3">
                  {op.fullname === null && (
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
