import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setPollField,
  createChatPoll,
  clearChatPoll,
} from "../../../redux/slices/pollSlice";
import { closeModal } from "../../../redux/slices/modalSlice";
import { triggerScrollToBottom } from "../../../redux/slices/scrollSignalSlice";


const MAX_CHOICES = 4;

const PollModal = () => {
  const dispatch = useDispatch();
  const Poll = useSelector((state) => state.poll);

  const handleClose = () => {
    dispatch(clearChatPoll());
    dispatch(closeModal("modalPollOpen"));
  };

  const handleAddChoice = () => {
    if (Poll.choices.length < MAX_CHOICES) {
      dispatch(
        setPollField({ field: "choices", value: [...Poll.choices, ""] })
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPollField({ field: name, value: value }));
  };

  const handleChoiceChange = (index, value) => {
    const updated = [...Poll.choices];
    updated[index] = value;
    dispatch(setPollField({ field: "choices", value: updated }));
  };

  const handletoggleChange = (value) => {
    dispatch(setPollField({ field: "type", value: value }));
  };

  const handletoggleResults = (value) => {
    dispatch(setPollField({ field: "showResults", value: value }));
  };

  const handleSubmit = () => {
    const trimmedChoices = Poll.choices.filter((c) => c.trim());
    if (trimmedChoices.length < 2) return;
    const payload = {
      name:Poll.name,
      question: Poll.question,
      choices: trimmedChoices,
      topic: Poll.topic,
      type: Poll.type,
      showResults: Poll.showResults,
      visibility: Poll.visibility,
    };
    dispatch(createChatPoll(payload))
      .unwrap()
      .then(() => {
        handleClose();
        dispatch(triggerScrollToBottom());
      })
      .catch((err) => alert(err));
  };

  const isCreateDisabled =
    Poll.choices.filter((c) => c.trim()).length < 2 || !Poll.question.trim();

  const isOpen = useSelector((state) => state.modals.modalPollOpen);

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
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5 items-start">
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  New Poll
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mb-4 w-full">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Poll Name (default: Poll)
                </p>
                <input
                  id="name"
                  className="w-full p-0.5 rounded bg-chipBackground
                    placeholder:font-light placeholder:text-sm text-md font-light
                    focus:outline-none bg-transparent border-b border-theme-chatDivider
                    text-theme-secondaryText placeholder:text-theme-emptyEvent"
                  type="text"
                  name="name"
                  value={Poll.name}
                  onChange={handleChange}
                  placeholder="Enter poll name"
                />
              </div>

              <div className="mb-4 w-full">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Ask a question
                </p>
                <input
                  id="question"
                  className="w-full p-0.5 rounded bg-chipBackground
                    placeholder:font-light placeholder:text-sm text-md font-light
                    focus:outline-none bg-transparent border-b border-theme-chatDivider
                    text-theme-secondaryText placeholder:text-theme-emptyEvent"
                  type="text"
                  name="question"
                  value={Poll.question}
                  onChange={handleChange}
                  placeholder="What's your poll about?"
                />
              </div>

              {Poll.choices.map((choice, index) => (
                <div key={index} className="mb-3 w-full">
                  <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                    Choice {index + 1}
                  </p>
                  <input
                    className="w-full p-0.5 rounded bg-chipBackground
                      placeholder:font-light placeholder:text-sm text-md font-light
                      focus:outline-none bg-transparent border-b border-theme-chatDivider
                      text-theme-secondaryText placeholder:text-theme-emptyEvent"
                    type="text"
                    value={Poll.choices[index]}
                    placeholder={`Response ${index + 1} `}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                  />
                </div>
              ))}

              {Poll.choices.length < MAX_CHOICES && (
                <button
                  onClick={handleAddChoice}
                  className="text-theme-secondaryText font-normal text-sm mt-2 mb-4"
                >
                  + Add Choice
                </button>
              )}
              <div className="mb-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Who can join this poll?
                </p>
                <div className="flex mt-3 items-center border border-theme-chatDivider rounded-md overflow-hidden w-max">
                  <button
                    type="button"
                    onClick={() => handletoggleChange("public")}
                    className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
                      Poll.type === "public"
                        ? "bg-theme-secondaryText text-theme-primaryBackground"
                        : "bg-transparent text-theme-secondaryText"
                    }`}
                  >
                    Everyone
                  </button>
                  <button
                    type="button"
                    onClick={() => handletoggleChange("private")}
                    className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
                      Poll.type === "private"
                        ? "bg-theme-secondaryText text-theme-primaryBackground"
                        : "bg-transparent text-theme-secondaryText"
                    }`}
                  >
                    Logged users
                  </button>
                </div>
              </div>

              <div className="mb-4 mt-2">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Who can view this poll?
                </p>
                <div className="flex flex-row mt-3 items-start space-x-3">
                  <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="anyone"
                      className="mr-2 custom-radio"
                      checked={Poll.visibility === "anyone"}
                      onChange={handleChange}
                    />
                    <span>Anyone</span>
                  </label>
                  <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="topic"
                      className="mr-2 custom-radio"
                      checked={Poll.visibility === "topic"}
                      onChange={handleChange}
                    />
                    <span>Only topic users</span>
                  </label>
                </div>
              </div>

              {/* <div className="mb-4 mt-2">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-1">
                  Show poll results -
                </p>
                <div className="flex flex-row mt-3 items-start space-x-3">
                  <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="showResults"
                      value="afterVote"
                      className="mr-2 custom-radio"
                      checked={Poll.showResults === "afterVote"}
                      onChange={() => handletoggleResults("afterVote")}
                    />
                    <span>After voting</span>
                  </label>
                  <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="showResults"
                      value="adminOnly"
                      className="mr-2 custom-radio"
                      checked={Poll.showResults === "adminOnly"}
                      onChange={() => handletoggleResults("adminOnly")}
                    />
                    <span>Admin only</span>
                  </label>
                </div>
              </div> */}

              <button
                className={`w-full mt-4 py-2.5 font-normal text-sm rounded-lg ${
                  isCreateDisabled
                    ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
                    : "bg-theme-secondaryText text-theme-primaryBackground"
                }`}
                disabled={isCreateDisabled}
                onClick={handleSubmit}
              >
                {Poll.buttonStatus===":loading"?"Creating...":"Create Poll"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PollModal;
