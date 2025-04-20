import { Button, Input, Modal, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import api from "../../components/api";
import { useUser } from "../../components/context/userContext";

const Company_partner = () => {
  const { menu } = useOutletContext();
  const { user } = useUser();
  const page_size = 20;

  const [partners, setPartners] = useState([]);
  const [nextpage, setNextpage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingVendor, setEditingVendor] = useState(null);
  const [editForm] = Form.useForm();

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
    api
      .get(`/vendors/?page_size=${page_size}`, user.token)
      .then((res) => {
        setPartners((old) => [...old, ...res?.results]);
        setNextpage(res?.next);
      })
      .catch((e) => {
        console.log(e);
      });
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
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop">
        <div className="flex whitebox !p-2">
          Danh sách các Công ty cung ứng nhân lực khác vừa có thể là Vendor vừa
          là Nhà chính
        </div>
        <div className="whitebox h-full flex flex-col overflow-hidden !p-0">
          <div className="tools flex justify-between border-b-1 border-[#0003] p-2">
            <div className="flex gap-1">
              <Input placeholder="Tìm kiếm..." />
            </div>
            <div className="flex">
              <Button
                type="primary"
                icon={<FaPlus />}
                onClick={() => setIsModalOpen(true)}
              >
                Thêm mới
              </Button>
            </div>
          </div>
          <div className="flex flex-col overflow-auto p-2">
            {partners.map((p) => (
              <div key={p.id} className="border p-2 mb-2 rounded bg-[#f9f9f9]">
                <div className="font-semibold">{p.name}</div>
                <div>{p.fullname}</div>
                <div>{p.address}</div>
                <div>{p.email}</div>
                <div>{p.hotline}</div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(p)}>Sửa</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={!!editingVendor}
        title="Chỉnh sửa Vendor"
        onCancel={() => setEditingVendor(null)}
        onOk={handleUpdate}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fullname" label="Tên đầy đủ">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="hotline" label="Hotline">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
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
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="Tên viết tắt"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="fullname" label="Tên đầy đủ">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="hotline" label="Hotline">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Company_partner;
