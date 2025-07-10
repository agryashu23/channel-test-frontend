// import React, { useMemo } from "react";
// import ChannelLogo from "../../../assets/icons/default_channel_logo.svg";
// import { ChannelImages } from "../../constants/images";
// import {
//   setChannelIdToDelete,
//   setChannelNameToDelete,
// } from "../../../redux/slices/deleteChannelSlice.js";

// const ChannelItem = ({
//   channel,
//   myUserId,
//   isLoggedIn,
//   isOwner,
//   isEditDropdownOpen,
//   dropdownEditRef,
//   handleChannelPage,
//   handleOwnerShareChannel,
//   handleShareChannel,
//   handleLeaveChannel,
//   handleJoinChannel,
//   toggleEditDropdown,
//   handleEditChannel,
//   dispatch,
//   handleOpenModal
// }) => {
//   const buttonState = useMemo(() => {
//     if (!isLoggedIn || !myUserId) return "Join channel";
//     if (channel.user?._id?.toString() === myUserId?.toString()) return "";
//     const member = channel.members?.find(
//       (m) => m?.user?.toString() === myUserId?.toString()
//     );
//     if (member?.status === "joined") return "Exit channel";
//     if (member?.status === "request") return "Requested";
//     return "Join channel";
//   }, [channel.members, channel.user, myUserId, isLoggedIn]);

//   const isChannelPart = channel?.members?.some(
//     (m) => m?.user?.toString() === myUserId?.toString() && m.status === "joined"
//   );

//   return (
//     <div
//       key={channel._id}
//       className="p-3 rounded-lg mt-4 border border-theme-chatDivider justify-start flex xs:flex-row flex-col items-start"
//     >
//       <img
//         src={channel.logo || ChannelLogo}
//         alt="logo"
//         className="h-16 w-16 rounded-lg cursor-pointer flex-shrink-0 object-cover"
//         onClick={() => handleChannelPage(channel)}
//       />

//       <div className="flex flex-col xs:ml-3 xs:-mt-1 mt-1.5">
//         <div
//           className="text-theme-secondaryText text-lg font-normal cursor-pointer"
//           onClick={() => handleChannelPage(channel)}
//         >
//           {channel.name}
//         </div>

//         <p className="text-theme-emptyEvent text-sm font-light xs:mt-0 mt-2.5" style={{ whiteSpace: "pre-line" }}>
//           {channel.description?.length > 150
//             ? channel.description.slice(0, 150) + "..."
//             : channel.description}
//         </p>

//         {!isOwner && !isChannelPart && (
//           <div className="flex flex-row items-center">
//             <img
//               className="mr-1 w-3 h-3 mt-0.5 dark:block hidden"
//               loading="lazy"
//               src={
//                 channel.visibility === "paid"
//                   ? ChannelImages.Secure.default
//                   : channel.visibility === "anyone"
//                   ? ChannelImages.LockOpen.default
//                   : ChannelImages.Lock.default
//               }
//               alt="lock"
//             />
//             <img
//               className="mr-1 w-3 h-3 mt-0.5 dark:hidden block"
//               loading="lazy"
//               src={
//                 channel.visibility === "paid"
//                   ? ChannelImages.SecureLight.default
//                   : channel.visibility === "anyone"
//                   ? ChannelImages.LockOpenLight.default
//                   : ChannelImages.LockLight.default
//               }
//               alt="lock-light"
//             />
//             <p className="mt-1 text-xs font-light text-theme-emptyEvent">
//               {channel.visibility === "paid"
//                 ? `This channel is paywalled. You'll be able to access it once you pay ₹${channel.paywallPrice}/-`
//                 : channel.visibility === "anyone"
//                 ? "This is a public channel. Anyone can join."
//                 : "This channel is invite-only. You'll be able to access it once the admin approves your request."}
//             </p>
//           </div>
//         )}

//         <div className="flex flex-row xs:space-x-4 space-x-3 pt-2">
//           {isOwner ? (
//             <div
//               className="py-2 xs:px-3 px-2 cursor-pointer text-theme-primaryBackground bg-theme-secondaryText rounded-lg text-xs font-inter"
//               onClick={() => handleOwnerShareChannel(channel._id)}
//             >
//               Create join link
//             </div>
//           ) : buttonState === "Exit channel" ? (
//             <div
//               className="border border-theme-primaryText py-2 xs:px-3 px-2 rounded-lg cursor-pointer text-theme-secondaryText text-xs font-inter"
//               onClick={() => handleLeaveChannel(channel)}
//             >
//               Exit channel
//             </div>
//           ) : (
//             <div
//               className={`py-2 xs:px-3 px-2 rounded-lg text-xs font-inter text-center cursor-pointer ${
//                 buttonState === "Requested"
//                   ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
//                   : "bg-theme-secondaryText text-theme-primaryBackground"
//               }`}
//               onClick={() =>
//                 buttonState === "Requested" ? null : handleJoinChannel(channel)
//               }
//             >
//               {buttonState}
//             </div>
//           )}

//           {isOwner ? (
//             <div className="relative flex items-center">
//               <img
//                 src={ChannelImages.Dots.default}
//                 alt="dots"
//                 className="dark:block hidden w-6 h-6 mr-2 cursor-pointer"
//                 onClick={() => toggleEditDropdown(channel._id)}
//               />
//               <img
//                 src={ChannelImages.DotsLight.default}
//                 alt="dots"
//                 className="dark:hidden w-6 h-6 mr-2 cursor-pointer"
//                 onClick={() => toggleEditDropdown(channel._id)}
//               />
//               {isEditDropdownOpen === channel._id && (
//                 <div
//                   ref={dropdownEditRef}
//                   className="absolute top-6 left-0 mt-1 ml-3 w-24 rounded-md shadow-lg border border-theme-chatDivider bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
//                 >
//                   <div className="py-1">
//                     <div className="flex flex-row px-3 items-center">
//                       <img
//                         src={ChannelImages.Edit.default}
//                         alt="edit"
//                         className="dark:block hidden w-4 h-4"
//                       />
//                       <img
//                         src={ChannelImages.EditLight.default}
//                         alt="edit"
//                         className="dark:hidden w-4 h-4"
//                       />
//                       <p
//                         className="block font-light px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
//                         onClick={() => handleEditChannel(channel)}
//                       >
//                         Edit
//                       </p>
//                     </div>
//                     <div
//                       className="flex flex-row px-3 items-center"
//                       onClick={() => {
//                         dispatch(setChannelIdToDelete(channel._id));
//                         dispatch(setChannelNameToDelete(channel.name));
//                         handleOpenModal("modalDeleteChannelOpen");
//                       }}
//                     >
//                       <img
//                         src={ChannelImages.Delete.default}
//                         alt="delete"
//                         className="dark:block hidden w-4 h-4"
//                       />
//                       <img
//                         src={ChannelImages.DeleteLight.default}
//                         alt="delete"
//                         className="dark:hidden w-4 h-4"
//                       />
//                       <p className="block px-2 py-2 font-light text-sm text-theme-secondaryText cursor-pointer">
//                         Delete
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div
//               className="py-2 px-3 rounded-lg border border-theme-primaryText text-theme-secondaryText text-xs font-inter cursor-pointer"
//               onClick={() => handleShareChannel(channel._id)}
//             >
//               Share Invite
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChannelItem;
