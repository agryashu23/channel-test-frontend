import React, { useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import {
  FaFacebookF,
  FaTwitter,
  FaTelegramPlane,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import LinkIcon from "../../../assets/icons/link.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { setChannelField } from "../../../redux/slices/channelSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { domainUrl } from "./../../../utils/globals";
import { postRequestAuthenticated } from "../../../services/rest";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const expiryOptions = [
  { label: "1 Hour", value: "1h" },
  { label: "1 Day", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "Custom", value: "custom" },
];
const InviteModal = () => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [code, setCode] = useState("");
  const modals = useSelector((state) => state.modals);
  const [expiryOption, setExpiryOption] = useState("7d");
  const [customExpiry, setCustomExpiry] = useState("");
  const { type, channelId, topicId } = modals;
  const [usageLimit, setUsageLimit] = useState(100);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const username = useSelector((state) => state.modals.shareUsername);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    dispatch(closeModal("modalInviteOpen"));
    setCode("");
    setCodeGenerated(false);
    setUsageLimit(100);
    setExpiryOption("7d");
    setCustomExpiry("");
    setError("");
    setIsLoading(false);
  };
  const isOpen = useSelector((state) => state.modals.modalInviteOpen);
  let shareUrl;

  if (code) {
    if (type === "channel") {
      shareUrl = `https://${domainUrl}/account/${username}/channel/${channelId}?code=${code}`;
    } else if (type === "topic") {
      shareUrl = `https://${domainUrl}/account/${username}/channel/${channelId}/c-id/topic/${topicId}?code=${code}`;
    }
  } else {
    shareUrl = `https://${domainUrl}/account/${username}/channel/${channelId}`;
  }

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSharing = () => {
    // dispatch(shareChips(chipId));
  };

  const socialMediaLinks = [
    {
      icon: <FaFacebookF className="text-theme-secondaryText w-6 h-6" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      icon: <FaTwitter className="text-theme-secondaryText w-6 h-6" />,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    {
      icon: <FaTelegramPlane className="text-theme-secondaryText w-6 h-6" />,
      url: `https://t.me/share/url?url=${shareUrl}`,
    },
    {
      icon: <FaLinkedin className="text-theme-secondaryText w-6 h-6" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`,
    },
    {
      icon: <FaWhatsapp className="text-theme-secondaryText w-6 h-6" />,
      url: `https://api.whatsapp.com/send?text=${shareUrl}`,
    },
  ];

  const handleCreateInvite = async () => {
    if (usageLimit < 1) {
      setError("Usage limit must be at least 1");
      return;
    }
    if (expiryOption === "custom" && !customExpiry) {
      setError("Please select a date and time");
      return;
    }
    const expire_time =
      expiryOption === "custom"
        ? new Date(customExpiry).toISOString()
        : new Date(
            Date.now() +
              (expiryOption === "1h"
                ? 3600000
                : expiryOption === "24h"
                ? 86400000
                : expiryOption === "7d"
                ? 604800000
                : 604800000)
          ).toISOString();

    const payload = {
      id: type === "channel" ? channelId : topicId,
      usage_limit: Number(usageLimit),
      expire_time,
    };
    try {
      setIsLoading(true);
      const response = await postRequestAuthenticated(
        `/create/${type}/invite`,
        payload
      );
      console.log(response);
      setIsLoading(false);
      if (response.success) {
        setCode(response.invite.code);
        setCodeGenerated(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Dialog.Content
            className="bg-theme-tertiaryBackground rounded-xl overflow-visible shadow-xl transform transition-all w-[90%] md:w-3/5 lg:w-1/2 sm:w-3/4 xl:w-2/5 pt-5 pl-5 pr-1 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title />

            {codeGenerated ? (
              <>
                <div className="flex justify-between items-center mb-4 pr-3">
                  <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                    Spread the Magic
                  </h2>
                  <img
                    src={Close}
                    alt="Close"
                    className="w-4 h-4 cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                <p className="text-theme-secondaryText text-md mt-2 font-light font-inter">
                  Share this channel via
                </p>
                <div className="flex justify-start items-center  mt-4 flex-wrap">
                  {socialMediaLinks.map((social, index) => (
                    <a
                      key={index}
                      onClick={handleSharing}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-theme-primaryBackground mx-4 mb-4 p-2 xs:p-5 rounded-full text-theme-secondaryText"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <p className="text-theme-primaryText text-sm mt-2 text-center font-light font-inter">
                  Or
                </p>
                <div className="flex relative items-center mt-2 bgBackground rounded-md pr-4 pb-3 w-full">
                  <textarea
                    readOnly
                    value={shareUrl}
                    rows={type === "topic" ? "3" : "2"}
                    style={{ outline: "none", outlineOffset: "0" }}
                    className="bg-transparent pl-10 xs:pl-12 pr-14 xs:pr-20  border rounded-lg font-light border-theme-chatDivider
                   text-theme-secondaryText flex-grow text-xs xs:text-sm py-4 overflow-hidden resize-none"
                  />
                  <img
                    src={LinkIcon}
                    alt="link"
                    className="absolute left-2 xs:left-4 "
                  />
                  <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
                    <button className="absolute right-6  font-normal px-2 text-xs xs:text-sm py-1 bg-theme-secondaryText text-theme-primaryBackground rounded-md">
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </CopyToClipboard>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 pr-3">
                  <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                    Create {type} Invite
                  </h2>
                  <img
                    src={Close}
                    alt="Close"
                    className="w-4 h-4 cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                <div className="flex flex-col gap-4 mb-6 pr-4">
                  <div>
                    <label className="block text-theme-secondaryText text-sm mb-1">
                      Usage Limit of users
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border font-light focus:outline-none border-theme-chatDivider rounded-md py-2 px-3 bg-transparent text-theme-primaryText"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      placeholder="Enter number of allowed users"
                    />
                  </div>
                  <div className="relative w-full" ref={dropdownRef}>
                    <label className="block text-theme-secondaryText text-sm mb-1">
                      Expiry Time
                    </label>

                    <div
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="cursor-pointer flex justify-between items-center px-3 py-2 rounded-md border border-theme-chatDivider 
                                bg-theme-tertiaryBackground text-theme-primaryText font-light"
                    >
                      {expiryOptions.find((opt) => opt.value === expiryOption)
                        ?.label || "Select"}
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <ul
                        className="absolute z-10 w-full mt-1 rounded-md shadow-md bg-theme-secondaryBackground 
                                        border border-theme-chatDivider font-light"
                      >
                        {expiryOptions.map((option) => (
                          <li
                            key={option.value}
                            onClick={() => {
                              setExpiryOption(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-2 cursor-pointer font-light text-theme-secondaryText hover:bg-theme-primaryBackground 
                                            hover:text-theme-secondaryText transition-colors"
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {expiryOption === "custom" && (
                    <div className="w-full">
                      <label className="block text-theme-secondaryText text-sm mb-1">
                        Custom Expiry Date & Time
                      </label>
                      <DatePicker
                        selected={customExpiry ? new Date(customExpiry) : null}
                        onChange={(date) =>
                          setCustomExpiry(date?.toISOString() || "")
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        dateFormat="yyyy-MM-dd h:mm aa"
                        placeholderText="Select date & time"
                        className="w-full min-w-60 border focus:outline-none  mt-1 text-sm font-light border-theme-chatDivider rounded-md py-2 px-3 bg-theme-tertiaryBackground text-theme-primaryText"
                      />
                    </div>
                  )}

                  {error && (
                    <p className="text-theme-error text-sm font-light mt-1">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleCreateInvite}
                    className="mt-2 bg-theme-secondaryText text-theme-primaryBackground py-2 px-4 rounded-md font-normal"
                  >
                    {isLoading ? "Generating..." : "Generate Invite"}
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InviteModal;
