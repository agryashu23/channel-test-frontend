import Logo from "../../assets/icons/logo.svg";
import DarkLogo from "../../assets/lightIcons/logo_light.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import ArrowBackLight from "../../assets/lightIcons/arrow_back_light.svg";
import { format, parseISO, parse, isValid } from "date-fns";
import Test from "../../assets/images/test.png";
import EmptyChatIcon from "../../assets/icons/empty_chat.svg";
import MapPin from "../../assets/icons/map-pin.svg";
import { joinEvent, fetchEventData } from "../../redux/slices/eventItemsSlice";
import { setModalModal } from "../../redux/slices/modalSlice";
import { ChannelImages } from "../constants/images";
import { postRequestUnAuthenticated } from "../../services/rest";
import Page404 from "../Page404/Page404";
import Edit from "../../assets/icons/Edit.svg";
import EditLight from "../../assets/lightIcons/edit_light.svg";
import Delete from "../../assets/icons/Delete.svg";
import DeleteLight from "../../assets/lightIcons/delete_light.svg";
import GoogleMapsEvent from "../ChannelPages/widgets/GoogleMapsEvent";
import Loading from "../../widgets/Loading";
import { setEventItems, setEventField } from "../../redux/slices/eventSlice";

import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSelector,
  useParams,
  useModal,
  useLocation,
} from "../../globals/imports";
import { getAppPrefix } from "../EmbedChannels/utility/embedHelper";
import { usePaymentHandler } from "../../utils/paymentPage";
import PaymentLoading from "../../widgets/paymentLoading";
import EventMembersTab from "./EventMembersTab";
import BottomSheetModal from "./BottomSheetModal";
import { showCustomToast } from "../../widgets/toast";

const EventFullPage = () => {
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myUser = useSelector((state) => state.auth.user);
  const { event, membership, eventLoading } = useSelector(
    (state) => state.eventItems
  );
  const paymentData = useSelector((state) => state.payment);
  const myUserId = myUser?._id;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [pageExist, setPageExist] = useState(false);
  const dropdownRef = useRef(null);
  const editDropdownRef = useRef(null);
  const location = useLocation();
  const fullPath = location.pathname;
  const { eventId } = useParams();
  const { handleOpenModal } = useModal();
  const [message, setMessage] = useState("");
  const { handlePayment } = usePaymentHandler();

  useEffect(() => {
    if (eventId !== "") {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("user_id", myUserId);
      dispatch(fetchEventData(formData));
    }
  }, [eventId]);

  const handleJoinEvent = () => {
    if (isLoggedIn) {
      dispatch(joinEvent(event._id))
        .unwrap()
        .then((response) => {
          if (
            response.success &&
            response.paywall &&
            response.paywallPrice > 0
          ) {
            const data = {
              amount: response.paywallPrice,
              currency: "INR",
              event: response.event._id,
              name: response.event.name,
              type: "event",
            };
            handlePayment(data, "event");
            return;
          } else if (
            response.success &&
            response.membership.status === "joined"
          ) {
            showCustomToast("Event joined successfully!");
          } else if (
            response.success &&
            response.membership.status === "request"
          ) {
            showCustomToast("Event request sent successfully!");
          }
        })
        .catch((error) => {
          setMessage(error);
        });
    } else {
      navigate(`${getAppPrefix()}/get-started?redirect=${fullPath}`);
    }
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (
        editDropdownRef.current &&
        !editDropdownRef.current.contains(e.target)
      ) {
        setIsEditDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [isDropdownOpen]);

  const formatDateTime = (startDate, endDate, startTime, endTime) => {
    console.log(startDate, endDate, startTime, endTime);
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

      // Combine date and time strings and parse them
      const parsedStartDateTime = startTime
        ? new Date(`${startDateFormatted}T${startTime}Z`)
        : parsedStartDate;

      const parsedEndDateTime =
        endTime && endDateFormatted
          ? new Date(`${endDateFormatted}T${endTime}Z`)
          : parsedEndDate;

      const startTimeFormatted = isValid(parsedStartDateTime)
        ? format(parsedStartDateTime, "HH:mm:ss")
        : "";

      const endTimeFormatted = isValid(parsedEndDateTime)
        ? format(parsedEndDateTime, "HH:mm:ss")
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
        parsedStartDateTime && isValid(parsedStartDateTime)
          ? format(parsedStartDateTime, "hh:mm a")
          : "";

      const displayEndTime =
        parsedEndDateTime && isValid(parsedEndDateTime)
          ? format(parsedEndDateTime, "hh:mm a")
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

  const handleDeleteEventModal = () => {
    toggleEditDropdown();
    setPageExist(true);
    dispatch(setModalModal({ field: "eventId", value: event._id }));
    handleOpenModal("modalEventDeleteOpen");
  };
  const handleEditEventModal = () => {
    toggleEditDropdown();
    console.log(event);
    dispatch(setEventItems(event));
    dispatch(setEventField({ field: "event_type", value: "edit" }));
    handleOpenModal("modalEventOpen");
  };

  const toggleEditDropdown = () => {
    setIsEditDropdownOpen(!isEditDropdownOpen);
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

  const eventButtonState = () => {
    if (!isLoggedIn || !myData?._id) {
      return "Join event";
    } else if (event?.user?.toString() === myUserId?.toString()) {
      return "Add to calendar";
    } else if (
      membership?.user?.toString() === myUserId?.toString() &&
      membership?.event?.toString() === event._id.toString() &&
      membership?.addedToCalendar === true
    ) {
      return "Event joined";
    } else if (
      membership?.user?.toString() === myUserId?.toString() &&
      membership?.event?.toString() === event._id.toString() &&
      membership?.status === "joined"
    ) {
      return "Add to calendar";
    } else if (
      membership?.user?.toString() === myUserId?.toString() &&
      membership?.event?.toString() === event._id.toString() &&
      membership?.status === "request"
    ) {
      return "Requested";
    } else {
      return "Join event";
    }
  };

  const buttonState = eventButtonState();
  const isMember =
    buttonState === "Add to calendar" || buttonState === "Event joined";

  const isAdmin =
    membership?.user?.toString() === myUserId?.toString() &&
    (membership.role === "admin" || membership.role === "owner");

  const isEventPart =
    event?.user?.toString() === myUserId?.toString() ||
    (membership?.user?.toString() === myUserId?.toString() &&
      membership?.event?.toString() === event._id.toString() &&
      membership?.status === "joined");

  if (!eventLoading && !event._id && !pageExist) {
    return <Page404 />;
  }

  if (
    event._id &&
    event.visibility &&
    event.visibility === "topic" &&
    (!myUserId || !isEventPart)
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src={EmptyChatIcon}
          alt="event-private"
          className="h-32 w-auto mb-1"
        />
        <p className="text-theme-secondaryText font-light text-md">
          This event is private.
        </p>
        <button
          className="mt-4 bg-theme-secondaryText text-theme-primaryBackground rounded-md px-4 py-2"
          onClick={() => navigate(-1)}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex xs:flex-row flex-col bg-theme-primaryBackground px-3 py-3 items-start">
      {paymentData.loading && (
        <div className="absolute inset-0 bg-[#202020] bg-opacity-80 z-50 flex items-center justify-center">
          <PaymentLoading />
        </div>
      )}
      <img
        src={Logo}
        alt="logo"
        className="dark:block hidden cursor-pointer  w-9 h-9   rounded-sm object-contain"
      />
      <img
        src={DarkLogo}
        alt="logo"
        className="dark:hidden cursor-pointer  w-9 h-9   rounded-sm object-contain"
      />
      <div className="flex sm:flex-row flex-col items-start mx-auto xs:space-x-3 h-full">
        <div
          className=" sm:mt-8 mt-4 sm:mb-0 mb-4  flex flex-row items-center space-x-1 xs:ml-3 ml-0"
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
        <div className="flex flex-col flex-1 flex-grow xs:p-4 p-2 h-full overflow-y-auto rounded-lg ">
          {eventLoading ? (
            <div className="flex flex-col p-6 relative justify-start items-start mt-12">
              <Loading text="Loading event data..." />
            </div>
          ) : (
            <div className="flex flex-col h-full relative justify-start items-start space-y-2">
              <div className="flex flex-row items-start w-full">
                <img
                  src={event.cover_image ? event.cover_image : Test}
                  alt="event-image"
                  className="rounded-lg xs:h-44 h-40 w-auto object-cover xs:max-w-80 max-w-64"
                />
                <div className="items-center justify-end ml-2 relative flex">
                  {isAdmin && (
                    <div
                      className="flex space-x-1 cursor-pointer xs:ml-4 ml-0"
                      onClick={toggleEditDropdown}
                    >
                      <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
                      <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
                      <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
                    </div>
                  )}
                  {isEditDropdownOpen && (
                    <div
                      ref={editDropdownRef}
                      className="absolute top-4 right-0 w-max rounded-md shadow-lg border border-theme-chatDivider bg-theme-tertiaryBackground  ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div
                          className="flex flex-row px-4 items-center"
                          onClick={handleEditEventModal}
                        >
                          <img
                            src={Edit}
                            alt="edit"
                            className="dark:block hidden w-4 h-4"
                          />
                          <img
                            src={EditLight}
                            alt="edit"
                            className="dark:hidden w-4 h-4"
                          />
                          <p
                            className="block ml-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                            role="menuitem"
                          >
                            Edit
                          </p>
                        </div>
                        <div
                          className="flex flex-row px-4 items-center"
                          onClick={handleDeleteEventModal}
                        >
                          <img
                            src={Delete}
                            alt="edit"
                            className="dark:block hidden w-4 h-4"
                          />
                          <img
                            src={DeleteLight}
                            alt="edit"
                            className="dark:hidden w-4 h-4"
                          />
                          <p
                            className="block  ml-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                            role="menuitem"
                          >
                            Delete
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-theme-secondaryText text-2xl font-normal ">
                {event.name}
              </p>
              <p className="text-theme-sidebarColor font-light text-sm">
                {date} • {time}
              </p>
              {!isEventPart && (
                <div className="flex flex-row items-center mt-0.5">
                  <img
                    className="mr-1 w-3 h-3 mt-0.5 dark:block hidden"
                    loading="lazy"
                    src={
                      event.joining === "paid"
                        ? ChannelImages.Secure.default
                        : event.joining === "public"
                        ? ChannelImages.LockOpen.default
                        : ChannelImages.Lock.default
                    }
                    alt="lock"
                  />
                  <img
                    className="mr-1 w-3 h-3 mt-0.5 dark:hidden block"
                    loading="lazy"
                    src={
                      event.joining === "paid"
                        ? ChannelImages.SecureLight.default
                        : event.joining === "public"
                        ? ChannelImages.LockOpenLight.default
                        : ChannelImages.LockLight.default
                    }
                    alt="lock-light"
                  />
                  <p className="mt-1 text-xs font-light text-theme-emptyEvent">
                    {event.joining === "paid"
                      ? `This event requires a ₹${event.paywallPrice} fee to join.`
                      : event.joining === "public"
                      ? "Public event — anyone can join."
                      : "Invite-only — admin approval required."}
                  </p>
                </div>
              )}
              <div className="flex flex-row items-end pt-2">
                <div className="relative inline-block">
                  {buttonState === "Add to calendar" && (
                    <button
                      className="placeholder:cursor-pointer text-xs mr-3 bg-theme-secondaryText text-theme-primaryBackground rounded-md font-normal text-center py-2.5 xs:px-3 px-1.5"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {buttonState}
                    </button>
                  )}
                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 mt-2 z-10 border rounded-lg border-theme-chatDivider bg-theme-tertiaryBackground w-max"
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
                    className={`cursor-pointer text-sm mr-3 bg-theme-emptyEvent text-theme-primaryBackground rounded-md font-normal text-center ${"px-4"} py-2`}
                  >
                    Requested
                  </div>
                )}

                {buttonState === "Event joined" && (
                  <div
                    className={`cursor-default text-sm mr-3 bg-theme-emptyEvent text-theme-primaryBackground rounded-md font-normal text-center ${"xs:px-3 px-1.5"} py-2`}
                  >
                    Event joined
                  </div>
                )}

                {(buttonState === "Join event" ||
                  buttonState === "Request access") && (
                  <div
                    className="cursor-pointer text-sm mr-3 bg-theme-secondaryText text-theme-primaryBackground rounded-md font-normal text-center xs:px-3 px-1.5 py-2"
                    onClick={handleJoinEvent}
                  >
                    {buttonState}
                  </div>
                )}
                <div
                  className="px-4 py-2 text-sm font-light text-center text-theme-secondaryText
               border border-theme-secondaryText rounded-md cursor-pointer"
                  onClick={handleShareEvent}
                >
                  Share
                </div>
                {isAdmin && (
                  <>
                    <div
                      className="md:hidden flex px-2 py-2 text-sm font-light text-center text-theme-secondaryText border border-theme-secondaryText rounded-md cursor-pointer ml-2"
                      onClick={() => setIsMembersSheetOpen(true)}
                    >
                      Members
                    </div>
                    <BottomSheetModal
                      isOpen={isMembersSheetOpen}
                      onClose={() => setIsMembersSheetOpen(false)}
                    >
                      <EventMembersTab eventId={event._id} />
                    </BottomSheetModal>
                  </>
                )}
              </div>
              {message && (
                <div className="text-sm text-theme-error font-light pt-2">
                  {message}
                </div>
              )}

              <div className="pb-2 border-b border-theme-chatDivider w-full"></div>
              {
                <div className="flex flex-row items-center mt-0.5">
                  <img
                    className="mr-1 w-3 h-3 mt-0.5 dark:block hidden"
                    loading="lazy"
                    src={
                      event.joining === "paid"
                        ? ChannelImages.Secure.default
                        : event.joining === "public"
                        ? ChannelImages.LockOpen.default
                        : ChannelImages.Lock.default
                    }
                    alt="lock"
                  />
                  <img
                    className="mr-1 w-3 h-3 mt-0.5 dark:hidden block"
                    loading="lazy"
                    src={
                      event.joining === "paid"
                        ? ChannelImages.SecureLight.default
                        : event.joining === "public"
                        ? ChannelImages.LockOpenLight.default
                        : ChannelImages.LockLight.default
                    }
                    alt="lock-light"
                  />
                  <p className="mt-1 text-theme-emptyEvent text-xs font-light font-inter italic">
                    {event.joining === "paid"
                      ? `This is a paywall event. Which means you need to pay ₹${event.paywallPrice} to join.`
                      : event.joining === "public"
                      ? "This is a public event. Which means anyone can join."
                      : "This is a private event, so entry requires approval."}
                  </p>
                </div>
              }

              {!isMember && (
                <div className="text-theme-emptyEvent text-xs font-light font-inter italic">
                  Join this event to see more details
                </div>
              )}
              {event.location && (
                <p className="text-theme-emptyEvent text-sm font-light">
                  Location
                </p>
              )}
              {event && event.location && event.locationText && (
                <GoogleMapsEvent
                  url={event.location}
                  text={event.locationText}
                />
              )}

              {event.locationText && isMember && (
                <p className="text-theme-emptyEvent text-xs font-light pt-2">
                  Address:
                </p>
              )}
              {isMember && event.locationText && (
                <div
                  className="flex flex-row items-center mt-2 w-full cursor-pointer "
                  onClick={() => handleLocation(event.location)}
                >
                  <div className=" text-theme-secondaryText text-sm font-light font-inter">
                    {event.locationText}
                  </div>
                </div>
              )}
              {event?.meet_url && event?.type === "online" && isMember && (
                <div className="flex flex-row items-start mt-1 w-full cursor-pointer max-w-64">
                  <div className="ml-0.5  text-theme-emptyEvent text-xs font-light font-inter">
                    {event.meet_url}
                  </div>
                </div>
              )}
              {event.description && (
                <div className="mt-3 text-theme-emptyEvent text-xs font-light font-inter pt-1">
                  About this event
                </div>
              )}
              <p className="text-theme-secondaryText text-sm font-light mt-1">
                {event.description}
              </p>
              {/* <div className="border-t border-t-theme-chatDivider w-full my-2"></div> */}
            </div>
          )}
        </div>
        {isAdmin && (
          <>
            <div className="border-r border-theme-chatDivider h-full w-1 md:flex hidden "></div>
            <div className="xl:pl-8 lg:pl-4 pl-2 md:flex hidden pt-2">
              <EventMembersTab eventId={event._id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventFullPage;
