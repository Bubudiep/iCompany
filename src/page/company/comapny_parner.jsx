import { Button, Input, Modal, Form, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import api from "../../components/api";
import { useUser } from "../../components/context/userContext";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import app from "../../components/app";
import * as XLSX from "xlsx";
import Alert_box from "../../components/alert-box";

const Company_partner = () => {
  const { menu } = useOutletContext();
  const { user } = useUser();
  const page_size = 100;
  const [total, setTotal] = useState(0);
  const [partners, setPartners] = useState(user?.company?.Vendor);
  const [nextpage, setNextpage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingVendor, setEditingVendor] = useState(null);
  const [editForm] = Form.useForm();
  const [search, setSearch] = useState("");

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    editForm.setFieldsValue(vendor); // set value vào form
  };

  const handleUpdate = () => {
    editForm.validateFields().then((values) => {
      api
        .patch(`/vendors/${editingVendor.id}/`, values, user.token)
        .then((res) => {
          setPartners((old) =>
            old.map((v) => (v.id === editingVendor.id ? res : v))
          );
          setEditingVendor(null);
        })
        .catch((e) => console.log(e));
    });
  };
  const loadPartners = () => {
    const old_parner = partners?.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    api
      .get(
        `/vendors/?page_size=999${
          old_parner.length > 0
            ? `&last_update=${old_parner[0].updated_at}`
            : ``
        }`,
        user.token
      )
      .then((res) => {
        setPartners((old) => [...old, ...res?.results]);
        setNextpage(res?.next);
        setTotal(res?.count);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleDownloadTemplate = () => {
    const headers = [
      ["name", "fullname", "email", "hotline", "address", "website"],
      [
        "Tên gọi ngắn",
        "Tên đầy đủ",
        "Địa chỉ email",
        "Số Hotline",
        "Địa chỉ",
        "Trang web",
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");
    XLSX.writeFile(workbook, "congty_cung_ung.xlsx");
  };
  const handleUploadExcel = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Chuyển sheet thành array of objects
        const vendors = XLSX.utils.sheet_to_json(worksheet);

        const filteredVendors = vendors.filter(
          (vendor) => vendor.name !== "Tên gọi ngắn"
        );
        if (!filteredVendors.length) {
          message.warning("File rỗng hoặc không đúng định dạng.");
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        filteredVendors.forEach((vendor) => {
          api
            .post("/vendors/", vendor, user.token)
            .then((res) => {
              successCount += 1;
              setPartners((old) => [...old, res]);
              setTotal((old) => old + 1);
            })
            .catch(() => {
              errorCount += 1;
            })
            .finally(() => {
              if (successCount + errorCount === filteredVendors.length) {
                if (errorCount) {
                  message.warning(`Đã thêm ${successCount}, lỗi ${errorCount}`);
                } else {
                  message.success("Thêm tất cả vendor thành công!");
                }
              }
            });
        });
      } catch (error) {
        console.error("Lỗi khi xử lý file Excel:", error);
        message.error("Không thể đọc file Excel.");
      }
    };

    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    loadPartners();
    return () => {
      setPartners([]);
    };
  }, []);
  const handleCreate = (values) => {
    const data = { ...values, company: user?.company?.id };
    api
      .post("/vendors/", data, user.token)
      .then((res) => {
        message.success("Thêm vendor thành công!");
        setPartners((old) => [res, ...old]); // Thêm vendor mới vào đầu danh sách
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((e) => {
        message.error("Có lỗi xảy ra!");
        console.log(e);
      });
  };

  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop overflow-hidden min-w-[720px]">
        <Alert_box
          text="Danh sách các Công ty cung ứng nhân lực khác vừa có thể là Vendor vừa
          là Nhà chính"
        />
        <div className="whitebox flex-1 flex flex-col overflow-hidden !p-0">
          <div className="tools flex justify-between p-2">
            <div className="flex gap-1">
              <Input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
              >
                Tải mẫu Excel
              </Button>
              <Upload
                customRequest={handleUploadExcel}
                showUploadList={false}
                accept=".xlsx"
              >
                <Button icon={<UploadOutlined />}>Tải lên Excel</Button>
              </Upload>
              <Button
                type="primary"
                icon={<FaPlus />}
                onClick={() => setIsModalOpen(true)}
              >
                Thêm mới
              </Button>
            </div>
          </div>
          <div className="flex flex-1 items-start overflow-auto mr-1 pr-1 mb-1">
            <table className="table w-full border-collapse text-left relative">
              <thead className="z-10 sticky top-0 bg-[#fff] shadow-bot">
                <tr>
                  <th className="p-2 !text-[13px] !font-[400] text-[#999] text-nowrap">
                    Tên gọi
                  </th>
                  <th className="p-2 !text-[13px] !font-[400] text-[#999] text-nowrap">
                    Tên đầy đủ
                  </th>
                  <th className="p-2 !text-[13px] !font-[400] text-[#999] text-nowrap">
                    Địa chỉ
                  </th>
                  <th className="p-2 !text-[13px] !font-[400] text-[#999] text-nowrap">
                    Email
                  </th>
                  <th className="p-2 !text-[13px] !font-[400] text-[#999] text-nowrap">
                    Hotline
                  </th>
                  <th className="p-2 !text-[13px] !font-[400] text-[#999] text-nowrap">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {partners
                  .filter((p) =>
                    app
                      .removeSpecial(p.name.toLowerCase())
                      .replaceAll(" ", "")
                      .includes(
                        (
                          app.removeSpecial(search.toLowerCase()) || ""
                        ).replaceAll(" ", "")
                      )
                  )
                  .map((p) => (
                    <tr key={p.id} className="border-b border-[#0003]">
                      <td className="p-2 font-semibold">{p?.name ?? "-"}</td>
                      <td className="p-2">{p?.fullname ?? "-"}</td>
                      <td className="p-2">{p?.address ?? "-"}</td>
                      <td className="p-2">{p?.email ?? "-"}</td>
                      <td className="p-2">{p?.hotline ?? "-"}</td>
                      <td className="p-2">
                        <Button onClick={() => handleEdit(p)}>Sửa</Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={!!editingVendor}
        title={`Chỉnh sửa ${editingVendor?.name}`}
        onCancel={() => setEditingVendor(null)}
        onOk={handleUpdate}
        className="popupcontent vendor-edit"
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" className="!px-4">
          <Form.Item name="name" label="Tên gọi" rules={[{ required: true }]}>
            <Input placeholder="Công ty A..." />
          </Form.Item>
          <Form.Item name="fullname" label="Tên đầy đủ">
            <Input placeholder="Công ty TNHH A..." />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="congty@gmail.com..." />
          </Form.Item>
          <Form.Item name="hotline" label="Hotline">
            <Input placeholder="1900 000 000..." />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Xã - Huyện - Tỉnh..." />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={isModalOpen}
        title="Thêm đối tác mới"
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        className="popupcontent vendor-edit"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          className="!px-4"
        >
          <Form.Item
            name="name"
            label="Tên viết tắt"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input placeholder="Công ty A..." />
          </Form.Item>
          <Form.Item name="fullname" label="Tên đầy đủ">
            <Input placeholder="Công ty TNHH A..." />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="congty@gmail.com..." />
          </Form.Item>
          <Form.Item name="hotline" label="Hotline">
            <Input placeholder="1900 000 000..." />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Xã - Huyện - Tỉnh..." />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Company_partner;
