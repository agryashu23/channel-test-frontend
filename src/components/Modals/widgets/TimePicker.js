import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { parse } from "date-fns";

const MyTimePicker = ({
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
    chipData?.date?.start_time
      ? parseTimeString(chipData.date.start_time)
      : new Date()
  );
  const [endTime, setEndTime] = useState(
    chipData?.date?.end_time
      ? parseTimeString(chipData.date.end_time)
      : new Date()
  );

  const handleStartTime = (date) => {
    setStartTime(date);
    handleStartTimeChange(date);
  };

  const handleEndTime = (date) => {
    setEndTime(date);
    handleEndTimeChange(date);
  };

  const ReadOnlyInput = forwardRef(({ value, onClick }, ref) => (
    <input
      readOnly
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder="Start Time"
      className="w-full py-1 text-sm pr-10 font-light rounded
       bg-transparent border-b border-b-chatDivider placeholder-font-light placeholder-text-sm
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
    <div className="flex flex-row justify-between mt-3 space-x-8 w-full">
      <div className="relative w-full flex flex-col">
        <label className="text-theme-secondaryText font-light text-sm mb-1">
          Start Time
        </label>
        <DatePicker
          selected={startTime}
          onChange={handleStartTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          customInput={<ReadOnlyInput />}
        />
        <FontAwesomeIcon
          icon={faClock}
          className="absolute right-2 mt-2 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
        />
      </div>
      <div className="relative w-full flex flex-col">
        <label className="text-theme-secondaryText font-light text-sm mb-1">
          End Time
        </label>
        <DatePicker
          selected={endTime}
          onChange={handleEndTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          customInput={<ReadOnlyInput />}
        />
        <FontAwesomeIcon
          icon={faClock}
          className="absolute right-2 mt-2 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
        />
      </div>
    </div>
  );
};

export default MyTimePicker;
