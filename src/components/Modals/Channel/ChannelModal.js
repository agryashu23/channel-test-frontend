import { React, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import Upload from "../../../assets/icons/Upload.svg";
import UploadLight from "../../../assets/lightIcons/upload_light.svg";
import Unsplash from "../../../assets/icons/Unsplash.svg";
import UnsplashLight from "../../../assets/lightIcons/unsplash_light.svg";
import { postRequestAuthenticated } from "./../../../services/rest";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  updateChannel,
  createChannel,
} from "../../../redux/slices/channelItemsSlice.js";
import {
  setCreateChannelField,
  createClearChannel,
} from "../../../redux/slices/createChannelSlice.js";
import { useNavigate } from "react-router-dom";
import Compressor from "compressorjs";
import { setAdminNotification } from "../../../redux/slices/notificationSlice";
import useModal from "./../../hooks/ModalHook";

const ChannelModal = () => {
  const { handleOpenModal } = useModal();
  const channel = useSelector((state) => state.createChannel);
  const Channelstatus = useSelector(
    (state) => state.channelItems.createChannelStatus
  );
  const myData = useSelector((state) => state.myData);

  const handleClose = () => {
    dispatch(createClearChannel());
    setNameError("");
    setPayError("");
    dispatch(closeModal("modalChannelOpen"));
  };

  const handleUnsplashModal = () => {
    handleOpenModal("modalChannelUnsplashOpen");
  };

  const [error, setError] = useState("");
  const [payError, setPayError] = useState("");

  const [nameError, setNameError] = useState("");
  const [file, setFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
                setCreateChannelField({
                  field: "cover_image",
                  value: reader.result,
                })
              );
              dispatch(
                setCreateChannelField({ field: "imageSource", value: "upload" })
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
            setCreateChannelField({
              field: "cover_image",
              value: reader.result,
            })
          );
          dispatch(
            setCreateChannelField({ field: "imageSource", value: "upload" })
          );
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert(
          `The file "${file.name}" exceeds the 20 MB size limit and will not be uploaded.`
        );
        return;
      }

      if (file.size > 7 * 1024 * 1024) {
        new Compressor(file, {
          quality: 0.5,
          maxWidth: 1920,
          maxHeight: 1080,
          success(result) {
            setLogoFile(result);
            const reader = new FileReader();
            reader.onloadend = () => {
              dispatch(
                setCreateChannelField({ field: "logo", value: reader.result })
              );
            };
            reader.readAsDataURL(result);
          },
          error(err) {
            alert("Image compression failed: " + err);
          },
        });
      } else {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(
            setCreateChannelField({ field: "logo", value: reader.result })
          );
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // const handleTagSelect = (tag) => {
  //   dispatch(setChannelTag(tag));
  // };

  // const onCustomClick = (tag) => {
  //   handleOpenModal("modalCustomTagOpen");
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCharCount(value.length);
    }
    if (name === "description") {
      setDescCount(value.length);
    } else if (name === "visibility" && value === "paid") {
      dispatch(setCreateChannelField({ field: "paywallPrice", value: 0 }));
    }
    dispatch(setCreateChannelField({ field: name, value }));
  };

  const checkChannelName = async (name) => {
    setNameError("");
    if (name !== "") {
      try {
        const response = await postRequestAuthenticated("/check/channel/name", {
          name,
        });
        if (response.success) {
          setNameError("");
          return true;
        } else {
          setNameError("Name already exist.");
          return false;
        }
      } catch (error) {
        setNameError(error);
        return false;
      }
    } else {
      setNameError("Name can't be empty");
      return false;
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError("");
    setNameError("");
    dispatch(
      setCreateChannelField({ field: "channelstatus", value: "loading" })
    );
    const isNameUnique = await checkChannelName(channel.name);
    if (!isNameUnique) {
      return;
    }

    if (channel.visibility === "paid" && channel.paywallPrice === 0) {
      setPayError("Joining fee can't be 0");
      return;
    }
    const name = channel.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("visibility", channel.visibility);
      formDataToSend.append("description", channel.description);
      formDataToSend.append("paywallPrice", channel.paywallPrice);
      if (logoFile && channel.logo) {
        formDataToSend.append("logo", logoFile);
      }
      if (file && channel.imageSource === "upload") {
        formDataToSend.append("cover_image", file);
      } else if (channel.cover_image && channel.imageSource === "unsplash") {
        formDataToSend.append("cover_image", channel.cover_image);
      }
      formDataToSend.append("imageSource", channel.imageSource);
      dispatch(createChannel(formDataToSend))
        .unwrap()
        .then((response) => {
          dispatch(createClearChannel());
          setFile(null);
          setError("");
          handleClose();
          if (response.limitReached) {
            dispatch(setAdminNotification(response));
            handleOpenModal("modalNotificationOpen");
          } else {
            navigate(
              `/account/${myData.username}/channel/${response.channel._id}`
            );
          }
        })
        .catch((error) => {
          setError(error.message || String(error));
        });
    }
  };

  const handleEditChannel = async (e) => {
    e.preventDefault();
    setError("");
    if (channel.visibility === "paid" && channel.paywallPrice === 0) {
      setPayError("Joining fee can't be 0");
      return;
    }
    const name = channel.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("_id", channel._id);
      formDataToSend.append("visibility", channel.visibility);
      formDataToSend.append("description", channel.description);
      formDataToSend.append("paywallPrice", channel.paywallPrice);
      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      } else if (channel.logo) {
        formDataToSend.append("logo", channel.logo);
      } else {
        formDataToSend.append("logo", "");
      }

      if (file && channel.imageSource === "upload") {
        formDataToSend.append("cover_image", file);
      } else if (channel.cover_image) {
        formDataToSend.append("cover_image", channel.cover_image);
      } else {
        formDataToSend.append("cover_image", "");
      }
      formDataToSend.append("imageSource", channel.imageSource);
      dispatch(updateChannel(formDataToSend))
        .unwrap()
        .then((response) => {
          handleClose();
          dispatch(createClearChannel());
          setFile(null);
          setError("");
          if (response.limitReached) {
            dispatch(setAdminNotification(response));
            handleOpenModal("modalNotificationOpen");
          } else {
            navigate(
              `/account/${myData.username}/channel/${response.channel._id}`
            );
          }
        })
        .catch((error) => {
          setError(error.message || String(error));
        });
    }
  };
  const channelNameError = useSelector(
    (state) => state.createChannel.channelNameError
  );

  const handleImageClear = () => {
    dispatch(setCreateChannelField({ field: "cover_image", value: null }));
    dispatch(setCreateChannelField({ field: "imageSource", value: "" }));
    setFile(null);
  };
  const handleLogoClear = () => {
    dispatch(setCreateChannelField({ field: "logo", value: null }));
    setLogoFile(null);
  };

  const [charCount, setCharCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const maxChars = 60;
  const maxDesc = 500;
  const isNameEmpty = channel.name.trim() === "";
  const buttonClass = isNameEmpty
    ? "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
    : "bg-theme-secondaryText text-theme-primaryBackground";

  const isOpen = useSelector((state) => state.modals.modalChannelOpen);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[90%] overflow-y-auto custom-scrollbar w-[90%] xs:w-3/4 sm:w-3/5 md:w-1/2 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  {channel.isEdit ? "Edit Channel" : "New Channel"}
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
                  <p className="text-theme-secondaryText text-sm font-light font-inter">
                    Name of the channel
                  </p>
                  <div className="text-theme-subtitle text-xs font-light font-inter">
                    {charCount}/{maxChars}
                  </div>
                </div>
                <input
                  id="channel-name"
                  className="w-full mt-2 p-1 rounded bg-transparent border-b border-theme-chatDivider font-light text-sm
                   placeholder:font-light placeholder:text-sm text-theme-secondaryText focus:outline-none placeholder:text-theme-placeholder"
                  type="text"
                  name="name"
                  value={channel.name}
                  onChange={handleChange}
                  maxLength={maxChars}
                  autoComplete="off"
                  placeholder="Enter the name of your community here"
                />
                {nameError && (
                  <p
                    className={`text-theme-error font-light ml-1 font-inter text-xs`}
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div className="relative mb-2">
                <p className="text-theme-secondaryText text-sm font-light font-inter">
                  Describe this channel
                </p>
                <p className="text-theme-emptyEvent text-xs font-light font-inter mb-2">
                  A good description can get you focused audience.
                </p>
                <textarea
                  value={channel.description}
                  onChange={handleChange}
                  name="description"
                  maxLength={maxDesc}
                  className="w-full text-sm pt-2 font-inter pb-3 pl-4 pr-3 bg-transparent rounded-lg border font-light border-theme-chatDivider 
                   text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none placeholder:text-secondaryText"
                  rows="2"
                  placeholder="Add a description"
                />
                <div className="text-right font-light absolute right-2 bottom-3 text-xs text-theme-subtitle">
                  {descCount}/{maxDesc}
                </div>
              </div>

              {
                <div className="mb-4 mt-1">
                  <p className="text-theme-secondaryText text-sm font-light font-inter">
                    Who can access this channel?
                  </p>
                  <div className="flex flex-col mt-3 items-start space-y-3">
                    <label
                      className={`${
                        channel.visibility === "anyone"
                          ? "text-theme-secondaryText"
                          : "text-theme-primaryText"
                      } text-sm font-light flex-row items-center`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="anyone"
                        className="mr-2 custom-radio"
                        checked={channel.visibility === "anyone"}
                        onChange={handleChange}
                      />
                      <span>Anyone (anyone can join)</span>
                    </label>
                    <label
                      className={`${
                        channel.visibility === "invite"
                          ? "text-theme-secondaryText"
                          : "text-theme-primaryText"
                      } text-sm font-light flex-row items-center`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="invite"
                        className="mr-2 custom-radio"
                        checked={channel.visibility === "invite"}
                        onChange={handleChange}
                      />
                      <span>Invite only (access with invited tickets)</span>
                    </label>
                    <label
                      className={`${
                        channel.visibility === "paid"
                          ? "text-theme-secondaryText"
                          : "text-theme-primaryText"
                      } text-sm font-light flex-row items-center`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="paid"
                        className="mr-2 custom-radio"
                        checked={channel.visibility === "paid"}
                        onChange={handleChange}
                      />
                      <span>Paid (access with paid tickets)</span>
                    </label>
                  </div>
                </div>
              }
              {channel.visibility === "paid" && (
                <div className="mb-4 mt-1">
                  <label className="text-theme-secondaryText text-sm font-light font-inter">
                    Access ticket amount inclusive of tax.
                  </label>
                  <div className="flex flex-row items-center">
                    <p className="text-theme-secondaryText text-sm font-light font-inter mr-0.5 mt-1.5">
                      ₹
                    </p>
                    <input
                      id="channel-name"
                      className="w-full mt-1.5 p-1 rounded bg-transparent border-b border-theme-chatDivider font-light text-sm
                    placeholder:font-light placeholder:text-sm text-theme-secondaryText focus:outline-none placeholder:text-theme-placeholder"
                      type="number"
                      name="paywallPrice"
                      value={channel.paywallPrice}
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Enter the joining fee for your channel."
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
              <div className="mb-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter">
                  Add your community's logo{" "}
                  <span className="italic">(optional)</span>
                </p>
                {!channel.logo && (
                  <div className="relative border border-theme-chatDivider w-1/2 px-2 py-3 mt-3 rounded-xl cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
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
                      <p className="text-theme-secondaryText text-sm font-light font-inter">
                        Upload image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                )}
                {channel.logo && (
                  <div className="relative mt-3">
                    <img
                      src={channel.logo}
                      alt="channel-image"
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <div className="absolute right-0 top-0 bg rounded-full w-6 h-6 flex justify-center items-center border">
                      <img
                        src={Close}
                        alt="close"
                        className="w-4 h-4 cursor-pointer"
                        onClick={handleLogoClear}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-theme-secondaryText text-sm font-light font-inter">
                  Add cover image to this channel
                </p>
                {!channel.cover_image && (
                  <div className="flex flex-row mt-3">
                    <div className="relative border border-theme-chatDivider w-1/2 px-2 py-4 rounded-xl cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
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
                        <p className="text-theme-secondaryText text-sm font-light font-inter">
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
                        <p className="text-theme-secondaryText text-sm text-center font-light font-inter">
                          Select from Unsplash
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {channel.cover_image && (
                  <div className="relative mt-3">
                    <img
                      src={channel.cover_image}
                      alt="channel-image"
                      className="w-full h-36 object-cover rounded-xl"
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

              {/* <div className="mb-4">
                <p className="text-theme-secondaryText text-sm font-normal font-inter">
                  Select tags for saving resources shared in this channel. You
                  can create custom tags as well. Example: Project 1
                </p>
                <p className="text-theme-subtitle text-sm font-normal mt-1 font-inter">
                  Tags can make it easier for your audience to look for relevant
                  resources
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag, index) =>
                  tag !== "Custom" ? (
                    <button
                      key={index}
                      className={`px-3 py-0.5 rounded-full text-xs font-normalight  ${
                        channel.tags.includes(tag)
                          ? "bg-theme-secondaryText text-theme-primaryBackground font-normal "
                          : "bg-transparent border border-theme-secondaryText text-theme-secondaryText"
                      }`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </button>
                  ) : (
                    <div
                      key={index}
                      className={`px-3 py-0.5 items-center rounded-full text-xs flex flex-row font-normalight cursor-pointer
                         ${"bg-transparent border border-theme-secondaryText text-theme-secondaryText"}`}
                      onClick={() => onCustomClick(tag)}
                    >
                      <p className="text-lg mr-1 mb-0.5">+</p>
                      <p>{tag}</p>
                    </div>
                  )
                )}
              </div> */}

              {channelNameError && (
                <div className="my-2 text-errorLight font-light text-sm">
                  {error}
                </div>
              )}
              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={
                  channel.isEdit ? handleEditChannel : handleCreateChannel
                }
              >
                {Channelstatus === "loading"
                  ? "Please wait..."
                  : channel.isEdit
                  ? "Save Changes"
                  : "Create new channel"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChannelModal;
