import React, { useState, useEffect, useRef } from "react";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";
import Emotion from "../../../assets/icons/emotion.svg";
import ArrowLeft from "../../../assets/icons/navigate_before.svg";
import ArrowRight from "../../../assets/icons/navigate_next.svg";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "./../widgets/EventCard";
import { setEventField } from "../../../redux/slices/eventSlice";
import AddIcon from "../../../assets/icons/addIcon.svg";
import AddIconLight from "../../../assets/lightIcons/add_light.svg";
import useModal from "./../../hooks/ModalHook";
import { useParams } from "react-router-dom";
import { fetchTopicEvents } from "../../../redux/slices/eventItemsSlice";

const EventsPage = ({fetchedOnceEvents, setFetchedOnceEvents}) => {
  const today = new Date();
  const [selectedTab, setSelectedTab] = useState("Calendar");
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const { username, topicId } = useParams();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const EventItems = useSelector((state) => state.eventItems);
  const myData = useSelector((state) => state.myData);
  const Events = EventItems.events;
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownContainerRef = useRef(null);
  const months = Array.from({ length: 12 }, (v, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );
  const { handleOpenModal } = useModal();
  const years = Array.from(
    new Array(6),
    (val, index) => index + today.getFullYear() 
  );

  useEffect(() => {
    if(fetchedOnceEvents===false){
      dispatch(fetchTopicEvents(topicId));
      setFetchedOnceEvents(true);
    }
  }, [topicId,fetchedOnceEvents]);

  const getDaysArray = (year, month) => {
    const date = new Date(year, month, 1);
    const result = [];
    const firstDayOffset = (date.getDay() + 6) % 7;
    for (let i = 0; i < firstDayOffset; i++) {
      result.push(null);
    }
    while (date.getMonth() === month) {
      result.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return result;
  };
  
  const days = getDaysArray(currentDate.getFullYear(), currentDate.getMonth());

  const handleMonthChange = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(month)));
    setMonthDropdownOpen(false);
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(parseInt(year, 10), currentDate.getMonth()));
    setYearDropdownOpen(false);
  };

  const handlePrevMonth = () => {
    if (
      currentDate.getFullYear() === today.getFullYear() - 1 &&
      currentDate.getMonth() === 0
    ) {
      return;
    }
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    if (
      currentDate.getFullYear() === today.getFullYear() + 5 &&
      currentDate.getMonth() === 11
    ) {
      return;
    }
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(newDate);
  };

  const handlePrevYear = () => {
    if (currentDate.getFullYear() - 1 > today.getFullYear() - 1) {
      const newDate = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth()
      );
      setCurrentDate(newDate);
    }
  };

  const handleNextYear = () => {
    if (currentDate.getFullYear() + 1 <= today.getFullYear() + 5) {
      const newDate = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth()
      );
      setCurrentDate(newDate);
    }
  };

  const handleToggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target)
      ) {
        setOpenDropdownId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const upcomingEvents = Events.filter(
    (event) =>
      new Date(event.startDate) >= new Date(today.toDateString())
  );

  const eventsForSelectedDate = Events.filter(
    (event) =>
      
      new Date(event.startDate).toDateString() ===
        selectedDate.toDateString()
  );

  const handleCreateEvent = () => {
    dispatch(setEventField({ field: "topic", value: topicId }));
    handleOpenModal("modalEventOpen");
  };
  const handleMonthDropdown = () => {
    setYearDropdownOpen(false);
    setMonthDropdownOpen(!monthDropdownOpen);
  };
  const handleYearDropdown = () => {
    setMonthDropdownOpen(false);

    setYearDropdownOpen(!yearDropdownOpen);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-start space-x-4">
        {username===myData.username && <div
          className={`text-xs border font-light border-theme-sidebarDivider px-1.5 py-1 rounded-full cursor-pointer 
            text-theme-secondaryText flex flex-row items-center
          `}
          onClick={handleCreateEvent}
        >
          <img
            src={AddIcon}
            alt="add-icon"
            className="dark:block hidden w-4 h-4 mr-0.5"
          />
          <img
            src={AddIconLight}
            alt="add-icon"
            className="dark:hidden w-4 h-4 mr-0.5"
          />
          Create
        </div>}
        <div
          className={`rounded-full text-xs border font-light border-theme-sidebarDivider px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "Calendar"
              ? "bg-theme-secondaryText text-theme-primaryBackground"
              : "text-theme-secondaryText"
          }`}
          onClick={() => setSelectedTab("Calendar")}
        >
          Calendar
        </div>
        <div
          className={`rounded-full text-xs border font-light border-theme-sidebarDivider px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "All upcoming events"
              ? "bg-theme-secondaryText text-theme-primaryBackground"
              : "text-theme-secondaryText"
          }`}
          onClick={() => setSelectedTab("All upcoming events")}
        >
          All upcoming events
        </div>
      </div>

      {selectedTab === "Calendar" && (
        <>
          <div className="flex flex-row justify-between items-center my-4">
            <div className="relative">
              <div className="flex flex-row">
                <img
                  src={ArrowLeft}
                  alt="arrow-left"
                  className="mr-2"
                  onClick={handlePrevMonth}
                />
                <div
                  className="bg-transparent text-theme-calendarMarkings cursor-pointer text-sm font-light"
                  onClick={handleMonthDropdown}
                >
                  {months[currentDate.getMonth()]}{" "}
                  <img src={ArrowDown} className="inline w-4" alt="dropdown" />
                </div>
                <img
                  src={ArrowRight}
                  alt="arrow-right"
                  className=""
                  onClick={handleNextMonth}
                />
              </div>

              {monthDropdownOpen && (
                <div className="absolute z-10 max-h-90 overflow-y-auto custom-scrollbar bg-theme-tertiaryBackground border border-theme-chatBackground rounded-lg shadow-lg">
                  {months.map((month, index) => (
                    <div
                      className="p-2 text-left text-sm text-theme-secondaryText hover:bg-chatBackground"
                      key={`${month}-${index}`}
                      onClick={() => handleMonthChange(month)}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <div className="flex flex-row">
                <img
                  src={ArrowLeft}
                  alt="arrow-left"
                  className="mr-2"
                  onClick={handlePrevYear}
                />
                <div
                  className="bg-transparent  text-theme-calendarMarkings text-sm font-light cursor-pointer"
                  onClick={handleYearDropdown}
                >
                  {currentDate.getFullYear()}{" "}
                  <img src={ArrowDown} className="inline w-4" alt="dropdown" />
                </div>
                <img
                  src={ArrowRight}
                  alt="arrow-right"
                  className="mr-2"
                  onClick={handleNextYear}
                />
              </div>

              {yearDropdownOpen && (
                <div className="absolute z-10 max-h-90 overflow-y-auto custom-scrollbar left-6 
                bg-theme-tertiaryBackground border border-theme-chatBackground rounded-lg shadow-lg">
                  {years.map((year, index) => (
                    <div
                    key={`${year}-${index}`}
                      className="p-2 text-left text-sm text-theme-secondaryText hover:bg-chatBackground"
                      onClick={() => handleYearChange(year.toString())}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-7 ml-2 space-x-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div className="text-theme-primaryText  font-light text-[10px]" key={`${day}-${index}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-3  ">
          {days.map((day, index) => (
              <div
                key={`${index}`}
                className={`text-center rounded-full h-6 w-6 text-sm font-light cursor-pointer ${
                  day &&
                  selectedDate.toDateString() === day.toDateString()
                    ? "bg-theme-secondaryText text-theme-primaryBackground p-0.5"
                    : "text-theme-primaryText"
                }`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day ? (day.getDate() <= 9 ? "0" + day.getDate() : day.getDate()) : ""}
              </div>
            ))}
          </div>

          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event, index) => (
              <div key={`${index}-${event._id}`} className="w-full my-3 ">
                <EventCard
                  width="w-full"
                  imageHeight="h-32"
                  event={event}
                  color="bg-theme-[#353535]"
                  openDropdownId={openDropdownId}
                  handleToggleDropdown={handleToggleDropdown}
                  btnFlex="flex-col"
                  btnPadding="px-1"
                  spacing="space-x-2"
                  topSpacing="mt-0"
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col w-full items-center mt-8">
              <img src={Emotion} alt="empty-event" className="w-16" />
              <p className="text-theme-emptyEvent text-xs mt-2">
                No events yet..
              </p>
            </div>
          )}
        </>
      )}

      {selectedTab === "All upcoming events" && (
        <div className="mt-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div key={`${event._id}-${index}`} className="w-full my-3">
                <EventCard
                  width="w-full"
                  imageHeight="h-32"
                  event={event}
                  color="bg-theme-[#353535]"
                  openDropdownId={openDropdownId}
                  handleToggleDropdown={handleToggleDropdown}
                  btnPadding="px-1"
                  btnFlex="flex-col"
                  spacing="space-x-2"
                  topSpacing="mt-3"
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col w-full items-center mt-8">
              <img src={Emotion} alt="empty-event" className="w-16" />
              <p className="text-theme-emptyEvent text-xs mt-2">
                No upcoming events..
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
