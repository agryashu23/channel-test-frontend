import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import Upload from "../../../assets/icons/Upload.svg";
import UploadLight from "../../../assets/lightIcons/upload_light.svg";
import useModal from "./../../hooks/ModalHook";
import { closeModal } from "../../../redux/slices/modalSlice";
import Unsplash from "../../../assets/icons/Unsplash.svg";
import UnsplashLight from "../../../assets/lightIcons/unsplash_light.svg";

import "react-datepicker/dist/react-datepicker.css";
import LocationIcon from "../../../assets/icons/location-marker.svg";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setEventField,
  clearEvent,
  createChatEvent,
  editChatEvent,
} from "../../../redux/slices/eventSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyTimePicker from "./../widgets/TimePicker";
import Event from "../../../assets/icons/calendar.svg";
import EventLight from "../../../assets/lightIcons/calendar_light.svg";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import { getAddressFromCoords } from "../../../utils/methods";
import EventTimePicker from "./../widgets/EventTimePicker";
import moment from "moment-timezone";
import Compressor from "compressorjs";

const EventModal = () => {
  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat);
  const event = useSelector((state) => state.event);
  const [suggestions, setSuggestions] = useState([]);
  const [file, setFile] = useState(null);
  const [locationFocus, setLocationFocus] = useState(false);
  const locationRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [timeZone, setTimeZone] = useState(moment.tz.guess());

  const handleClose = () => {
    dispatch(closeModal("modalEventOpen"));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setLocationFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    dispatch(setEventField({ field: "timezone", value: timeZone }));
  }, []);

  const handleUnsplashModal = () => {
    handleOpenModal("modalEventUnsplashOpen");
  };
  const autoExpand = (field) => {
    field.style.height = "inherit";
    field.style.height = `${field.scrollHeight}px`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setEventField({ field: name, value: value }));
    if (name === "name") {
      setCharCount(value.length);
    } else if (name === "description") {
      setDescCount(value.length);
    }
  };

  const handleStartDateChange = (date) => {
    const isoDate = date ? date.toISOString() : "";
    dispatch(setEventField({ field: "startDate", value: isoDate }));
  };
  const handleEndDateChange = (date) => {
    const isoDate = date ? date.toISOString() : "";
    dispatch(setEventField({ field: "endDate", value: isoDate }));
  };

  const handleStartTimeChange = (date) => {
    const isoString = date
      ? date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : "";
    dispatch(setEventField({ field: "startTime", value: isoString }));
  };

  const handleEndTimeChange = (date) => {
    const isoString = date
      ? date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : "";
    dispatch(setEventField({ field: "endTime", value: isoString }));
  };

  const fetchSuggestions = async (input) => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await postRequestUnAuthenticated(
        `/places/autocomplete?input=${encodeURIComponent(input)}`
      );
      const data = response;

      if (data.status === "OK" && data.predictions) {
        const descriptions = data.predictions.map((prediction) => {
          const description = prediction.description;
          const placeId = prediction.place_id;
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${description}&query_place_id=${placeId}`;
          return { description, mapsUrl };
        });

        setSuggestions(descriptions);
      } else {
        console.log("No predictions found or status not OK");
      }
    } catch (error) {
      console.log("Error fetching suggestions:", error);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const address = await getAddressFromCoords(lat, lng);
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        dispatch(setEventField({ field: "locationText", value: address }));
        dispatch(setEventField({ field: "location", value: url }));

        setSuggestions([]);
        setLocationFocus(false);
      },
      (error) => {
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    fetchSuggestions(value);
    dispatch(setEventField({ field: "locationText", value }));
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(
      setEventField({ field: "locationText", value: suggestion.description })
    );
    dispatch(setEventField({ field: "location", value: suggestion.mapsUrl }));
    setSuggestions([]);
    setLocationFocus(false);
  };

  const setLocationClear = (suggestion) => {
    setSuggestions([]);
    setLocationFocus(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert(
          `The file "${file.name}" exceeds the 20 MB size limit and will not be uploaded.`
        );
        return;
      }

      if (file.size >= 7 * 1024 * 1024) {
        new Compressor(file, {
          quality: 0.5,
          maxWidth: 1920,
          maxHeight: 1080,
          success(result) {
            setFile(result);
            const reader = new FileReader();
            reader.onloadend = () => {
              dispatch(
                setEventField({ field: "cover_image", value: reader.result })
              );
              dispatch(
                setEventField({ field: "cover_image_source", value: "upload" })
              );
            };
            reader.readAsDataURL(result);
          },
          error(err) {
            alert("Image compression failed: " + err);
          },
        });
      } else {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(
            setEventField({ field: "cover_image", value: reader.result })
          );
          dispatch(
            setEventField({ field: "cover_image_source", value: "upload" })
          );
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageClear = () => {
    dispatch(setEventField({ field: "cover_image", value: "" }));
    dispatch(setEventField({ field: "cover_image_source", value: "" }));
    setFile(null);
  };

  const handletoggleChange = (value) => {
    if (value === "online") {
      dispatch(setEventField({ field: "location", value: "" }));
      dispatch(setEventField({ field: "locationText", value: "" }));
    } else if (value === "offline") {
      dispatch(setEventField({ field: "meet_url", value: "" }));
    }
    dispatch(setEventField({ field: "type", value: value }));
  };
  const handleTimeZoneChange = (e) => {
    dispatch(setEventField({ field: "timezone", value: e.target.value }));
    setTimeZone(e.target.value);
    console.log(e.target.value);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (event.name.trim !== "" && event.startDate !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", event.name.trim());
      formDataToSend.append("topic", event.topic);
      formDataToSend.append("joining", event.joining);
      formDataToSend.append("description", event.description);
      formDataToSend.append("type", event.type);
      formDataToSend.append("meet_url", event.meet_url);
      formDataToSend.append("startDate", event.startDate);
      formDataToSend.append("endDate", event.endDate);
      formDataToSend.append("startTime", event.startTime);
      formDataToSend.append("timezone", event.timezone);
      formDataToSend.append("endTime", event.endTime);
      formDataToSend.append("locationText", event.locationText);
      formDataToSend.append("location", event.location);
      if (file && event.cover_image_source === "upload") {
        formDataToSend.append("file", file);
      } else if (event.cover_image && event.cover_image_source === "unsplash") {
        formDataToSend.append("cover_image", event.cover_image);
      }
      formDataToSend.append("imageSource", event.cover_image_source);
      dispatch(createChatEvent(formDataToSend))
        .unwrap()
        .then(() => {
          dispatch(clearEvent());
          setFile(null);
          handleClose();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    if (event.name.trim !== "" && event.startDate !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", event.name.trim());
      formDataToSend.append("id", event._id);
      formDataToSend.append("topic", event.topic);
      formDataToSend.append("joining", event.joining);
      formDataToSend.append("description", event.description);
      formDataToSend.append("type", event.type);
      formDataToSend.append("meet_url", event.meet_url);
      formDataToSend.append("startDate", event.startDate);
      formDataToSend.append("endDate", event.endDate);
      formDataToSend.append("startTime", event.startTime);
      formDataToSend.append("timezone", event.timezone);
      formDataToSend.append("endTime", event.endTime);
      formDataToSend.append("locationText", event.locationText);
      formDataToSend.append("location", event.location);
      if (file && event.cover_image_source === "upload") {
        formDataToSend.append("file", file);
      } else if (event.cover_image && event.cover_image_source === "unsplash") {
        formDataToSend.append("cover_image", event.cover_image);
      }
      formDataToSend.append("imageSource", event.cover_image_source);
      dispatch(editChatEvent(formDataToSend))
        .unwrap()
        .then(() => {
          dispatch(clearEvent());
          setFile(null);
          handleClose();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const [charCount, setCharCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const maxChars = 50;
  const maxDesc = 250;
  const isEventEmpty = event.name.trim() === "" || event.startDate === "";

  const buttonClass = isEventEmpty
    ? "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
    : "bg-theme-secondaryText text-theme-primaryBackground";
  const isOpen = useSelector((state) => state.modals.modalEventOpen);

  const ReadOnlyDateInput = React.forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <input
        readOnly
        value={value}
        onClick={onClick}
        ref={ref}
        placeholder={placeholder}
        className="w-full py-1 text-sm pr-10 font-light rounded bg-transparent
       border-b border-theme-chatDivider placeholder-font-light placeholder-text-sm 
       text-theme-secondaryText focus:outline-none placeholder:text-emptyEvent"
      />
    )
  );

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content
            className="bg-theme-secondaryBackground rounded-xl overflow-hidden z-50
           shadow-xl transform transition-all min-h-[20%] max-h-[90%] overflow-y-auto custom-scrollbar w-[90%]
            xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]"
          >
            <Dialog.Title />
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  {event.type === "edit" ? "Edit Event" : "New Event"}
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mb-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Name
                </p>
                <input
                  id="curation-name"
                  className="w-full  p-0.5 rounded bg-chipBackground 
                   placeholder:font-light placeholder:text-sm text-md font-light
                   focus:outline-none bg-transparent border-b border-theme-chatDivider
                    text-theme-secondaryText  placeholder:text-theme-emptyEvent"
                  type="text"
                  name="name"
                  value={event.name}
                  autoComplete="off"
                  onChange={handleChange}
                  maxLength={maxChars}
                  placeholder="Event Name"
                />
              </div>

              <div className="mb-4">
                <div className="flex flex-row justify-between items-center w-full">
                  <p className="text-theme-secondaryText text-sm font-light font-inter mb-1 w-1/2">
                    Date & time
                  </p>
                  <select
                    id="time-zone-picker"
                    value={timeZone}
                    onChange={handleTimeZoneChange}
                    className="focus:outline-none py-1 cursor-pointer w-[120px]
                     bg-transparent text-theme-emptyEvent font-normal text-sm"
                  >
                    {moment.tz.names().map((zone) => (
                      <option
                        key={zone}
                        value={zone}
                        className="bg-theme-tertiaryBackground text-theme-primaryText
                         hover:bg-primaryBackground focus:bg-primaryBackground"
                      >
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-row justify-between items-center  mt-3">
                  <div className="relative w-[45%]">
                    <DatePicker
                      selected={event.startDate}
                      onChange={handleStartDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start date"
                      customInput={<ReadOnlyDateInput />}
                      popperPlacement="top-start"
                    />
                    <img
                      src={Event}
                      alt="event"
                      style={{ position: "absolute", top: "0", right: "0" }}
                      className-="dark:block hidden w-5 h-5 "
                    />
                    <img
                      src={EventLight}
                      alt="event"
                      style={{ position: "absolute", top: "0", right: "0" }}
                      className-="dark:hidden w-5 h-5 "
                    />
                  </div>
                  <div className="relative w-[45%]">
                    <DatePicker
                      selected={event.endDate}
                      onChange={handleEndDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End date"
                      customInput={<ReadOnlyDateInput />}
                      popperPlacement="top-start"
                    />
                    <img
                      src={Event}
                      alt="event"
                      style={{ position: "absolute", top: "0", right: "0" }}
                      className-="dark:block hidden w-5 h-5 "
                    />
                    <img
                      src={EventLight}
                      alt="event"
                      style={{ position: "absolute", top: "0", right: "0" }}
                      className-="dark:hidden w-5 h-5 "
                    />
                  </div>
                </div>
              </div>

              <EventTimePicker
                chipData={event}
                handleStartTimeChange={handleStartTimeChange}
                handleEndTimeChange={handleEndTimeChange}
              />

              <div className="mt-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Event type
                </p>
                <div className="flex mt-3 items-center border border-theme-chatDivider rounded-md overflow-hidden w-max">
                  <button
                    type="button"
                    onClick={() => handletoggleChange("offline")}
                    className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
                      event.type === "offline"
                        ? "bg-theme-secondaryText text-theme-primaryBackground"
                        : "bg-transparent text-theme-secondaryText"
                    }`}
                  >
                    Offline
                  </button>
                  <button
                    type="button"
                    onClick={() => handletoggleChange("online")}
                    className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
                      event.type === "online"
                        ? "bg-theme-secondaryText text-theme-primaryBackground"
                        : "bg-transparent text-theme-secondaryText"
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>

              <div className="relative mt-4">
                {
                  <p className="text-theme-secondaryText text-sm font-light font-inter mb-0.5">
                    {event.type === "offline"
                      ? "Location"
                      : "Virtual event link"}
                  </p>
                }
                {event.type === "offline" && (
                  <input
                    className="w-full py-1 mr-3 text-sm mt-1 pr-3 font-light rounded no-scrollbar bg-transparent
                        border-b border-theme-chatDivider placeholder-font-light placeholder-text-sm text-theme-secondaryText
                        focus:outline-none placeholder:text-theme-emptyEvent resize-none"
                    placeholder="Enter location"
                    name="location"
                    ref={locationRef}
                    onFocus={() => setLocationFocus(true)}
                    onChange={handleInputChange}
                    value={event.locationText}
                    autoComplete="off"
                  />
                )}
                {event.type === "online" && (
                  <input
                    className="w-full py-1 mr-3 text-sm mt-1 pr-3 font-light rounded no-scrollbar bg-transparent
                        border-b border-theme-chatDivider placeholder-font-light placeholder-text-sm text-theme-secondaryText
                        focus:outline-none placeholder:text-theme-emptyEvent resize-none"
                    placeholder="https://meet.google.com/tnt-sccs.."
                    name="meet_url"
                    onChange={handleChange}
                    value={event.meet_url}
                    autoComplete="off"
                  />
                )}
                {(locationFocus || suggestions.length > 0) && (
                  <img
                    src={Close}
                    alt="clear"
                    className="absolute right-1 top-4 w-3 h-3 cursor-pointer"
                    onClick={setLocationClear}
                  />
                )}
                {locationFocus && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-14  bg-theme-tertiaryBackground text-theme-secondaryText text-xs pr-1 mr-2 rounded-lg  w-[100%] z-50 flex flex-col"
                  >
                    <p
                      className="text-theme-secondaryText py-2 text-sm font-normal px-2 cursor-pointer"
                      onClick={getCurrentLocation}
                    >
                      Current location
                    </p>
                    <div className="border-t border-t-theme-chatDivider pb-1 px-2"></div>
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="py-2 px-2 cursor-pointer flex flex-row hover:bg-theme-primaryBackground text-theme-secondaryText"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <img
                            className="text-theme-secondaryText w-4 h-4 mr-1"
                            alt="location"
                            src={LocationIcon}
                          />
                          {suggestion.description}
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative mb-2 mt-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-0.5">
                  Description
                </p>
                <textarea
                  value={event.description}
                  style={{ overflow: "hidden" }}
                  onChange={(e) => {
                    handleChange(e);
                    autoExpand(e.target);
                  }}
                  ref={inputRef}
                  name="description"
                  maxLength={maxDesc}
                  className="w-full py-1 mr-3 text-sm mt-1 pr-3 font-light rounded no-scrollbar bg-transparent
                  border-b border-theme-chatDivider placeholder-font-light placeholder-text-sm text-theme-secondaryText
                  focus:outline-none placeholder:text-theme-emptyEvent resize-none"
                  rows="1"
                  placeholder="Add a Description (optional)"
                />
              </div>
              <div className="mb-4 mt-1">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Who can join this event?
                </p>
                <div className="flex mt-3 items-center space-x-12">
                  <label
                    className={`${
                      event.joining === "public"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="joining"
                      value="public"
                      className="mr-2 custom-radio"
                      checked={event.joining === "public"}
                      onChange={handleChange}
                    />
                    <span>Public</span>
                  </label>
                  <label
                    className={`${
                      event.joining === "private"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="joining"
                      value="private"
                      className="mr-2 custom-radio"
                      checked={event.joining === "private"}
                      onChange={handleChange}
                    />
                    <span>Private</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter">
                  Add cover image to this event
                </p>
                {!event.cover_image && (
                  <div className="flex flex-row mt-3">
                    <div className="relative border border-theme-chatDivider w-1/2 px-2 py-4 rounded-xl cursor-pointer">
                      <div className="flex flex-col mt-0.5 items-center justify-center">
                        <img
                          src={Upload}
                          alt="Upload"
                          className="dark:block hidden w-5 h-5 mb-2"
                        />
                        <img
                          src={UploadLight}
                          alt="Upload"
                          className="dark:hidden w-4 h-4 mb-2"
                        />
                        <p className="text-theme-secondaryText text-xs font-light font-inter">
                          Upload image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                    <div
                      className="w-1/2 py-4 px-1 border xs:px-2 rounded-xl ml-4 cursor-pointer border-theme-chatDivider"
                      onClick={handleUnsplashModal}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={Unsplash}
                          alt="Unsplash"
                          className="dark:block hidden w-5 h-5 mb-2"
                        />
                        <img
                          src={UnsplashLight}
                          alt="Unsplash"
                          className="dark:hidden w-5 h-5 mb-2"
                        />
                        <p className="text-theme-secondaryText text-xs text-center font-light font-inter">
                          Select from Unsplash
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {event.cover_image && (
                  <div className="relative w-44 h-36 mt-3">
                    <img
                      src={event.cover_image}
                      alt="channel-image"
                      className="w-44 h-36 object-cover rounded-xl "
                    />
                    <div className="absolute right-0 top-0 bg rounded-full w-6 h-6 flex justify-center items-center border">
                      <img
                        src={Close}
                        alt="close"
                        className="w-4 h-4 cursor-pointer"
                        onClick={handleImageClear}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg ${buttonClass}`}
                disabled={isEventEmpty}
                onClick={
                  event.type === "edit" ? handleEditEvent : handleCreateEvent
                }
              >
                {event.status === "loading"
                  ? "Please wait..."
                  : event.type === "edit"
                  ? "Save Changes"
                  : "Create Event"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EventModal;
