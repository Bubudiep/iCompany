import React, { useEffect, useState } from "react";
import { Modal, List, Tooltip } from "antd";
import { useUser } from "../context/userContext";
import { FaAddressBook, FaUser } from "react-icons/fa";
import api from "../api";
import { useNavigate } from "react-router-dom";

const New_chats = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setUser } = useUser();
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChat = (staff) => {
    api.post(`/staff/${staff}/chat/`, {}, user.token).then((res) => {
      setUser((old) => ({
        ...old,
        chatbox: [res, ...old.chatbox.filter((chatb) => chatb.id !== res.id)],
      }));
      navigate(`/app/chat/${res.id}`);
      setIsModalOpen(false);
    });
  };
  useEffect(() => {
    setContacts(user?.company?.Staff);
  }, [user]);
  return (
    <>
      <div onClick={showModal}>{children}</div>
      <Modal
        title={
          <div className="flex gap-3 ml-1 items-center">
            <FaAddressBook size={20} /> Danh bạ
          </div>
        }
        className="popupcontent"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-1 list-one max-h-[400px] overflow-y-auto">
          {contacts
            .filter((staff) => staff.id !== user?.info?.id)
            .map((staff) => (
              <div
                key={staff.id}
                className="item select-none"
                onClick={() => {
                  handleChat(staff.id);
                }}
              >
                <div className="relative">
                  <div className="avatar">
                    {staff?.avatar ? <img src={staff.avatar} /> : <FaUser />}
                  </div>
                  {user?.onlines?.find((user) => user.id === staff?.id) && (
                    <Tooltip title="Đang hoạt động">
                      <div
                        className="absolute -right-0.5 -bottom-0.5
                            w-[12px] h-[12px] bg-[#07c400] rounded-full border-2 border-[#fff]"
                      ></div>
                    </Tooltip>
                  )}
                </div>
                <div className="name">
                  {staff?.profile?.full_name || "Chưa có profile"} (
                  {staff?.cardID})
                </div>
                <div className="ml-auto">
                  {staff?.department_name && (
                    <>
                      {staff?.department_name} ({staff?.possition_name})
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default New_chats;
