import React, { useState, useEffect, useRef } from "react";
import Test from "../../../assets/images/test.png";

import { format, parseISO, parse, isValid } from "date-fns";

import { ReactComponent as LocationIcon } from "../../../assets/icons/location.svg";

import useModal from "./../../hooks/ModalHook";
import { useDispatch, useSelector } from "react-redux";
import { setModalModal } from "../../../redux/slices/modalSlice";
import { ChannelImages } from "../../constants/images";
import {
  setEventItems,
  setEventField,
} from "../../../redux/slices/eventSlice";
import { joinEvent } from "../../../redux/slices/eventItemsSlice";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper";
import { usePaymentHandler } from "../../../utils/paymentPage";

const EventCard = ({
  width,
  imageHeight,
  event,
  color,
  openDropdownId,
  handleToggleDropdown,
  btnPadding,
  btnFlex,
  spacing,
  topSpacing = "mt-2",
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const { handleOpenModal } = useModal();
  const myData = useSelector((state) => state.myData);
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const eventMembers = useSelector((state) => state.eventItems.topicEventMembers);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fullPath = location.pathname;
  const errorValue = useSelector((state) => state.eventItems.joinEventError);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { handlePayment } = usePaymentHandler();


  const handleEventModal = () => {
    navigate(`/event/${event._id}`);
  };
  const handleDeleteEventModal = () => {
    toggleDropdown();
    dispatch(setModalModal({ field: "eventId", value: event._id }));
    handleOpenModal("modalEventDeleteOpen");
  };
  const handleEditEventModal = () => {
    toggleDropdown();
    dispatch(setEventItems(event));
    dispatch(setEventField({ field: "type", value: "edit" }));
    handleOpenModal("modalEventOpen");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleJoinEvent = () => {
    setMessage("");
    if (isLoggedIn) {
      dispatch(joinEvent(event._id))
        .unwrap()
        .then((response) => {
          if(response.success && response.paywall &&  response.paywallPrice>0){
            const data = {
              amount:response.paywallPrice,
              currency:"INR",
              event:response.event._id,
              name:response.event.name,
              type:"event",
            }
            handlePayment(data,"event");
            return;
          }
        })
        .catch((error) => {
          setMessage(error?.message || errorValue);
        });
    } else {
      navigate(`${getAppPrefix()}/get-started?redirect=${fullPath}`);
    }
  };

  const formatDateTime = (startDate, endDate, startTime, endTime) => {
    try {
      const parsedStartDate = parseISO(startDate);
      const parsedEndDate = endDate ? parseISO(endDate) : null;

      if (!isValid(parsedStartDate)) throw new Error("Invalid start date");
      if (endDate && !isValid(parsedEndDate))
        throw new Error("Invalid end date");

      const startDateFormatted = format(parsedStartDate, "yyyy-MM-dd");
      const endDateFormatted = parsedEndDate
        ? format(parsedEndDate, "yyyy-MM-dd")
        : null;

      const parsedStartTime = startTime
        ? parse(startTime, "dd/M/yyyy, hh:mm:ss a", new Date())
        : null;
      const parsedEndTime = endTime
        ? parse(endTime, "dd/M/yyyy, hh:mm:ss a", new Date())
        : null;

      const startTimeFormatted =
        parsedStartTime && isValid(parsedStartTime)
          ? format(parsedStartTime, "HH:mm:ss")
          : "";
      const endTimeFormatted =
        parsedEndTime && isValid(parsedEndTime)
          ? format(parsedEndTime, "HH:mm:ss")
          : "";

      setFormattedStartDate(startDateFormatted);
      setFormattedEndDate(endDateFormatted || startDateFormatted);
      setFormattedStartTime(startTimeFormatted);
      setFormattedEndTime(endTimeFormatted);
      const displayStartDate = format(parsedStartDate, "dd MMM");
      const displayEndDate = parsedEndDate
        ? format(parsedEndDate, "dd MMM")
        : null;

      const displayStartTime =
        parsedStartTime && isValid(parsedStartTime)
          ? format(parsedStartTime, "hh:mm a")
          : "";
      const displayEndTime =
        parsedEndTime && isValid(parsedEndTime)
          ? format(parsedEndTime, "hh:mm a")
          : "";

      setDate(
        `${displayStartDate}${displayEndDate ? `-${displayEndDate}` : ""}`
      );
      setTime(
        `${displayStartTime}${displayEndTime ? `-${displayEndTime}` : ""}`
      );
    } catch (error) {
      console.error("Error formatting date/time:", error.message);
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLocation = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("Location URL is not provided");
    }
  };

  useEffect(() => {
    if (event?.startDate) {
      formatDateTime(
        event.startDate,
        event.endDate,
        event.startTime,
        event.endTime
      );
    }
  }, [event?.startDate, event?.endDate, event?.startTime, event?.endTime]);

  const handleGoogleCalendar = (e) => {
    e.stopPropagation();
    try {
      const startUTC = new Date(
        `${formattedStartDate}T${formattedStartTime}`
      ).toISOString();
      const endUTC = new Date(
        `${formattedEndDate}T${formattedEndTime}`
      ).toISOString();

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.name
      )}&dates=${startUTC.replace(/[-:]/g, "").slice(0, -5)}Z/${endUTC
        .replace(/[-:]/g, "")
        .slice(0, -5)}Z&details=${encodeURIComponent(
        event.description || ""
      )}&location=${encodeURIComponent(event.location || "Online")}&ctz=${
        event.timezone
      }`;

      window.open(googleCalendarUrl, "_blank");
    } catch (error) {
      console.error("Error generating Google Calendar link:", error.message);
    }
  };

  const handleOutlookCalendar = (e) => {
    e.stopPropagation();
    try {
      const startUTC = new Date(
        `${formattedStartDate}T${formattedStartTime}`
      ).toISOString();
      const endUTC = new Date(
        `${formattedEndDate}T${formattedEndTime}`
      ).toISOString();

      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&subject=${encodeURIComponent(
        event.name
      )}&startdt=${startUTC}&enddt=${endUTC}&body=${encodeURIComponent(
        event.description || ""
      )}&location=${encodeURIComponent(event.location || "Online")}&timezone=${
        event.timezone || "UTC"
      }`;

      window.open(outlookUrl, "_blank");
    } catch (error) {
      console.error("Error generating Outlook Calendar link:", error.message);
    }
  };

  const handleDownloadICS = (e) => {
    e.stopPropagation();
    try {
      const startUTC =
        new Date(`${formattedStartDate}T${formattedStartTime}`)
          .toISOString()
          .replace(/[-:]/g, "")
          .slice(0, -5) + "Z";
      const endUTC =
        new Date(`${formattedEndDate}T${formattedEndTime}`)
          .toISOString()
          .replace(/[-:]/g, "")
          .slice(0, -5) + "Z";

      const icsContent = `
          BEGIN:VCALENDAR
          VERSION:2.0
          CALSCALE:GREGORIAN
          BEGIN:VEVENT
          SUMMARY:${event.name}
          DESCRIPTION:${event.description || ""}
          LOCATION:${event.location || "Online"}
          DTSTART:${startUTC}
          DTEND:${endUTC}
          END:VEVENT
          END:VCALENDAR
              `.trim();

      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${event.name || "Event"}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating ICS file:", error.message);
    }
  };

  const closeDropdown = () => {
    if (openDropdownId) {
      handleToggleDropdown(null);
    }
  };

  const eventButtonState=()=>{
    if(!isLoggedIn || !myUserId){
      return "Join event";
    }
    else if(event?.user?.toString()===myUserId.toString()){
      return "Add to calendar";
    }
    else if(eventMembers?.find(member=>member?.user?.toString()===myUserId?.toString() && member?.event?.toString()===event._id.toString() && member?.addedToCalendar===true)){
      return "Event joined";
    }
    else if(eventMembers?.find(member=>member?.user?.toString()===myUserId?.toString() && member?.event?.toString()===event._id.toString() && member?.status==="joined")){
      return "Add to calendar";
    }else if(eventMembers?.find(request=>request?.user?.toString()===myUserId?.toString() && request?.event?.toString()===event._id.toString() && request?.status==="request")){
      return "Requested";
    }else{
      return "Join event";
    }
  }

  const isEventPart =
  event?.user?.toString() === myUserId.toString() ||
  !!eventMembers?.find(member =>
    member?.user?.toString() === myUserId?.toString() &&
    member?.event?.toString() === event._id.toString() &&
    member?.status === "joined"
  );


  const buttonState = eventButtonState();

  return (
    <div
      className={`${color} border  border-theme-chatDivider rounded-lg p-3 md:${width} w-full flex xs:flex-row flex-col mb-2`}
      onClick={closeDropdown}
    >
      <div className="flex flex-row items-start justify-between">
        <div className={` xs:w-28 w-full relative`}>
          <img
            src={event?.cover_image ? event.cover_image : Test}
            alt="event-image"
            className={`rounded-lg object-cover flex-shrink-0 ${imageHeight}`}
          />
        </div>
        
      </div>
      <div className="xs:ml-3 flex flex-col justify-between items-start ">
        <div className="text-left">
          <p className="text-theme-sidebarColor font-normal xs:mt-0 mt-2 text-xs w-full">
            {date} {time ? "• " + time : ""}
          </p>
          <p className="text-theme-secondaryText text-sm font-normal font-inter mt-1 max-w-72">
            {event?.name}
          </p>
          {event?.locationText && event?.type==="offline" && (buttonState === "Add to calendar" || buttonState === "Event joined") && (
            <div
              className="flex flex-row items-start mt-1 w-full cursor-pointer max-w-64"
              onClick={() => handleLocation(event?.location)}
            >
              <LocationIcon
                className={`w-7 h-7 mt-[1px] fill-current text-theme-emptyEvent
                        `}
              />
              <div className="ml-0.5  text-theme-emptyEvent text-xs font-light font-inter">
                {event.locationText}
              </div>
            </div>
          )}
          {event?.meet_url && event?.type==="online" && (buttonState === "Add to calendar" || buttonState === "Event joined") && (
            <div className="flex flex-row items-start mt-1 w-full cursor-pointer max-w-64">
              <div className="ml-0.5  text-theme-emptyEvent text-xs font-light font-inter">
                {event.meet_url}
              </div>
            </div>
          )}
        </div>
        <div>
        {!isEventPart &&  <div className="flex flex-row items-center mt-0.5">
              <img className="mr-1 w-3 h-3 mt-0.5 dark:block hidden" loading="lazy" src={event.joining==="paid"?ChannelImages.Secure.default:event.joining==="public"?
                ChannelImages.LockOpen.default:ChannelImages.Lock.default} alt="lock"  />
                <img className="mr-1 w-3 h-3 mt-0.5 dark:hidden block" loading="lazy" src={event.joining==="paid"?ChannelImages.SecureLight.default:event.joining==="public"?
                ChannelImages.LockOpenLight.default:ChannelImages.LockLight.default} alt="lock-light"  />
              <p className="mt-1 text-xs font-light text-theme-emptyEvent">
                {event.joining==="paid"
                  ? `This event requires a ₹${event.paywallPrice} fee to join.`
                  : event.joining === "public"
                  ? "Public event — anyone can join."
                  : "Invite-only — admin approval required."}
              </p>
            </div>}
        <div
          className={`flex ${
            btnFlex
              ? `${btnFlex} space-y-2 justify-start items-start`
              : `flex flex-row ${spacing} items-center`
          }  xs:${topSpacing} mt-2  `}
        >
                <div className="relative inline-block">
                {buttonState==="Add to calendar" && <button
                  className={`placeholder:cursor-pointer ${spacing==="" ? "mr-3" : ""} text-xs bg-theme-secondaryText text-theme-primaryBackground rounded-md 
                    font-normal text-center py-2.5 xs:px-3 px-1.5`}
                  onClick={() => handleToggleDropdown(event._id)}
                >
                  {buttonState}
                </button>}
                {openDropdownId === event?._id && (
                  <div
                    className="absolute left-0 mt-1 z-10 border rounded-lg border-theme-chatDivider bg-theme-tertiaryBackground w-max"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:bg-theme-primaryBackground hover:rounded-t-lg px-6 py-3"
                      onClick={handleGoogleCalendar}
                    >
                      <p>Google</p>
                    </div>
                    <div className="border-t border-t-theme-chatDivider"></div>
                    <div
                      className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:bg-theme-primaryBackground px-6 py-3"
                      onClick={handleDownloadICS}
                    >
                      <p>ICS/Apple</p>
                    </div>
                    <div className="border-t border-t-theme-chatDivider"></div>
                    <div
                      className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:rounded-b-lg hover:bg-theme-primaryBackground px-6 py-3"
                      onClick={handleOutlookCalendar}
                    >
                      <p>Outlook</p>
                    </div>
                  </div>
                )}
              </div>

                {buttonState === "Requested" && (
                  <div
                    className={`cursor-pointer ${spacing==="" ? "mr-3" : ""} text-sm bg-theme-emptyEvent text-theme-primaryBackground rounded-md font-normal text-center ${
                      btnFlex ? "px-4" : btnPadding
                    } py-2`}
                  >
                    Requested
                  </div>
                )}

                {buttonState === "Event joined" && (
                  <div
                    className={`cursor-default text-sm ${spacing==="" ? "mr-3" : ""} bg-theme-emptyEvent text-theme-primaryBackground rounded-md font-normal text-center ${
                      btnFlex ? "px-4" : "xs:px-3 px-1.5"
                    } py-2`}
                  >
                    Event joined
                  </div>
                )}

                {(buttonState === "Join event" || buttonState === "Request access") && (
                  <div
                    className={`cursor-pointer text-sm ${spacing==="" ? "mr-3" : ""} bg-theme-secondaryText text-theme-primaryBackground 
                    rounded-md font-normal text-center xs:px-3 px-1.5 py-2`}
                    onClick={handleJoinEvent}
                  >
                    {buttonState}
                  </div>
                )}
          <div
            className={`cursor-pointer text-xs border  border-theme-secondaryText text-theme-secondaryText 
            rounded-md font-normal text-center ${
              btnFlex ? "px-4" : "xs:px-3 px-1.5"
            }  py-2`}
            onClick={handleEventModal}
          >
            View details
          </div>
        </div>
        </div>
        {message && <div className="text-xs text-theme-emptyEvent font-light pt-2">{message}</div>}
      </div>
    </div>
  );
};

export default EventCard;
