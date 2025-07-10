// import CopyIcon from "../../../assets/icons/copy_icon.png";
// import { React, useState, useSelector } from "../../../globals/imports.js";

// const SettingsTab = () => {
//   const [copied, setCopied] = useState(false);
//   const business = useSelector((state) => state.business);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(business.business.apiKey);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Copy failed:", err);
//     }
//   };
//   return (
//     <div className="flex flex-col sm:pl-10 pl-6 pt-6">
//       <p className="text-theme-secondaryText text-lg md:text-xl lg:text-2xl font-normal ">
//         Settings
//       </p>
//       <div className="border-[1px] border-theme-tertiaryBackground my-4 pl-6"></div>
//       <div>
//         <p className="text-md text-theme-primaryText font-light mt-6 mb-2">
//           API Key
//         </p>
//         <div className="flex flex-row items-center mt-1">
//           <input
//             type="password"
//             value={business.business.apiKey}
//             readOnly
//             className="sm:w-1/2 w-3/4 bg-theme-tertiaryBackground px-4 py-4 rounded-lg text-sm text-theme-secondaryText "
//           />
//           <div className="relative">
//             <img
//               src={CopyIcon}
//               alt="Copy"
//               className="ml-4 cursor-pointer h-6 w-6"
//               onClick={handleCopy}
//             />
//             {copied && (
//               <p className="absolute bottom-6 left-2 text-xs text-theme-emptyEvent mt-1">
//                 Copied
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <p className="text-md text-theme-primaryText font-light mt-6 mb-2">
//         Domain name
//       </p>
//       <div className="flex flex-row items-center">
//         <input
//           type="text"
//           value={business.business.domain}
//           readOnly
//           className="sm:w-1/2 w-3/4 bg-theme-tertiaryBackground px-4 py-4 rounded-lg text-sm text-theme-secondaryText "
//         />
//         <p className="ml-3 text-sm mt-1 text-theme-emptyEvent italic ">
//           Read only
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SettingsTab;
