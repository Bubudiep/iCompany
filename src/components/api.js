import { message } from "antd";
import axios from "axios";

const key = import.meta.env.VITE_KEY;
const author = import.meta.env.VITE_AUTHOR;
const version = import.meta.env.VITE_VERSION;
const host = import.meta.env.VITE_HOST;
const DEFAULT_DEBOUNCE_DELAY = 100;
const debugMode = import.meta.env.VITE_DEBUGMODE === "development";

const api = axios.create({
  baseURL: host + "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
const abortControllers = {};
const debounceTimers = {};
const DEFAULT_DELAY = 100;
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    if (debugMode) console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    const start = response.config.metadata?.startTime;
    const duration = start ? new Date() - start : "N/A";
    if (debugMode) {
      console.log(`✅ [RESPONSE] ${response.config.url} took ${duration} ms`);
    }
    return response;
  },
  (error) => {
    const config = error.config || {};
    const url = config.url || "unknown";
    const start = config.metadata?.startTime;
    const duration = start ? new Date() - start : "N/A";
    if (axios.isCancel(error)) {
      if (debugMode) {
        console.warn(`⚠️ [CANCELLED] ${url} after ${duration} ms`);
      }
    } else {
      if (debugMode) {
        console.error(
          `❌ [ERROR] ${url} failed after ${duration} ms`,
          error.message
        );
      }
    }
    return Promise.reject(error);
  }
);

function clearPrevious(url) {
  if (debounceTimers[url]) clearTimeout(debounceTimers[url]);
  if (abortControllers[url]) {
    abortControllers[url].abort();
    if (debugMode) console.warn(`🛑 Cancelled previous request to ${url}`);
  }
}

function buildHeaders(token, extraHeaders = {}) {
  return {
    Authorization: `Bearer ${token}`,
    ApplicationKey: key,
    ...extraHeaders,
  };
}

// 📌 Debounce GET with token
export const debounceGet = (url, token, delay = DEFAULT_DELAY) => {
  clearPrevious(url);
  return new Promise((resolve, reject) => {
    debounceTimers[url] = setTimeout(async () => {
      const controller = new AbortController();
      abortControllers[url] = controller;
      try {
        const response = await api.get(url, {
          signal: controller.signal,
          headers: buildHeaders(token),
        });
        resolve(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
        reject(error);
      } finally {
        delete debounceTimers[url];
        delete abortControllers[url];
      }
    }, delay);
  });
};

// 📌 Debounce GET with custom headers
export const debounceGets = (url, headers, delay = DEFAULT_DELAY) => {
  clearPrevious(url);

  return new Promise((resolve, reject) => {
    debounceTimers[url] = setTimeout(async () => {
      const controller = new AbortController();
      abortControllers[url] = controller;

      try {
        const response = await api.get(url, {
          signal: controller.signal,
          headers,
        });
        resolve(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
        reject(error);
      } finally {
        delete debounceTimers[url];
        delete abortControllers[url];
      }
    }, delay);
  });
};

// 📌 Debounce POST
export const debouncePost = (url, data, token, delay = DEFAULT_DELAY) => {
  clearPrevious(url);

  return new Promise((resolve, reject) => {
    debounceTimers[url] = setTimeout(async () => {
      const controller = new AbortController();
      abortControllers[url] = controller;

      try {
        const response = await api.post(url, data, {
          signal: controller.signal,
          headers: buildHeaders(token),
        });
        resolve(response.data);
      } catch (error) {
        console.error("Error posting data", error);
        reject(error);
      } finally {
        delete debounceTimers[url];
        delete abortControllers[url];
      }
    }, delay);
  });
};

// 📌 Debounce PATCH
export const debouncePatch = (url, data, token, delay = DEFAULT_DELAY) => {
  clearPrevious(url);

  return new Promise((resolve, reject) => {
    debounceTimers[url] = setTimeout(async () => {
      const controller = new AbortController();
      abortControllers[url] = controller;

      try {
        const response = await api.patch(url, data, {
          signal: controller.signal,
          headers: buildHeaders(token),
        });
        resolve(response.data);
      } catch (error) {
        console.error("Error patching data", error);
        reject(error);
      } finally {
        delete debounceTimers[url];
        delete abortControllers[url];
      }
    }, delay);
  });
};

// 📌 Debounce DELETE
export const debounceDelete = (url, token, delay = DEFAULT_DELAY) => {
  clearPrevious(url);

  return new Promise((resolve, reject) => {
    debounceTimers[url] = setTimeout(async () => {
      const controller = new AbortController();
      abortControllers[url] = controller;

      try {
        const response = await api.delete(url, {
          signal: controller.signal,
          headers: buildHeaders(token),
        });
        resolve(response.data);
      } catch (error) {
        console.error("Error deleting data", error);
        reject(error);
      } finally {
        delete debounceTimers[url];
        delete abortControllers[url];
      }
    }, delay);
  });
};
const error = (e) => {
  message.error(
    e?.response?.data?.detail ||
      e?.response?.data?.details ||
      e?.response?.data?.error ||
      e?.response?.data?.errors ||
      "Có lỗi xảy ra!"
  );
};
const mapBreadcrumb = {
  extends: "Tiện ích",
  config: "Cài đặt",
  user: "Cá nhân hóa",
  app: "Trang chủ",
  companys: "Công ty",
  roles: "Phòng ban & chức vụ",
  accounts: "Quản lý tài khoản",
  chat: "Trò chuyện",
  contacts: "Danh bạ",
  settings: "Cài đặt",
  all: "Tất cả",
  qrbanks: "QRBanks",
  approve: "Phê duyệt",
  baoung: "Báo ứng",
  giuluong: "Giữ lương",
  chitieu: "Chi tiêu",
  operators: "Nhân lực",
  add: "Thêm mới",
  work_report: "Báo cáo đi làm",
  group: "Nhóm",
  department: "Bộ phận",
  chatted: "Đã nhắn tin",
  partners: "Công ty cung ứng",
  customers: "Khách hàng",
  permission: "Phân quyền",
  dashboard: "Tổng quan",
};
function numberToVietnameseText(number) {
  if (typeof number !== "number") {
    number = parseInt(number);
  }

  if (isNaN(number)) return "Không hợp lệ";

  if (number === 0) return "Không đồng";

  const chuSo = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const hangDonVi = [
    "",
    "nghìn",
    "triệu",
    "tỷ",
    "nghìn tỷ",
    "triệu tỷ",
    "tỷ tỷ",
  ];

  function docBaSo(num) {
    let tram = Math.floor(num / 100);
    let chuc = Math.floor((num % 100) / 10);
    let donvi = num % 10;
    let result = "";

    if (tram !== 0) {
      result += chuSo[tram] + " trăm";
      if (chuc === 0 && donvi !== 0) result += " linh";
    }

    if (chuc !== 0 && chuc !== 1) {
      result += " " + chuSo[chuc] + " mươi";
      if (donvi === 1) result += " mốt";
      else if (donvi === 5) result += " lăm";
      else if (donvi !== 0) result += " " + chuSo[donvi];
    } else if (chuc === 1) {
      result += " mười";
      if (donvi === 1) result += " một";
      else if (donvi === 5) result += " lăm";
      else if (donvi !== 0) result += " " + chuSo[donvi];
    } else if (donvi !== 0) {
      result += " " + chuSo[donvi];
    }

    return result.trim();
  }

  let result = "";
  let i = 0;

  while (number > 0) {
    let baSo = number % 1000;

    if (baSo !== 0) {
      let doc = docBaSo(baSo);
      if (i > 0) result = doc + " " + hangDonVi[i] + " " + result;
      else result = doc + " " + result;
    }

    number = Math.floor(number / 1000);
    i++;
  }

  // Chuẩn hóa: viết hoa chữ cái đầu và thêm "đồng"
  result = result.trim();
  result = result.charAt(0).toUpperCase() + result.slice(1) + " đồng";

  return result;
}

export default {
  numberToVietnameseText,
  mapBreadcrumb,
  error,
  get: debounceGet,
  gets: debounceGets,
  post: debouncePost,
  patch: debouncePatch,
  delete: debounceDelete,
  key,
};
