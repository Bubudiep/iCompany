import axios from "axios";
import dayjs from "dayjs";
import jsQR from "jsqr";

const random = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
const banks = async () => {
  try {
    const res = await fetch("/bank.json");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data; // Trả về dữ liệu ngân hàng
  } catch (error) {
    console.error("Error fetching banks:", error);
    return []; // Nếu có lỗi, trả về mảng rỗng
  }
};
const getAddress = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const data = await gets(url, headers);
    const { city, town, village, county, state, country } = data.address;
    return {
      lat: latitude,
      long: longitude,
      city: city || town || village || "",
      county: county || "",
      state: state || "",
      country: country || "",
      display_name:
        (data.display_name.split(",").length >= 1 &&
          data.display_name.split(",")[0]) +
        ", " +
        (data.display_name.split(",").length >= 2 &&
          data.display_name.split(",")[1]) +
        ", " +
        (data.display_name.split(",").length >= 3 &&
          data.display_name.split(",")[2]),
    };
  } catch (error) {
    console.error("Error fetching address:", error);
    return {};
  }
};
function resizeImage(img, maxSize, outputFormat = "image/jpeg", quality = 0.8) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL(outputFormat, quality);
}
function timeSince(createdAt) {
  const orderDate = new Date(createdAt);
  const now = new Date();

  const diffMs = orderDate - now;
  const isFuture = diffMs > 0;

  const diffAbsMs = Math.abs(diffMs);
  const seconds = Math.floor(diffAbsMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // xấp xỉ
  const quarters = Math.floor(months / 3);
  const years = Math.floor(months / 12);

  const suffix = isFuture ? "nữa" : "trước";

  if (seconds < 60) return `${seconds} giây ${suffix}`;
  if (minutes < 60) return `${minutes} phút ${suffix}`;
  if (hours < 24) return `${hours} giờ ${suffix}`;
  if (days < 7) return `${days} ngày ${suffix}`;
  if (weeks < 4) return `${weeks} tuần ${suffix}`;
  if (months < 12) return `${months} tháng ${suffix}`;
  if (quarters < 4) return `${quarters} quý ${suffix}`;
  return `${years} năm ${suffix}`;
}
function removeSpecial(str) {
  console.log(str);
  if (str) {
    const nonAccentStr = str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanedStr = nonAccentStr?.replace(/[^a-zA-Z0-9\s]/g, "");
    return cleanedStr.replace(/\s+/g, " ").trim();
  } else {
    return null;
  }
}
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};
const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value};`;
  if (options.path) {
    cookieString += ` path=${options.path};`;
  }
  if (options.maxAge) {
    cookieString += ` max-age=${options.maxAge};`;
  }
  if (options.domain) {
    cookieString += ` domain=${options.domain};`;
  }
  if (options.secure) {
    cookieString += " secure;";
  }
  if (options.sameSite) {
    cookieString += ` samesite=${options.sameSite};`;
  }
  document.cookie = cookieString;
};
const send = (a, b) => {
  window.electron.send(a, b);
};
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
function parseCCCDString(cccdString) {
  const fields = cccdString.split("|");
  if (fields.length < 6 || fields[0].length < 12) {
    return undefined;
  }
  const so_cccd = fields[0].trim();
  const ho_va_ten = fields[2].trim();
  const ngay_sinh_str = fields[3].trim();
  const gioi_tinh = fields[4].trim();
  const que_quan = fields[5].trim();
  const ngay_het_han_str = fields[6].trim();
  // Chuyển ngày từ "DDMMYYYY" sang format Date hoặc dayjs
  const ngay_sinh = dayjs(ngay_sinh_str, "DDMMYYYY").isValid()
    ? dayjs(ngay_sinh_str, "DDMMYYYY").format("YYYY-MM-DD")
    : null;
  const ngay_het_han = dayjs(ngay_het_han_str, "DDMMYYYY").isValid()
    ? dayjs(ngay_het_han_str, "DDMMYYYY").format("YYYY-MM-DD")
    : null;
  // Trả về một object JSON chứa thông tin
  return {
    so_cccd,
    ho_va_ten,
    ngay_sinh, // dạng dayjs object
    gioi_tinh,
    que_quan,
    ngay_het_han, // dạng dayjs object
  };
}
const zoomAndCrop = (canvas, context) => {
  const scale = 2; // Phóng to ảnh x2
  const croppedWidth = canvas.width * 0.8; // Cắt 20% viền
  const croppedHeight = canvas.height * 0.8;
  const startX = (canvas.width - croppedWidth) / 2;
  const startY = (canvas.height - croppedHeight) / 2;
  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");
  tempCanvas.width = croppedWidth * scale;
  tempCanvas.height = croppedHeight * scale;
  tempContext.drawImage(
    canvas,
    startX,
    startY,
    croppedWidth,
    croppedHeight,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );
  return tempCanvas;
};
const handleReadQR = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const processImage = (canvas, context) => {
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          return jsQR(imageData.data, canvas.width, canvas.height);
        };
        let code = processImage(canvas, context);
        if (code) {
          resolve(parseCCCDString(code.data));
        } else {
          const zoomedCanvas = zoomAndCrop(canvas, context); // bạn cần đảm bảo hàm này tồn tại
          const zoomedContext = zoomedCanvas.getContext("2d");
          code = processImage(zoomedCanvas, zoomedContext);
          if (code) {
            resolve(parseCCCDString(code.data));
          } else {
            resolve(null); // Không đọc được QR
          }
        }
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = e.target.result;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};
export default {
  handleReadQR,
  zoomAndCrop,
  convertToBase64,
  parseCCCDString,
  send,
  banks,
  resizeImage,
  getAddress,
  timeSince,
  removeSpecial,
  getCookie,
  setCookie,
  random: random,
};
