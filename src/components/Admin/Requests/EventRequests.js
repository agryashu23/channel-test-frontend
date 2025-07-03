import React, { useEffect,useState,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { acceptEventRequest, declineEventRequest, fetchEventRequests } from '../../../redux/slices/businessSlice';
import {ChannelImages} from '../../constants/images';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, parse, isValid } from "date-fns";
import Test from "../../../assets/images/test.png";
import { ReactComponent as LocationIcon } from "../../../assets/icons/location.svg";
import { useLocation } from "react-router-dom";

const EventRequests = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const business = useSelector((state) => state.business);
const [selectedEventId, setSelectedEventId] = useState(null);
const [sortOption, setSortOption] = useState("date");
const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
const sortDropdownRef = useRef(null);
const [searchQuery, setSearchQuery] = useState("");



  useEffect(() => {
    dispatch(fetchEventRequests());
  }, []);

  const formatDateTime = (startDate, endDate, startTime, endTime) => {
    try {
      const parsedStartDate = parseISO(startDate);
      const parsedEndDate = endDate ? parseISO(endDate) : null;

      if (!isValid(parsedStartDate)) throw new Error("Invalid start date");
      if (endDate && !isValid(parsedEndDate))
        throw new Error("Invalid end date");

      const parsedStartTime = startTime
        ? parse(startTime, "dd/M/yyyy, hh:mm:ss a", new Date())
        : null;
      const parsedEndTime = endTime
        ? parse(endTime, "dd/M/yyyy, hh:mm:ss a", new Date())
        : null;

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
      const date =`${displayStartDate}${displayEndDate ? `-${displayEndDate}` : ""}`;
      const time =`${displayStartTime}${displayEndTime ? `-${displayEndTime}` : ""}`;
      return {date,time};
    } catch (error) {
      console.error("Error formatting date/time:", error.message);
    }
  };

  const handleAcceptEventRequest = (eventId, userId,email) => {
    const formDataToSend = new FormData();
    formDataToSend.append("eventId", eventId);
    formDataToSend.append("userId", userId);
    formDataToSend.append("email", email);
    dispatch(acceptEventRequest(formDataToSend));
  };

  const handleDeclineEventRequest = (eventId, userId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("eventId",eventId);
    formDataToSend.append("userId", userId);
    dispatch(declineEventRequest(formDataToSend));
  };

  const handleLocation = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("Location URL is not provided");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) setSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  



    const filteredRequests = selectedEventId
    ? business.eventRequests.filter((req) => req.event === selectedEventId)
    : business.eventRequests;

    const requestCountByEvent = business.eventRequests.reduce((acc, req) => {
      acc[req.event] = (acc[req.event] || 0) + 1;
      return acc;
    }, {});
    
    const today = new Date();
    let sortedEvents = [...business.events];
    
    if (searchQuery.trim()) {
      sortedEvents = sortedEvents.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const isUpcoming = (startDate) => {
      const start = new Date(startDate);
      return (
        start.toDateString() === today.toDateString() || // same day
        start > today // future
      );
    };
    if (sortOption === "date") {
      sortedEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortOption === "upcoming") {
      if (sortOption === "upcoming") {
        sortedEvents = sortedEvents
          .filter((e) => isUpcoming(e.startDate))
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)); // earliest first
      }
    } else if (sortOption === "most_requests") {
      sortedEvents.sort(
        (a, b) => (requestCountByEvent[b._id] || 0) - (requestCountByEvent[a._id] || 0)
      );
    }
    

  return (
    <div className="flex flex-col md:pl-8 pl-4  md:pr-8 pr-4 pt-6 h-full overflow-y-auto">
       <p className="text-theme-emptyEvent text-lg font-normal">
        Requests
      </p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Events
      </p>
      <div className="border-t border-t-theme-chatDivider my-4 "></div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
  {/* All Events Chip */}
  <div
    className={`px-4 py-1 rounded-lg font-light text-sm cursor-pointer  ${
      selectedEventId !== null
        ? "bg-theme-secondaryText text-theme-primaryBackground"
        : "bg-theme-chatDivider text-theme-secondaryText"
    }`}
    onClick={() => setSelectedEventId(null)}
  >
    All Requests
  </div>

  {/* Sort Dropdown */}
  <div className="relative" ref={sortDropdownRef}>
    <div className="text-sm flex items-center text-theme-secondaryText">
      Sort by:
      <div
        className="border ml-2 border-theme-chatDivider rounded-md py-2 sm:px-3 px-2 text-sm 
        bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center text-theme-primaryText w-40"
        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
      >
        <span>
          {sortOption === "date"
            ? "Date (Newest)"
            : sortOption === "upcoming"
            ? "Upcoming"
            : "Most Requests"}
        </span>
        <img
          src={
            sortDropdownOpen
              ? ChannelImages.ArrowUp.default
              : ChannelImages.ArrowDown.default
          }
          alt="dropdown"
          className="w-4 h-4 ml-2"
        />
      </div>
    </div>
    {sortDropdownOpen && (
      <div className="absolute right-0 mt-1 bg-theme-tertiaryBackground border border-theme-chatDivider rounded-md shadow-md w-40 z-10">
        {[
          { label: "Date (Newest)", value: "date" },
          { label: "Upcoming", value: "upcoming" },
          { label: "Most Requests", value: "most_requests" },
        ].map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              setSortOption(opt.value);
              setSortDropdownOpen(false);
            }}
            className={`px-4 py-2 text-sm cursor-pointer text-theme-secondaryText hover:bg-theme-primaryBackground ${
              sortOption === opt.value ? "font-semibold" : ""
            }`}
          >
            {opt.label}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
<div className="mb-4 w-full">
  <input
    type="text"
    placeholder="Search event by name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full md:w-80 border border-theme-chatDivider focus:outline-none rounded-md py-2 px-3 text-sm bg-theme-tertiaryBackground text-theme-primaryText"
  />
</div>

      {sortedEvents.length > 0 ? <div className="flex flex-row w-full overflow-x-auto custom-horizontal-scrollbar pb-1 space-x-4">
      {sortedEvents.map((event) => {
        const {date,time} = formatDateTime(event.startDate,event.endDate,event.startTime,event.endTime);
        return(
         <div
         key={event._id}
         className={` border ${selectedEventId === event._id?"border-theme-primaryText":"border-theme-chatDivider"} rounded-lg p-3  w-full flex flex-row max-w-76`}
       >
             <img
               src={event?.cover_image ? event.cover_image : Test}
               alt="event-image"
               className={`rounded-lg w-14 h-14 object-cover flex-shrink-0`}
             />
         <div className="ml-3 flex flex-col justify-between items-start w-max">
           <div className="text-left">
             <p className="text-theme-sidebarColor font-normal mt-0 text-xs w-full">
               {date} {time ? "• " + time : ""}
             </p>
             <p className="text-theme-secondaryText text-sm font-normal font-inter mt-1 max-w-72">
               {event?.name}
             </p>
             {event?.locationText && event?.type==="offline"  && (
               <div
                 className="flex flex-row items-start mt-1 w-full cursor-pointer max-w-64"
                 onClick={() => handleLocation(event?.location)}
               >
                 <LocationIcon
                   className={`w-7 h-7 mt-[1px] fill-current text-theme-emptyEvent
                           `}
                 />
                 <div className="ml-0.5  text-theme-emptyEvent text-xs font-light font-inter line-clamp-2">
                   {event.locationText}
                 </div>
               </div>
             )}
             {event?.meet_url && event?.type==="online" && (
               <div className="flex flex-row items-start mt-1 w-full cursor-pointer max-w-64">
                 <div className="ml-0.5  text-theme-emptyEvent text-xs font-light font-inter line-clamp-2">
                   {event.meet_url}
                 </div>
               </div>
             )}
           </div>
           <div>
             <div
               className={`cursor-pointer text-sm ${selectedEventId === event._id?"bg-theme-emptyEvent text-theme-primaryBackground":"text-theme-primaryBackground bg-theme-secondaryText"}  
               rounded-md font-normal text-center px-3 mt-2 py-2`}
               onClick={() => setSelectedEventId(event._id)}
             >
               View ({requestCountByEvent[event._id] || 0}) requests
             </div>
           </div>
         </div>
       </div>
      )})}
      </div>:<div className="text-theme-secondaryText font-normal text-md text-center mx-auto my-6 ">
              No events found.
            </div>}
      {filteredRequests?.length > 0 ? (
            <div className="rounded-lg border border-theme-chatDivider sm:p-4 p-2 flex flex-col mt-4">
              {filteredRequests.map((request) => (
                <div key={request._id} className="flex flex-row my-2 items-center">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row items-center">
                      {request.user?.logo ? (
                        <img
                          src={request.user?.logo}
                          alt="profile-icon"
                          className="rounded-md w-12 h-12 object-cover"
                        />
                      ) : request.user?.color_logo ? (
                        <div
                          className="rounded-md w-12 h-12 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: request?.user?.color_logo }}
                        >
                          <img
                            src={ChannelImages.ColorProfile.default}
                            alt="color-profile"
                            className="w-8 h-8"
                          />
                        </div>
                      ) : (
                        <img
                          src={ChannelImages.Profile.default}
                          alt="profile-icon"
                          className="rounded-md w-12 h-12 object-cover"
                        />
                      )}
                        <p className="text-theme-secondaryText ml-3 font-normal sm:text-md text-sm truncate w-full cursor-pointer" 
                        onClick={()=>navigate(`/account/${request.user?.username}/profile`)}>
                          {request.user?.username}
                        </p>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <div
                        className="bg-theme-buttonEnable rounded-lg cursor-pointer
                       text-theme-secondaryText text-center md:px-6 px-2 py-2 text-sm"
                        onClick={() =>
                          handleAcceptEventRequest(
                            request.event,
                            request.user?._id,
                            request.user?.email
                          )
                        }
                      >
                        Accept
                      </div>
                      <div
                        className="border-theme-secondaryText border rounded-lg cursor-pointer
                       text-theme-secondaryText text-center md:px-6 px-2 py-2 text-sm"
                        onClick={() =>
                          handleDeclineEventRequest(
                            request.event,
                            request.user?._id
                          )
                        }
                      >
                        Decline
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-theme-secondaryText font-normal text-md text-center mx-auto mt-12 ">
              No requests found.
            </div>
          )}
    </div>
  )
}

export default EventRequests