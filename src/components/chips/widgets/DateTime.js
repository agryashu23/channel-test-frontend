import { React, useEffect, useState } from "react";
import { format, parseISO, parse, isValid } from "date-fns";

const DateTimeCard = ({ item }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const formatDateTime = (dateString, startTime, endTime) => {
    try {
      const parsedDate = parseISO(dateString);
      if (!isValid(parsedDate)) throw new Error("Invalid date");

      const formattedDate = format(parsedDate, "dd MMM");

      let formattedStartTime = "";
      let formattedEndTime = "";

      if (startTime) {
        const parsedStartTime = parse(
          startTime,
          "d/M/yyyy, h:mm:ss a",
          new Date()
        );
        if (!isValid(parsedStartTime)) throw new Error("Invalid start time");
        formattedStartTime = format(parsedStartTime, "hh:mm a");
      }

      if (endTime) {
        const parsedEndTime = parse(endTime, "d/M/yyyy, h:mm:ss a", new Date());
        if (!isValid(parsedEndTime)) throw new Error("Invalid end time");
        formattedEndTime = format(parsedEndTime, "hh:mm a");
      }

      const timings = `${formattedStartTime}${
        formattedEndTime ? ` - ${formattedEndTime}` : ""
      }`;
      setDate(formattedDate);
      setTime(timings);
    } catch (error) {
      console.error("Error formatting date/time:", error.message);
    }
  };

  useEffect(() => {
    if (item.date) {
      formatDateTime(item.date, item.start_time, item.end_time);
    }
  }, [item.date, item.start_time, item.end_time]);

  return (
    <div className="w-[95%] bg-theme-secondaryBackground bg-opacity-20 rounded-tr-xl rounded-br-xl overflow-hidden mr-4 pr-1 flex items-center">
      <div className="relative flex items-start space-x-4 py-0.5">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-lg bg-theme-sidebarColor"></div>
        <div
          className={`flex flex-col pt-1 pb-1 ml-4 mr-2 ${
            item.end_time ? "w-2/5" : "w-1/3"
          }`}
        >
          <div className="text-theme-secondaryText font-inter font-medium text-sm">
            {date}
          </div>
          <div className="text-theme-secondaryText text-[10px] font-inter mt-1 font-light">
            {time}
          </div>
        </div>
        <div className="mt-1 ml-4">
          <div className="text-theme-secondaryText text-sm font-inter font-normal">
            {item.event}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeCard;
