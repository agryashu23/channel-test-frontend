// import React, { useState, useEffect, useRef } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import Close from "../../../assets/icons/Close.svg";
// import { format, parseISO, parse, isValid } from "date-fns";
// import { useDispatch, useSelector } from "react-redux";
// import { closeModal, clearEventItem } from "../../../redux/slices/modalSlice";
// import { AddToCalendarButton } from "add-to-calendar-button-react";
// import ReactDOM from "react-dom";
// import Test from "../../../assets/images/test.png";
// import MapPin from "../../../assets/icons/map-pin.svg";
// import { joinEvent } from "../../../redux/slices/eventItemsSlice";

// import {
//   deleteChip,
//   clearChipIdToDelete,
// } from "../../../redux/slices/deleteChipSlice";
// import { useNavigate, useLocation } from "react-router-dom";
// import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper";

// const EventCardModal = () => {
//   const dispatch = useDispatch();
//   const isOpen = useSelector((state) => state.modals.modalEventCardOpen);
//   const myData = useSelector((state) => state.myData);
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const event = useSelector((state) => state.modals.event);
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [formattedStartDate, setFormattedStartDate] = useState("");
//   const [formattedEndDate, setFormattedEndDate] = useState("");
//   const [formattedStartTime, setFormattedStartTime] = useState("");
//   const [formattedEndTime, setFormattedEndTime] = useState("");
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const location = useLocation();
//   const fullPath = location.pathname;

//   const handleJoinEvent = () => {
//     if (isLoggedIn) {
//       dispatch(joinEvent(event._id))
//         .unwrap()
//         .then(() => {})
//         .catch((error) => {
//           console.error("Issue in joining event. Please try again.");
//         });
//     } else {
//       navigate(`${getAppPrefix()}/get-started?redirect=${fullPath}`);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutsideDropdown = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         // console.log("Clicked outside dropdown in useeffect");
//         setIsDropdownOpen(false); // Close dropdown
//       } else {
//         // console.log("Clicked inside dropdown in useEffect");
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutsideDropdown);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutsideDropdown);
//     };
//   }, [isDropdownOpen]);

//   // const handleToggleDropdown = (id) => {
//   //   setOpenDropdownId((prevId) => (prevId === id ? null : id));
//   // };

//   const formatDateTime = (startDate, endDate, startTime, endTime) => {
//     try {
//       const parsedStartDate = parseISO(startDate);
//       const parsedEndDate = endDate ? parseISO(endDate) : null;

//       if (!isValid(parsedStartDate)) throw new Error("Invalid start date");
//       if (endDate && !isValid(parsedEndDate))
//         throw new Error("Invalid end date");

//       const startDateFormatted = format(parsedStartDate, "yyyy-MM-dd");
//       const endDateFormatted = parsedEndDate
//         ? format(parsedEndDate, "yyyy-MM-dd")
//         : null;

//       const parsedStartTime = startTime
//         ? parse(startTime, "dd/M/yyyy, hh:mm:ss a", new Date())
//         : null;
//       const parsedEndTime = endTime
//         ? parse(endTime, "dd/M/yyyy, hh:mm:ss a", new Date())
//         : null;

//       const startTimeFormatted =
//         parsedStartTime && isValid(parsedStartTime)
//           ? format(parsedStartTime, "HH:mm")
//           : "";
//       const endTimeFormatted =
//         parsedEndTime && isValid(parsedEndTime)
//           ? format(parsedEndTime, "HH:mm")
//           : "";

//       // Set variables for AddToCalendarButton
//       setFormattedStartDate(startDateFormatted);
//       setFormattedEndDate(endDateFormatted || startDateFormatted);
//       setFormattedStartTime(startTimeFormatted);
//       setFormattedEndTime(endTimeFormatted);

//       // Set variables for display
//       const displayStartDate = format(parsedStartDate, "dd MMM");
//       const displayEndDate = parsedEndDate
//         ? format(parsedEndDate, "dd MMM")
//         : null;

//       const displayStartTime =
//         parsedStartTime && isValid(parsedStartTime)
//           ? format(parsedStartTime, "hh:mm a")
//           : "";
//       const displayEndTime =
//         parsedEndTime && isValid(parsedEndTime)
//           ? format(parsedEndTime, "hh:mm a")
//           : "";

//       setDate(
//         `${displayStartDate}${displayEndDate ? ` - ${displayEndDate}` : ""}`
//       );
//       setTime(
//         `${displayStartTime}${displayEndTime ? ` - ${displayEndTime}` : ""}`
//       );
//     } catch (error) {
//       console.error("Error formatting date/time:", error.message);
//     }
//   };

//   const handleGoogleCalendar = (e) => {
//     e.stopPropagation();
//     try {
//       const startUTC = new Date(
//         `${formattedStartDate}T${formattedStartTime}`
//       ).toISOString();
//       const endUTC = new Date(
//         `${formattedEndDate}T${formattedEndTime}`
//       ).toISOString();

//       const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
//         event.name
//       )}&dates=${startUTC.replace(/[-:]/g, "").slice(0, -5)}Z/${endUTC
//         .replace(/[-:]/g, "")
//         .slice(0, -5)}Z&details=${encodeURIComponent(
//         event.description || ""
//       )}&location=${encodeURIComponent(event.location || "Online")}&ctz=${
//         event.timezone
//       }`;

//       window.open(googleCalendarUrl, "_blank");
//     } catch (error) {
//       console.error("Error generating Google Calendar link:", error.message);
//     }
//   };

//   const handleOutlookCalendar = (e) => {
//     e.stopPropagation();
//     try {
//       const startUTC = new Date(
//         `${formattedStartDate}T${formattedStartTime}`
//       ).toISOString();
//       const endUTC = new Date(
//         `${formattedEndDate}T${formattedEndTime}`
//       ).toISOString();

//       const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(
//         event.name
//       )}&startdt=${startUTC}&enddt=${endUTC}&body=${encodeURIComponent(
//         event.description || ""
//       )}&location=${encodeURIComponent(event.location || "Online")}&timezone=${
//         event.timezone || "UTC"
//       }`;

//       window.open(outlookUrl, "_blank");
//     } catch (error) {
//       console.error("Error generating Outlook Calendar link:", error.message);
//     }
//   };

//   const handleDownloadICS = (e) => {
//     e.stopPropagation();
//     try {
//       const startUTC =
//         new Date(`${formattedStartDate}T${formattedStartTime}`)
//           .toISOString()
//           .replace(/[-:]/g, "")
//           .slice(0, -5) + "Z";
//       const endUTC =
//         new Date(`${formattedEndDate}T${formattedEndTime}`)
//           .toISOString()
//           .replace(/[-:]/g, "")
//           .slice(0, -5) + "Z";

//       const icsContent = `
//           BEGIN:VCALENDAR
//           VERSION:2.0
//           CALSCALE:GREGORIAN
//           BEGIN:VEVENT
//           SUMMARY:${event.name}
//           DESCRIPTION:${event.description || ""}
//           LOCATION:${event.location || "Online"}
//           DTSTART:${startUTC}
//           DTEND:${endUTC}
//           END:VEVENT
//           END:VCALENDAR
//               `.trim();

//       const blob = new Blob([icsContent], {
//         type: "text/calendar;charset=utf-8",
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${event.name || "Event"}.ics`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error generating ICS file:", error.message);
//     }
//   };

//   const handleLocation = (url) => {
//     if (url) {
//       window.open(url, "_blank");
//     } else {
//       console.error("Location URL is not provided");
//     }
//   };

//   useEffect(() => {
//     if (event.name) {
//       formatDateTime(
//         event.startDate,
//         event.endDate,
//         event.startTime,
//         event.endTime
//       );
//     }
//   }, [
//     event.startDate,
//     event.endDate,
//     event.startTime,
//     event.endTime,
//     event.name,
//   ]);

//   if (!isOpen) return null;

//   const handleClose = () => {
//     dispatch(closeModal("modalEventCardOpen"));
//     dispatch(clearEventItem());
//   };

//   return (
//     <Dialog.Root open={isOpen}>
//       <Dialog.Portal>
//         <Dialog.Overlay
//           className="fixed inset-0 bg-black bg-opacity-70 z-40"
//           onClick={handleClose}
//         />
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <Dialog.Content
//             className="bg-theme-tertiaryBackground rounded-xl overflow-hidden focus:outline-none
//           shadow-xl transform transition-all w-1/2 md:w-1/3 lg:w-1/4 "
//           >
//             <Dialog.Title></Dialog.Title>
//             <div className="flex flex-col p-5 relative">
//               <img
//                 src={event.cover_image ? event.cover_image : Test}
//                 alt="event-image"
//                 className="rounded-lg max-h-40 w-full object-cover"
//               />
//               <p className="text-theme-sidebarColor font-normal text-sm mt-3">
//                 {date} • {time}
//               </p>
//               <p className="text-theme-secondaryText text-sm font-medium font-inter mt-1">
//                 {event.name}
//               </p>
//               <div
//                 className="flex flex-row items-center mt-2 w-full cursor-pointer "
//                 onClick={() => handleLocation(event.location)}
//               >
//                 <img src={MapPin} alt="map-pin" className="w-3 h-3" />
//                 <div className="ml-1 mt-0.5 text-theme-emptyEvent text-xs font-light font-inter">
//                   {event.locationText}
//                 </div>
//               </div>
//               <div className="ml-0.5 mt-4 text-theme-emptyEvent text-xs font-normal font-inter">
//                 About this event
//               </div>
//               <p className="text-theme-secondaryText text-xs font-normal mt-1">
//                 {event.description}
//               </p>
//               <div className="border-t border-t-theme-chatDivider w-full my-2"></div>
//               {event.joining === "public" ? (
//                 <div className="  text-theme-emptyEvent text-xs font-light font-inter italic">
//                   This is a public event. Which means anyone can join.
//                 </div>
//               ) : (
//                 <div className="  text-theme-emptyEvent text-xs font-light font-inter italic">
//                   This is a private event, so entry requires approval. You'll
//                   receive an email once the admin reviews and approves your
//                   request.
//                 </div>
//               )}
//               {event.joined_users.includes(myData._id) ||
//               event.user === myData._id ? (
//                 <div className="">
//                   <button
//                     className="cursor-pointer text-xs w-full mt-3 bg-theme-secondaryText text-theme-primaryBackground rounded-md font-normal text-center px-2 py-2.5"
//                     onClick={() => setIsDropdownOpen(true)}
//                   >
//                     Add to Calendar
//                   </button>
//                   {isDropdownOpen && (
//                     <div
//                       className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <div
//                         className="border rounded-lg border-theme--chatDivider bg-theme-tertiaryBackground"
//                         ref={dropdownRef}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           console.log("Clicked inside dropdown");
//                         }}
//                       >
//                         <div
//                           className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:bg-theme-primaryBackground hover:rounded-t-lg px-6 py-3"
//                           onClick={handleGoogleCalendar}
//                         >
//                           <p>Google</p>
//                         </div>
//                         <div className="border-t border-theme--t-chatDivider"></div>
//                         <div
//                           className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:bg-theme-primaryBackground px-6 py-3"
//                           onClick={handleDownloadICS}
//                         >
//                           <p>ICS/Apple</p>
//                         </div>
//                         <div className="border-t border-theme--t-chatDivider"></div>
//                         <div
//                           className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:rounded-b-lg hover:bg-theme-primaryBackground px-6 py-3"
//                           onClick={handleOutlookCalendar}
//                         >
//                           <p>Outlook</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : event.requested_users.includes(myData._id) ? (
//                 <div className="cursor-pointer text-sm bg-theme-emptyEvent text-theme-primaryBackground rounded-md font-normal text-center px-3 py-2">
//                   Requested
//                 </div>
//               ) : (
//                 <div
//                   className="cursor-pointer text-sm bg-theme-secondaryText text-theme-primaryBackground rounded-md font-normal text-center px-3 py-2"
//                   onClick={handleJoinEvent}
//                 >
//                   {event.joining === "public" ? "Join event" : "Request access"}
//                 </div>
//               )}
//             </div>
//           </Dialog.Content>
//         </div>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default EventCardModal;
