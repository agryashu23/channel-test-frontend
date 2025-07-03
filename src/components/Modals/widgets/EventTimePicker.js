import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Time from "../../../assets/icons/Stopwatch.svg";
import TimeLight from "../../../assets/lightIcons/stopwatch_light.svg";

import { parse } from "date-fns";

const EventTimePicker = ({
  chipData,
  handleStartTimeChange,
  handleEndTimeChange,
}) => {
  const parseTimeString = (timeString) => {
    try {
      return parse(timeString, "dd/MM/yyyy, h:mm:ss a", new Date());
    } catch (error) {
      return new Date(); // Return current date if parsing fails
    }
  };
  const [startTime, setStartTime] = useState(
    chipData?.date?.start_time ? parseTimeString(chipData.date.start_time) : null
  );
  const [endTime, setEndTime] = useState(
    chipData?.date?.end_time ? parseTimeString(chipData.date.end_time) : null
  );
  

  const handleStartTime = (date) => {
    setStartTime(date);
    handleStartTimeChange(date);
  };

  const handleEndTime = (date) => {
    setEndTime(date);
    handleEndTimeChange(date);
  };

  const ReadOnlyInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <input
      readOnly
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder={placeholder}
      className="w-full py-1 text-sm pr-10 font-light rounded
       bg-transparent border-b border-theme-chatDivider placeholder-font-light placeholder-text-sm
        text-theme-secondaryText focus:outline-none placeholder:text-emptyEvent"
    />
  ));
  // const ReadOnlyInput2 = forwardRef(({ value, onClick }, ref) => (
  //   <input
  //     readOnly
  //     value={value}
  //     onClick={onClick}
  //     ref={ref}
  //     placeholder="End Time"
  //     className="w-full py-1 text-sm pr-10 font-light rounded bg-chipBackground border-b border-b-dividerLine placeholder-font-light placeholder-text-sm text-primaryGrey focus:outline-none placeholder-text-primaryGrey"
  //   />
  // ));

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="relative  w-[45%]">
        <DatePicker
          selected={startTime}
          onChange={(date) => {
            setStartTime(date);
            handleStartTimeChange(date); 
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText="Start Time"
          customInput={<ReadOnlyInput />}
        />
        <img
          src={Time}
          alt="Time"
          className="dark:block hidden absolute right-0 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
        />
        <img
          src={TimeLight}
          alt="Time"
          className="dark:hidden absolute right-0 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
        />
        {startTime && (
          <button
            onClick={() => {
              setStartTime(null);
              handleStartTimeChange(null);
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xs text-gray-400"
          >
            ×
          </button>
        )}
      </div>
      <div className="relative  w-[45%]">
        <DatePicker
          selected={endTime}
          onChange={(date) => {
            setEndTime(date);
            handleEndTimeChange(date); 
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText="End Time"
          customInput={<ReadOnlyInput />}
        />
        <img
          src={Time}
          alt="Time"
          className="dark:block hidden absolute right-0 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
        />
        <img
          src={TimeLight}
          alt="Time"
          className="dark:hidden absolute right-0 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
        />
        {endTime && (
          <button
            onClick={() => {
              setEndTime(null);
              handleEndTimeChange(null);
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xs text-gray-400"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default EventTimePicker;
