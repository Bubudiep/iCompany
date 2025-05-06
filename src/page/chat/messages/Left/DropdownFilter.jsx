// import React, { useState, useRef, useEffect } from "react";
// import { FaChevronDown, FaTag, FaUserSecret } from "react-icons/fa";

// const categories = [
//   "Study",
//   "My Friends",
//   "AI",
//   "My Best Friend",
//   "My Teacher",
//   "Tin nhắn từ người lạ",
// ];

// export default function DropdownFilter() {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Đóng dropdown khi click ra ngoài
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       className="relative inline-block text-left cursor-pointer"
//       ref={dropdownRef}
//     >
//       <span
//         onClick={() => setOpen(!open)}
//         className="inline-flex items-center px-3 py-2  rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-blue-500 hover:text-white"
//       >
//         Phân loại <FaChevronDown className="ml-1 text-xs" />
//       </span>

//       {open && (
//         <div className="absolute right-[-40px] mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 text-sm">
//           <div className="font-semibold mb-2 text-gray-700">
//             Theo trạng thái
//           </div>
//           <div className="flex flex-col gap-2 mb-3">
//             <label className="flex items-center gap-2">
//               <input type="radio" name="status" defaultChecked />
//               <span>Tất cả</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input type="radio" name="status" />
//               <span>Chưa đọc</span>
//             </label>
//           </div>

//           <hr className="my-2" />

//           <div className="font-semibold mb-2 text-gray-700">
//             Theo thẻ phân loại
//           </div>
//           <div className="flex flex-col gap-2">
//             {categories.map((item, index) => (
//               <label key={index} className="flex items-center gap-2">
//                 <input type="checkbox" />
//                 {item === "Tin nhắn từ người lạ" ? (
//                   <FaUserSecret className="text-black" />
//                 ) : (
//                   <FaTag className="text-red-500" />
//                 )}
//                 <span>{item}</span>
//               </label>
//             ))}
//           </div>

//           <hr className="my-3" />
//           <button className="text-blue-500 hover:underline text-sm cursor-pointer">
//             Quản lý thẻ phân loại
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
