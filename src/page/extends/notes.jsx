import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button } from "antd";
import { FaNoteSticky, FaQrcode } from "react-icons/fa6";
import api from "../../components/api";
import { useUser } from "../../components/context/userContext";
import Staff_view from "../../components/by_id/staff_view";
import dayjs from "dayjs";

const Notes_records = () => {
  const editor = useRef(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState(note);
  const handleSave = () => {
    setNote(tempNote);
    setIsEditing(false);
    api
      .post(`note/notebook/`, { data: tempNote }, user?.token)
      .then((res) => {
        setNote(res || "Viết gì đó!");
      })
      .catch((e) => api.error(e))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    api
      .get(`note/notebook/`, user?.token)
      .then((res) => {
        setNote(res || "Viết gì đó!");
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
        <div className="flex ml-auto gap-1">
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
      </div>
      <div className="flex flex-1">
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
              <div dangerouslySetInnerHTML={{ __html: note?.content }}></div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1 w-[240px] pr-2 py-2">
          {note?.history &&
            note?.history?.map((his) => (
              <div
                className="item bg-white gap-0.5 flex flex-col p-1.5 px-2 rounded-[6px] shadow text-[13px]"
                key={his.version}
              >
                <div className="text-[#3d3d3d]">{his?.note || ""}</div>
                <div className="flex justify-between text-[10px]">
                  <div className="flex text-[#999]">Ver.{his?.version + 1}</div>
                  <div className="flex gap-1">
                    <Staff_view id={his?.edited_by} />
                    <div className="text-[#999]">
                      {dayjs(his?.created_at).format("HH:MM DD/MM/YY")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notes_records;
