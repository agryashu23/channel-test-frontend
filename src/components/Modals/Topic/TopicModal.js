import { React, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { postRequestAuthenticated } from "./../../../services/rest";
import { useSelector, useDispatch } from "react-redux";
import useModal from "./../../hooks/ModalHook";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  setCreateTopicField,
  clearCreateTopic,
  createTopic,
  updateTopic,
} from "../../../redux/slices/createTopicSlice.js";
import { useNavigate } from "react-router-dom";
import { setAdminNotification } from "../../../redux/slices/notificationSlice";

const TopicModal = () => {
  const topic = useSelector((state) => state.createTopic);
  const Topicstatus = useSelector((state) => state.channelItems.topicstatus);
  const [error, setError] = useState("");
  const [payError, setPayError] = useState("");
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(clearCreateTopic());
    setError("");
    setPayError("");
    dispatch(closeModal("modalTopicOpen"));
  };
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCharCount(value.length);
    }
    dispatch(setCreateTopicField({ field: name, value: value }));
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setError("");
    if (topic.visibility === "paid" && (topic.paywallPrice === "0" || topic.paywallPrice===0 || topic.paywallPrice.length===0)) {
      setPayError("Joining fee can't be 0");
      return;
    }
    const name = topic.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("editability", topic.editability);
      formDataToSend.append("channel", topic.channel);
      formDataToSend.append("visibility", topic.visibility);

      formDataToSend.append("paywallPrice", topic.paywallPrice);
      dispatch(createTopic(formDataToSend))
        .unwrap()
        .then((response) => {
          handleClose();
          dispatch(clearCreateTopic());
          setError("");
          if (response.success && response.limitReached) {
            dispatch(setAdminNotification(response));
            handleOpenModal("modalNotificationOpen");
          }
          // else{
          //   navigate(`/account/${myData.username}/channel/${response.channel._id}`);
          // }
        })
        .catch((error) => {
          setError(error.message || String(error));
        });
    }
  };
  const handleEditTopic = async (e) => {
    e.preventDefault();
    setError("");
    console.log(topic.paywallPrice);
    if (topic.visibility === "paid" && (topic.paywallPrice === "0" || topic.paywallPrice===0 || topic.paywallPrice.length===0)) {
      setPayError("Joining fee can't be 0");
      return;
    }
    const name = topic.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("_id", topic._id);
      formDataToSend.append("editability", topic.editability);
      formDataToSend.append("visibility", topic.visibility);
      formDataToSend.append("paywallPrice", topic.paywallPrice);
      dispatch(updateTopic(formDataToSend))
        .unwrap()
        .then((response) => {
          handleClose();
          dispatch(clearCreateTopic());
          setError("");
          if (response.success && response.limitReached) {
            dispatch(setAdminNotification(response));
            handleOpenModal("modalNotificationOpen");
          }
        })
        .catch((error) => {
          setError(error.message || String(error));
        });
    }
  };
  const topicNameError = useSelector((state) => state.topic.channelNameError);

  const [charCount, setCharCount] = useState(0);
  const maxChars = 30;
  const isNameEmpty = topic.name.trim() === "";
  const buttonClass = isNameEmpty
    ? "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
    : "bg-theme-secondaryText text-theme-primaryBackground";

  const isOpen = useSelector((state) => state.modals.modalTopicOpen);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[90%] overflow-y-auto custom-scrollbar w-[90%] xs:w-[80%] sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-[35%]">
            <Dialog.Title />
            <div className="flex flex-col sm:p-5 p-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  New Topic
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mb-4">
                <div className="flex flex-row justify-between">
                  <p className="text-theme-secondaryText text-sm font-normal font-inter">
                    Name of the topic
                  </p>
                  <div className="text-theme-subtitle text-xs font-light font-inter">
                    {charCount}/{maxChars}
                  </div>
                </div>
                <input
                  id="topic-name"
                  className="w-full mt-2 p-1 rounded bg-transparent border-b border-theme-chatDivider text-sm font-light
                   placeholder:font-light placeholder:text-sm text-theme-secondaryText focus:outline-none placeholder:text-theme-placeholder"
                  type="text"
                  name="name"
                  value={topic.name}
                  onChange={handleChange}
                  maxLength={maxChars}
                  autoComplete="off"
                  placeholder="Enter topic of discussion"
                />
                {error && (
                  <p
                    className={`text-theme-error font-light ml-1 font-inter text-xs`}
                  >
                    {error}
                  </p>
                )}
              </div>

              {
                <div className="mb-4 mt-1">
                  <p className="text-theme-secondaryText text-sm font-normal font-inter">
                    Who can view this topic?
                  </p>
                  <div className="flex flex-col mt-3 items-start space-y-3">
                    <label className="text-theme-primaryText text-sm font-normal flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="anyone"
                        className="mr-2 custom-radio"
                        checked={topic.visibility === "anyone"}
                        onChange={handleChange}
                      />
                      <span>
                        Anyone in channel (Anyone in channel can join)
                      </span>
                    </label>
                    <label className="text-theme-primaryText text-sm font-normal flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="invite"
                        className="mr-2 custom-radio"
                        checked={topic.visibility === "invite"}
                        onChange={handleChange}
                      />
                      <span>Invite only (Admin approval required)</span>
                    </label>
                    <label className="text-theme-primaryText text-sm font-normal flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="paid"
                        className="mr-2 custom-radio"
                        checked={topic.visibility === "paid"}
                        onChange={handleChange}
                      />
                      <span>Paid (Access with paid tickets)</span>
                    </label>
                  </div>
                </div>
              }
              {topic.visibility === "paid" && (
                <div className="mb-4 mt-1">
                  <label className="text-theme-secondaryText text-sm font-light font-inter">
                    Access ticket amount inclusive of tax.
                  </label>
                  <div className="flex flex-row items-center">
                    <p className="text-theme-secondaryText text-sm font-light font-inter mr-0.5 mt-1.5">
                      ₹
                    </p>
                    <input
                      id="topic-name"
                      className="w-full mt-1.5 p-1 rounded bg-transparent border-b border-theme-chatDivider font-light text-sm
                    placeholder:font-light placeholder:text-sm text-theme-secondaryText focus:outline-none placeholder:text-theme-placeholder"
                      type="number"
                      name="paywallPrice"
                      value={topic.paywallPrice??""}
                      onChange={handleChange}
                      placeholder="Enter the joining fee for your topic."
                    />
                  </div>
                </div>
              )}
              {payError && (
                <p
                  className={`text-theme-error font-light ml-1 font-inter text-xs`}
                >
                  {payError}
                </p>
              )}
              <div className="mb-4 mt-1">
                <p className="text-theme-secondaryText text-sm font-normal font-inter">
                  Who can write in this topic?
                </p>
                <div className="flex mt-3 items-center sm:space-x-6 space-x-4">
                  <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="editability"
                      value="anyone"
                      className="mr-2 custom-radio"
                      checked={topic.editability === "anyone"}
                      onChange={handleChange}
                    />
                    <span>Anyone</span>
                  </label>
                  <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="editability"
                      value="invite"
                      className="mr-2 custom-radio"
                      checked={topic.editability === "invite"}
                      onChange={handleChange}
                    />
                    <span>Admin only</span>
                  </label>
                  {/* <label className="text-theme-primaryText text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="editability"
                      value="me"
                      className="mr-2 custom-radio"
                      checked={topic.editability === "me"}
                      onChange={handleChange}
                    />
                    <span>Only me</span>
                  </label> */}
                </div>
              </div>

              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={topic.isEdit ? handleEditTopic : handleCreateTopic}
              >
                {Topicstatus === "loading"
                  ? "Please wait..."
                  : topic.isEdit
                  ? "Save Changes"
                  : "Create topic"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TopicModal;
