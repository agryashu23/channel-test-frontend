import React, { useState, useEffect } from "react";
import ArrowUp from "../../../assets/icons/up-arrow.svg";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";
import { postRequestAuthenticated } from "./../../../services/rest";

const SummaryPage = ({ topic }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [topicSummary, setTopicSummary] = useState([]);
  const [dates, setDates] = useState([]);

  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const matchedSummary = topicSummary.find((s) => s.date === selectedDateStr);

  const generateMonthYearOptions = () => {
    const options = [];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    options.push({ month: currentMonth, year: currentYear });
    if (currentMonth === 0) {
      options.push({ month: 11, year: currentYear - 1 });
    } else {
      options.push({ month: currentMonth - 1, year: currentYear });
    }

    return options;
  };

  useEffect(() => {
    setError("");
    const getSummary = async () => {
      setLoading(true);
      try {
        const response = await postRequestAuthenticated(
          "/fetch/topic/summary",
          {
            topic: topic._id,
          }
        );
        setLoading(false);

        if (response.success) {
          setTopicSummary(response.summary);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(error);
      }
    };
    getSummary();
  }, []);

  const generateSummary = async () => {
    setError("");
    setCurrentLoading(true);
    try {
      const response = await postRequestAuthenticated(
        "/generate/summary/data",
        {
          topic: topic._id,
        }
      );
      setCurrentLoading(false);
      if (response.success) {
        setSummary(response.summary);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error);
    }
  };

  // const dayInitials = () => {
  //   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   return days.map((day) => (
  //     <div key={day} className="flex justify-center items-center w-7 h-7">
  //       {day[0]} {/* Taking the first letter of each day */}
  //     </div>
  //   ));
  // };

  const generateDates = (month, year) => {
    const dates = [];
    let startDate;
    let endDate;

    if (month === today.getMonth() && year === today.getFullYear()) {
      startDate = new Date(year, month, 1);
      endDate = new Date(today);
    } else {
      startDate = new Date(year, month, today.getDate());
      endDate = new Date(year, month + 1, 0);
    }

    while (startDate <= endDate) {
      dates.push({
        day: startDate.toDateString().split(" ")[0],
        date: new Date(startDate),
      });
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  };

  useEffect(() => {
    setDates(generateDates(selectedMonth, selectedYear));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedDate(new Date(year, month, 1));
    setIsDropdownOpen(false);
  };

  const monthYearOptions = generateMonthYearOptions();

  return (
    <div className="bg-transparent  flex flex-col h-full">
      <div className="relative mb-2">
        <div className="flex flex-row items-center ml-2 justify-between">
          <div
            className="flex flex-row items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <button className="w-max px-2 py-1 rounded-lg bg-theme-tertiaryBackground text-theme-secondaryText sm:text-sm text-xs">
              {new Date(selectedYear, selectedMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </button>
            <img
              src={isDropdownOpen ? ArrowUp : ArrowDown}
              alt={isDropdownOpen ? "up-arrow" : "down-arrow"}
              className="h-6 w-6"
            />
          </div>

          {selectedDate.toDateString() === today.toDateString() && (
            <div
              className="px-2 py-2  rounded-lg underline text-theme-secondaryText cursor-pointer
    text-center w-max sm:text-sm text-xs"
              onClick={generateSummary}
            >
              Generate Summary
            </div>
          )}
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10  w-full h-max bg-theme-tertiaryBackground  border border-theme-chatDivider rounded-lg shadow-lg">
            {monthYearOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMonthChange(option.month, option.year)}
                className={`w-full px-4 py-2 text-left text-sm text-theme-secondaryText hover:bg-chatBackground hover:bg-theme-primaryBackground ${
                  selectedMonth === option.month && selectedYear === option.year
                    ? "bg-primary text-theme-secondaryText"
                    : "text-theme-emptyEvent"
                }`}
              >
                {new Date(option.year, option.month).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row w-full flex-shrink-0 overflow-x-auto custom-scrollbar space-x-4 items-center pb-2">
        {dates.map(({ day, date }) => (
          <div key={date.toISOString()} className="flex flex-col ">
            <button
              onClick={() => setSelectedDate(date)}
              className={`flex items-center text-theme-secondaryText justify-center w-6 h-7 rounded-3xl text-xs font-light flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString()
                  ? "border border-secondaryText"
                  : ""
              }`}
            >
              {day[0]}
            </button>
            <button
              onClick={() => setSelectedDate(date)}
              className={`flex items-center mt-3 justify-center w-7 h-7 rounded-full text-sm font-light flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-theme-secondaryText text-theme-primaryBackground"
                  : "text-theme-secondaryText"
              }`}
            >
              {date.getDate() <= "9" ? "0" + date.getDate() : date.getDate()}
            </button>
          </div>
        ))}
      </div>
      {selectedDate.toDateString() === today.toDateString() ? (
        summary ? (
          <div className="mt-4 text-theme-secondaryText  flex flex-col text-sm px-2 space-y-4 leading-5">
            <p className="text-lg font-normal  mb-2">Summary : </p>
            {summary}
          </div>
        ) : (
          <div className="mt-20 mx-auto text-center text-theme-secondaryText text-sm px-2 ">
            {currentLoading
              ? "Generating summary..."
              : "No summary generated yet for today."}
          </div>
        )
      ) : matchedSummary ? (
        <div className="mt-4 text-theme-secondaryText  flex flex-col text-sm px-2 space-y-4 leading-5">
          <p className="text-lg font-normal">Summary : </p>
          {matchedSummary.summary}
        </div>
      ) : (
        <div className="mt-20 mx-auto text-center text-theme-secondaryText text-sm px-2 ">
          {loading
            ? "Loading data...."
            : "No summary generated yet for this date."}
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
