import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import useModal from "./../../hooks/ModalHook";
import { closeModal } from "../../../redux/slices/modalSlice";

import "react-datepicker/dist/react-datepicker.css";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setPollField,
  clearChatPoll,
  createChatPoll,
  //   editChatpoll,
} from "../../../redux/slices/pollSlice";

const PollModal = () => {
  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();
  const poll = useSelector((state) => state.poll);
  const [file, setFile] = useState(null);

  const handleClose = () => {
    dispatch(closeModal("modalpollOpen"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPollField({ field: name, value: value }));
  };

  const handleCreatepoll = async (e) => {
    e.prpollDefault();
    if (poll.question.trim !== "" && poll.answers.length > 1) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", poll.name.trim());
      formDataToSend.append("topic", poll.topic);
      formDataToSend.append("joining", poll.joining);
      formDataToSend.append("description", poll.description);
      formDataToSend.append("type", poll.type);
      formDataToSend.append("meet_url", poll.meet_url);
      formDataToSend.append("startDate", poll.startDate);
      formDataToSend.append("endDate", poll.endDate);
      formDataToSend.append("startTime", poll.startTime);
      formDataToSend.append("timezone", poll.timezone);
      formDataToSend.append("endTime", poll.endTime);
      formDataToSend.append("locationText", poll.locationText);
      formDataToSend.append("location", poll.location);
      if (file && poll.cover_image_source === "upload") {
        formDataToSend.append("file", file);
      } else if (poll.cover_image && poll.cover_image_source === "unsplash") {
        formDataToSend.append("cover_image", poll.cover_image);
      }
      formDataToSend.append("imageSource", poll.cover_image_source);
      dispatch(createChatPoll(formDataToSend))
        .unwrap()
        .then(() => {
          dispatch(clearChatPoll());
          setFile(null);
          handleClose();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleEditpoll = async (e) => {
    e.prpollDefault();
    if (poll.name.trim !== "" && poll.startDate !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", poll.name.trim());
      formDataToSend.append("id", poll._id);
      formDataToSend.append("topic", poll.topic);
      formDataToSend.append("joining", poll.joining);
      formDataToSend.append("description", poll.description);
      formDataToSend.append("type", poll.type);
      formDataToSend.append("meet_url", poll.meet_url);
      formDataToSend.append("startDate", poll.startDate);
      formDataToSend.append("endDate", poll.endDate);
      formDataToSend.append("startTime", poll.startTime);
      formDataToSend.append("timezone", poll.timezone);
      formDataToSend.append("endTime", poll.endTime);
      formDataToSend.append("locationText", poll.locationText);
      formDataToSend.append("location", poll.location);
      if (file && poll.cover_image_source === "upload") {
        formDataToSend.append("file", file);
      } else if (poll.cover_image && poll.cover_image_source === "unsplash") {
        formDataToSend.append("cover_image", poll.cover_image);
      }
      formDataToSend.append("imageSource", poll.cover_image_source);
      //   dispatch(editChatpoll(formDataToSend))
      //     .unwrap()
      //     .then(() => {
      //       dispatch(clearpoll());
      //       setFile(null);
      //       handleClose();
      //     })
      //     .catch((error) => {
      //       alert(error);
      //     });
    }
  };

  const handletoggleChange = (value) => {
    dispatch(setPollField({ field: "type", value: value }));
  };

  const ispollEmpty = poll.question.trim() === "" || poll.answers.length < 1;

  const buttonClass = ispollEmpty
    ? "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
    : "bg-theme-secondaryText text-theme-primaryBackground";
  const isOpen = useSelector((state) => state.modals.modalpollOpen);

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
       text-theme-secondaryText focus:outline-none placeholder:text-emptypoll"
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
            {/* <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  {poll.type === "edit" ? "Edit poll" : "New poll"}
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
                  id="poll-name"
                  className="w-full  p-0.5 rounded bg-chipBackground 
                   placeholder:font-light placeholder:text-sm text-md font-light
                   focus:outline-none bg-transparent border-b border-theme-chatDivider
                    text-theme-secondaryText  placeholder:text-theme-emptypoll"
                  type="text"
                  name="name"
                  value={poll.name}
                  autoComplete="off"
                  onChange={handleChange}
                  maxLength={maxChars}
                  placeholder="poll Name"
                />
              </div>

              <div className="mt-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  poll type
                </p>
                <div className="flex mt-3 items-center border border-theme-chatDivider rounded-md overflow-hidden w-max">
                  <button
                    type="button"
                    onClick={() => handletoggleChange("offline")}
                    className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
                      poll.type === "offline"
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
                      poll.type === "online"
                        ? "bg-theme-secondaryText text-theme-primaryBackground"
                        : "bg-transparent text-theme-secondaryText"
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>

              <div className="mb-4 mt-1">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Who can join this poll?
                </p>
                <div className="flex mt-3 items-center space-x-12">
                  <label
                    className={`${
                      poll.joining === "public"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="joining"
                      value="public"
                      className="mr-2 custom-radio"
                      checked={poll.joining === "public"}
                      onChange={handleChange}
                    />
                    <span>Public</span>
                  </label>
                  <label
                    className={`${
                      poll.joining === "private"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="joining"
                      value="private"
                      className="mr-2 custom-radio"
                      checked={poll.joining === "private"}
                      onChange={handleChange}
                    />
                    <span>Private</span>
                  </label>
                </div>
              </div>

              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg ${buttonClass}`}
                disabled={ispollEmpty}
                onClick={
                  poll.type === "edit" ? handleEditpoll : handleCreatepoll
                }
              >
                {poll.status === "loading"
                  ? "Please wait..."
                  : poll.type === "edit"
                  ? "Save Changes"
                  : "Create poll"}
              </button>
            </div> */}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PollModal;
