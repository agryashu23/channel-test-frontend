import Logo from "../../../assets/icons/logo.svg";
import DarkLogo from "../../../assets/lightIcons/logo_light.svg";
import ArrowBack from "../../../assets/icons/arrow_back.svg";
import ArrowBackLight from "../../../assets/lightIcons/arrow_back_light.svg";
import { format, parseISO, parse, isValid } from "date-fns";
import Test from "../../../assets/images/test.png";
import MapPin from "../../../assets/icons/map-pin.svg";
import { joinEvent } from "../../../redux/slices/eventSlice";
import { setModalModal } from "../../../redux/slices/modalSlice";
import { postRequestUnAuthenticated } from "../../../services/rest";
import GoogleMapsEvent from "./GoogleMapsEvent";
import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSearchParams,
  useSelector,
  useParams,
  useModal,
  useLocation,
} from "../../../globals/imports";
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper";

const EventFullPage = () => {
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const fullPath = location.pathname;
  const { eventId } = useParams();
  const { handleOpenModal } = useModal();

  useEffect(() => {
    const generateEventData = async () => {
      setLoading(true);
      const response = await postRequestUnAuthenticated(`/fetch/event/data`, {
        eventId: eventId,
      });
      setLoading(false);
      if (response.success) {
        setEvent(response.event);
      }
    };
    generateEventData();
  }, []);

  const handleJoinEvent = () => {
    if (isLoggedIn) {
      dispatch(joinEvent(event._id))
        .unwrap()
        .then(() => {})
        .catch((error) => {
          console.error("Issue in joining event. Please try again.");
        });
    } else {
      navigate(`${getAppPrefix()}/get-started?redirect=${fullPath}`);
    }
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false); // Close dropdown
      } else {
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [isDropdownOpen]);

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
          ? format(parsedStartTime, "HH:mm")
          : "";
      const endTimeFormatted =
        parsedEndTime && isValid(parsedEndTime)
          ? format(parsedEndTime, "HH:mm")
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
        `${displayStartDate}${displayEndDate ? ` - ${displayEndDate}` : ""}`
      );
      setTime(
        `${displayStartTime}${displayEndTime ? ` - ${displayEndTime}` : ""}`
      );
    } catch (error) {
      console.error("Error formatting date/time:", error.message);
    }
  };

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

  const handleShareEvent = (id) => {
    dispatch(setModalModal({ field: "eventId", value: event._id }));
    handleOpenModal("modalShareEventOpen");
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

  const handleLocation = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("Location URL is not provided");
    }
  };

  useEffect(() => {
    if (event.name) {
      formatDateTime(
        event.startDate,
        event.endDate,
        event.startTime,
        event.endTime
      );
    }
  }, [
    event.startDate,
    event.endDate,
    event.startTime,
    event.endTime,
    event.name,
  ]);

  return (
    <div className="flex flex-row bg-theme-primaryBackground mx-3 items-start">
      <img
        src={Logo}
        alt="logo"
        className="dark:block hidden cursor-pointer  w-9 h-9 mt-3  rounded-sm object-contain"
      />
      <img
        src={DarkLogo}
        alt="logo"
        className="dark:hidden cursor-pointer  w-9 h-9 mt-3  rounded-sm object-contain"
      />
      <div className="flex sm:flex-row flex-col items-start mx-auto space-x-3">
        <div
          className=" sm:mt-8 mt-4 sm:mb-0 mb-4  flex flex-row items-center space-x-1 ml-3"
          onClick={() => navigate(-1)}
        >
          <img
            src={ArrowBack}
            alt="logo"
            className="dark:block hidden cursor-pointer  w-4 h-4   rounded-sm object-contain"
          />
          <img
            src={ArrowBackLight}
            alt="logo"
            className="dark:hidden cursor-pointer  w-4 h-4   rounded-sm object-contain"
          />
          <p className="text-xs text-theme-secondaryText font-light">Back</p>
        </div>
        <div className="flex flex-col bg-theme-tertiaryBackground p-4 h-full min-h-screen overflow-y-auto">
          <div className="flex flex-col p-4 relative justify-start items-start space-y-2">
            <img
              src={event.cover_image ? event.cover_image : Test}
              alt="event-image"
              className="rounded-lg h-36 w-auto object-contain"
            />
            <p className="text-theme-secondaryText text-2xl font-normal ">
              {event.name}
            </p>
            <p className="text-theme-sidebarColor font-light text-sm">
              {date} • {time}
            </p>
            <div className="flex flex-row items-end space-x-4">
              {event?.joined_users?.includes(myData._id) ||
              event.user === myData._id ? (
                <div className="">
                  <button
                    className="cursor-pointer text-xs w-full mt-3 bg-theme-secondaryText text-theme-primaryBackground rounded-md font-normal text-center px-3 py-2.5"
                    onClick={() => setIsDropdownOpen(true)}
                  >
                    Add to Calendar
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="border rounded-lg border-theme--chatDivider bg-theme-tertiaryBackground"
                        ref={dropdownRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Clicked inside dropdown");
                        }}
                      >
                        <div
                          className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:bg-theme-primaryBackground hover:rounded-t-lg px-6 py-3"
                          onClick={handleGoogleCalendar}
                        >
                          <p>Google</p>
                        </div>
                        <div className="border-t border-theme--t-chatDivider"></div>
                        <div
                          className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:bg-theme-primaryBackground px-6 py-3"
                          onClick={handleDownloadICS}
                        >
                          <p>ICS/Apple</p>
                        </div>
                        <div className="border-t border-theme--t-chatDivider"></div>
                        <div
                          className="flex flex-col cursor-pointer text-sm font-light text-theme-secondaryText hover:rounded-b-lg hover:bg-theme-primaryBackground px-6 py-3"
                          onClick={handleOutlookCalendar}
                        >
                          <p>Outlook</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : event?.requested_users?.includes(myData._id) ? (
                <div className="cursor-pointer text-sm bg-theme-emptyEvent text-theme-primaryBackground rounded-md font-normal text-center px-3 py-2">
                  Requested
                </div>
              ) : (
                <div
                  className="cursor-pointer text-sm bg-theme-secondaryText text-theme-primaryBackground rounded-md font-normal text-center px-3 py-2"
                  onClick={handleJoinEvent}
                >
                  {event.joining === "public" ? "Join event" : "Request access"}
                </div>
              )}
              <div
                className="px-4 py-2 text-sm font-light text-center text-theme-secondaryText
               border border-theme-secondaryText rounded-md cursor-pointer"
                onClick={handleShareEvent}
              >
                Share
              </div>
            </div>

            <div className="pb-2 border-b border-theme-chatDivider w-full"></div>
            {event.joining === "public" ? (
              <div className="  text-theme-emptyEvent text-xs font-light font-inter italic">
                This is a public event. Which means anyone can join.
              </div>
            ) : (
              <div className="  text-theme-emptyEvent text-xs font-light font-inter italic">
                This is a private event, so entry requires approval. You'll
                receive an email once the admin reviews and approves your
                request.
              </div>
            )}
            <p className="text-theme-emptyEvent text-sm font-light">Location</p>
            {event && event.location && event.locationText && (
              <GoogleMapsEvent url={event.location} text={event.locationText} />
            )}

            <p className="text-theme-emptyEvent text-xs font-light pt-2">
              Address:
            </p>
            <div
              className="flex flex-row items-center mt-2 w-full cursor-pointer "
              onClick={() => handleLocation(event.location)}
            >
              <div className=" text-theme-secondaryText text-sm font-light font-inter">
                {event.locationText}
              </div>
            </div>
            <div className="mt-3 text-theme-emptyEvent text-xs font-light font-inter pt-1">
              About this event
            </div>
            <p className="text-theme-secondaryText text-sm font-light mt-1">
              {event.description}
            </p>
            {/* <div className="border-t border-t-theme-chatDivider w-full my-2"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFullPage;
