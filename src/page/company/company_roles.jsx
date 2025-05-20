import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Alert_box from "../../components/alert-box";
import { useUser } from "../../components/context/userContext";
import app from "../../components/app";
import { Button, Input, message, Modal } from "antd";
import { FaEdit, FaPlus } from "react-icons/fa";
import api from "../../components/api";

const Company_roles = () => {
  const { menu } = useOutletContext();
  const { user, setUser } = useUser();
  const [department, setDepartment] = useState(user?.company?.Department);
  const [editingDept, setEditingDept] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", description: "" });
  const [newPos, setNewPos] = useState({
    name: "",
    description: "",
    department: null,
  });
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddPosOpen, setIsAddPosOpen] = useState(false);

  const handleSavePosEdit = () => {
    api
      .patch(`/positions/${editingPos.id}/`, editingPos, user.token)
      .then((res) => {
        const updated = department.map((dept) => {
          if (dept.id === res.department) {
            return {
              ...dept,
              Possition: dept.Possition.map((pos) =>
                pos.id === res.id ? res : pos
              ),
            };
          }
          return dept;
        });
        message.success("Cập nhật chức vụ thành công!");
        setUser((old) => ({
          ...old,
          company: { ...old.company, Department: updated },
        }));
        setDepartment(updated);
        setIsPosModalOpen(false);
        setEditingPos(null);
      })
      .catch((e) => {
        console.log(e);
        message.error("Có lỗi xảy ra!");
      });
  };

  const handleSaveEdit = () => {
    api
      .patch(`/departments/${editingDept.id}/`, editingDept, user.token)
      .then((res) => {
        const updated = department.map((dept) =>
          dept.id === res.id ? res : dept
        );
        message.success("Cập nhập thành công!");
        setUser((old) => ({
          ...old,
          company: { ...old.company, Department: updated },
        }));
        setDepartment(updated);
        setIsModalOpen(false);
        setEditingDept(null);
      })
      .catch((e) => {
        console.log(e);
        message.error("Có lỗi xảy ra!");
      });
  };
  const loadDepartments = () => {
    const old_dep = department.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    api
      .get(
        `/departments/?page_size=999${
          old_dep.length > 0 ? `&last_update=${old_dep[0].updated_at}` : ``
        }`,
        user.token
      )
      .then((res) => {
        setUser((old) => ({
          ...old,
          company: {
            ...old.company,
            Department: [
              ...old.company.Department.map((dept) => {
                const find = res?.results.find(
                  (newdept) => newdept.id === dept.id
                );
                if (find) return find;
                return dept;
              }),
            ],
          },
        }));
        setDepartment((old) => [
          ...old.map((dept) => {
            const find = res?.results.find((newdept) => newdept.id === dept.id);
            if (find) return find;
            return dept;
          }),
        ]);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    loadDepartments();
    return () => {
      setDepartment(user?.company?.Department);
    };
  }, []);
  return (
    <div className="flex flex-1 overflow-hidden flex-col contacts-page">
      <div className="whiteTitle fadeInBot min-w-[600px] overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="icon text-[20px]">{menu.icon}</div>
          {menu.label}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-2 gap-2 fadeInTop  min-w-[600px] overflow-hidden">
        <Alert_box text="Chỉ có boss mới có quyền thêm chức vụ và phòng ban" />
        <div className="whitebox h-full flex flex-col overflow-hidden">
          <div className="flex p-2 items-center justify-between border-b-1 border-[#c5c5c5] mb-2">
            <div className="flex ml-auto">
              <Button
                type="primary"
                onClick={() => setIsAddDeptOpen(true)}
                icon={<FaPlus />}
              >
                Thêm bộ phận
              </Button>
            </div>
          </div>
          <div className="mr-0.5 my-0.5 flex flex-col overflow-y-auto px-1 fadeInTop gap-2">
            {department?.map((dept) => {
              return (
                <div key={dept.id} className="flex flex-col">
                  <div
                    className={`flex gap-2 items-center p-2 py-1.5 rounded-[8px] 
                    relative bg-[#f1f3f8] border-1 border-[#a8a8a8] transition-all text-[13px]`}
                  >
                    <div className="flex flex-col w-[50px] items-center">
                      <div
                        className="avatar text-[20px] w-[44px] h-[44px] bg-[#0084ff] rounded-xl flex 
                        items-center justify-center text-[#fff] font-[700]"
                      >
                        {dept?.name}
                      </div>
                    </div>
                    <div className="flex flex-col w-[180px]">
                      <div className="name font-[500]">
                        {dept?.description ?? "/ Không có mô tả"}
                      </div>
                      <div className="name text-[#777]">
                        {dept?.isActive ? "Active" : "Not active"}
                      </div>
                    </div>
                    <div className="flex flex-col w-[120px] ml-auto text-[#999]">
                      <div className="name">
                        Sửa {app.timeSince(dept?.updated_at)}
                      </div>
                      <div className="name">
                        Tạo {app.timeSince(dept?.created_at)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        icon={<FaEdit />}
                        type="primary"
                        size="small"
                        className="!text-[12px]"
                        onClick={() => {
                          setEditingDept(dept);
                          setIsModalOpen(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        className="!text-[12px]"
                        onClick={() => {
                          setIsAddPosOpen(true);
                          setNewPos({ ...newPos, department: dept.id });
                        }}
                        icon={<FaPlus />}
                      >
                        Chức vụ
                      </Button>
                    </div>
                  </div>
                  {dept?.Possition?.length > 0 && (
                    <div className="flex flex-col gap-1 ml-10 py-1 border-l-2 pl-4 border-[#b9e3ff]">
                      {dept.Possition.map((pos) => {
                        return (
                          <div
                            key={pos.id}
                            className="flex gap-1 pl-3 items-center p-2 text-[#999] role-item
                            transition-all bg-[#f3f5f8] rounded-[4px] border-[#c9c9c9] border-1"
                          >
                            <div className="name font-[600] text-[14px]">
                              {pos.name}
                            </div>
                            <div className="flex ml-auto gap-5">
                              <div className="name text-[13px]">
                                {pos?.description ?? "/ Không có mô tả"}
                              </div>
                              <Button
                                icon={<FaEdit />}
                                type="primary"
                                size="small"
                                className="!text-[12px]"
                                onClick={() => {
                                  setEditingPos(pos);
                                  setIsPosModalOpen(true);
                                }}
                              >
                                Sửa
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        title="Thêm bộ phận"
        open={isAddDeptOpen}
        className="popupcontent vendor-edit"
        onCancel={() => {
          setIsAddDeptOpen(false);
          setNewDept({ name: "", description: "" });
        }}
        onOk={() => {
          api
            .post(`/departments/`, newDept, user.token)
            .then((res) => {
              const updated = [...department, { ...res, Possition: [] }];
              setDepartment(updated);
              setUser((old) => ({
                ...old,
                company: { ...old.company, Department: updated },
              }));
              message.success("Thêm bộ phận thành công!");
              setIsAddDeptOpen(false);
              setNewDept({ name: "", description: "" });
            })
            .catch(() => message.error("Có lỗi xảy ra khi thêm bộ phận!"));
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <div className="flex flex-col gap-1 overflow-hidden">
          <Input
            placeholder="Tên bộ phận"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="mb-2"
          />
          <Input.TextArea
            placeholder="Mô tả"
            value={newDept.description}
            onChange={(e) =>
              setNewDept({ ...newDept, description: e.target.value })
            }
          />
        </div>
      </Modal>
      <Modal
        title="Thêm chức vụ"
        className="popupcontent vendor-edit"
        open={isAddPosOpen}
        onCancel={() => {
          setIsAddPosOpen(false);
          setNewPos({ name: "", description: "", department: null });
        }}
        onOk={() => {
          api
            .post(`/positions/`, newPos, user.token)
            .then((res) => {
              const updated = department.map((dept) =>
                dept.id === res.department
                  ? { ...dept, Possition: [...dept.Possition, res] }
                  : dept
              );
              setDepartment(updated);
              setUser((old) => ({
                ...old,
                company: { ...old.company, Department: updated },
              }));
              message.success("Thêm chức vụ thành công!");
              setIsAddPosOpen(false);
              setNewPos({ name: "", description: "", department: null });
            })
            .catch(() => message.error("Có lỗi xảy ra khi thêm chức vụ!"));
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <select
          className="border border-[#0003] px-2 py-1 rounded-md text-[#999] mb-2"
          value={newPos.department ?? ""}
          disabled={true}
          onChange={(e) =>
            setNewPos({ ...newPos, department: parseInt(e.target.value) })
          }
        >
          <option value="">Chọn bộ phận</option>
          {department.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Tên chức vụ"
            value={newPos.name}
            onChange={(e) => setNewPos({ ...newPos, name: e.target.value })}
            className="mb-2"
          />
          <Input.TextArea
            placeholder="Mô tả"
            value={newPos.description}
            onChange={(e) =>
              setNewPos({ ...newPos, description: e.target.value })
            }
          />
        </div>
      </Modal>
      <Modal
        title="Chỉnh sửa chức vụ"
        open={isPosModalOpen}
        className="popupcontent vendor-edit"
        onCancel={() => {
          setIsPosModalOpen(false);
          setEditingPos(null);
        }}
        onOk={handleSavePosEdit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div className="flex flex-col gap-3">
          <Input
            value={editingPos?.name}
            onChange={(e) =>
              setEditingPos({ ...editingPos, name: e.target.value })
            }
            placeholder="Tên chức vụ"
          />
          <Input.TextArea
            value={editingPos?.description || ""}
            onChange={(e) =>
              setEditingPos({ ...editingPos, description: e.target.value })
            }
            placeholder="Mô tả"
            autoSize={{ minRows: 3 }}
          />
        </div>
      </Modal>
      <Modal
        title="Chỉnh sửa bộ phận"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingDept(null);
        }}
        onOk={handleSaveEdit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div className="flex flex-col gap-3">
          <Input
            value={editingDept?.name}
            onChange={(e) =>
              setEditingDept({ ...editingDept, name: e.target.value })
            }
            placeholder="Tên bộ phận"
          />
          <Input.TextArea
            value={editingDept?.description || ""}
            onChange={(e) =>
              setEditingDept({ ...editingDept, description: e.target.value })
            }
            placeholder="Mô tả"
            autoSize={{ minRows: 3 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Company_roles;
