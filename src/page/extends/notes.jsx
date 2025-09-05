import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button, Input, Modal } from "antd";
import { FaNoteSticky, FaQrcode } from "react-icons/fa6";
import api from "../../components/api";
import { useUser } from "../../components/context/userContext";
import Staff_view from "../../components/by_id/staff_view";
import dayjs from "dayjs";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

const Notes_records = () => {
  const editor = useRef(null);
  const { user } = useUser();
  const [editnote, setEditnote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState(note);
  const [noteList, setNoteList] = useState([]);
  const [showadd, setshowadd] = useState(false);
  const [newGhichu, setNewGhichu] = useState("");
  const handleSave = () => {
    setNote(tempNote);
    setIsEditing(false);
    api
      .patch(`note/${note?.id}/`, { content: tempNote }, user?.token)
      .then((res) => {
        setNote(res || "Viết gì đó!");
        setNoteList((o) => o?.map((n) => (n?.id === res?.id ? res : n)));
      })
      .catch((e) => api.error(e))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    api
      .get(`note/`, user?.token)
      .then((res) => {
        // setNote(res || "Viết gì đó!");
        setNoteList(res?.results || []);
      })
      .catch((e) => api.error(e))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="whiteTitle fadeInBot">
        <div className="flex items-center gap-3">
          <div className="icon text-[20px]">
            <FaNoteSticky />
          </div>
          Ghi chú
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col h-full bg-[white] w-[240px] shadow">
          {noteList?.map((n) => (
            <div
              className="p-2 border-b border-[#d6d6d6] select-none text-[#999] cursor-pointer"
              key={n?.id}
              onClick={() => setNote(n)}
              onDoubleClick={() => setEditnote(n)}
            >
              {n?.title}
            </div>
          ))}
          <div
            onClick={() => setshowadd(true)}
            className="p-2 items-center flex text-[#999] hover:text-[#06f] cursor-pointer transition-all duration-300"
          >
            <FiPlus /> Thêm mới
          </div>
        </div>
        <Modal
          open={editnote !== false}
          title="Sửa ghi chú"
          onCancel={() => setEditnote(false)}
          onOk={() => {
            api
              ?.patch(
                `/note/${editnote?.id}/`,
                {
                  title: editnote?.title,
                },
                user?.token
              )
              .then((res) =>
                setNoteList((o) => o?.map((i) => (i?.id === res?.id ? res : i)))
              )
              .catch((e) => api.error(e));
          }}
        >
          <div className="flex flex-col gap-2 mt-4 mb-4">
            <div>Tên ghi chú</div>
            <Input
              value={editnote?.title}
              onChange={(e) =>
                setEditnote((o) => ({ ...o, title: e?.target?.value }))
              }
              placeholder="nhập tên ghi chú..."
            />
          </div>
        </Modal>
        <Modal
          open={showadd}
          title="Thêm ghi chú"
          onCancel={() => setshowadd(false)}
          onOk={() => {
            api
              ?.post(
                "/note/",
                {
                  title: newGhichu,
                  content: "",
                },
                user?.token
              )
              .then((res) => setNoteList((o) => [res, ...o]))
              .catch((e) => api.error(e));
          }}
        >
          <div className="flex flex-col gap-2 mt-4 mb-4">
            <div>Tên ghi chú</div>
            <Input
              value={newGhichu}
              onChange={(e) => setNewGhichu(e?.target?.value)}
              placeholder="nhập tên ghi chú..."
            />
          </div>
        </Modal>
        {note ? (
          <>
            <div className="relative flex flex-1 overflow-hidden">
              <div className="flex ml-auto gap-1 absolute bottom-3 right-3 z-[100]">
                {!isEditing ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      setTempNote(note?.content);
                      setIsEditing(true);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button type="primary" onClick={handleSave}>
                      Lưu
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                  </>
                )}
              </div>
              {isEditing ? (
                <JoditEditor
                  ref={editor}
                  value={tempNote}
                  className="full_editer"
                  onBlur={(newContent) => setTempNote(newContent)}
                  config={{
                    readonly: false,
                    toolbarButtonSize: "small",
                    resizer: {
                      enabled: false,
                    },
                    uploader: {
                      insertImageAsBase64URI: true,
                      accept: "image/*",
                    },
                    placeholder: "Input your resolving content...",
                    allowResizeX: false,
                    allowResizeY: false,
                    height: "100%",
                    toolbarAdaptive: false,
                    toolbarSticky: false,
                    showCharsCounter: false,
                    showWordsCounter: false,
                    showStatusbar: false,
                    statusbar: false,
                    defaultFontSize: "13px",
                    removeButtons:
                      "ai-commands,ai-assistant,cut" +
                      "copyformat,brush,classSpan,preview,speechRecognize,image,video," +
                      "find,print,about,source,fullsize,file,symbol,selectall,hr",
                  }}
                />
              ) : (
                <div className="flex flex-1 p-2 fadeInTop">
                  <div className="flex flex-1 bg-[white] p-1 px-2 rounded-[8px] shadow text-[13px]">
                    {note?.content ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: note?.content }}
                      ></div>
                    ) : (
                      <div className="text-[#999]">Chưa có gì!</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-[240px] pr-2 py-2">
              {note?.history?.length > 0 ? (
                <>
                  {note?.history?.map((his) => (
                    <div
                      className="item bg-white gap-0.5 flex flex-col p-1.5 px-2 rounded-[6px] shadow text-[13px]"
                      key={his.version}
                    >
                      <div className="text-[#3d3d3d]">{his?.note || ""}</div>
                      <div className="flex justify-between text-[10px]">
                        <div className="flex text-[#999]">
                          Ver.{his?.version + 1}
                        </div>
                        <div className="flex gap-1">
                          <Staff_view id={his?.edited_by} />
                          <div className="text-[#999]">
                            {dayjs(his?.created_at).format("HH:MM DD/MM/YY")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-2 text-[#999] text-center">
                  Chưa có cập nhập!
                </div>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Notes_records;
