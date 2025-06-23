import React, { useState, useRef, useEffect } from "react";
import SaveIcon from "../../assets/icons/save_icon.svg";
import SavedIcon from "../../assets/icons/favorite.svg";
import Upvote from "../../assets/icons/upvote.svg";
import Upvoted from "../../assets/icons/upvoted.svg";
import Edit from "../../assets/icons/Edit.svg";
import Delete from "../../assets/icons/Delete.svg";
import EditLight from "../../assets/lightIcons/edit_light.svg";
import DeleteLight from "../../assets/lightIcons/delete_light.svg";
import UpvoteLight from "../../assets/lightIcons/upvote_light.svg";
import UpvotedLight from "../../assets/lightIcons/upvote_filled_light.svg";
import ColorProfile from "../../assets/images/color_profile.svg";
import Send from "../../assets/icons/Send.svg";
import Comment from "../../assets/icons/Comment.svg";
import MetaCard from "./widgets/MetaCard";
import Linkify from "react-linkify";
import GoogleMapsCard from "./widgets/googleMapsCard";
import DateTimeCard from "./widgets/DateTime";
import RenderLink from "./widgets/videoPlayer";
import Initicon from "./../../widgets/InitIcon";
import { upvoteChip, saveChip } from "./../../redux/slices/profileItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import useModal from "./../hooks/ModalHook";
import { setChipIdToDelete } from "../../redux/slices/deleteChipSlice";
import { setEditChipData } from "./../../redux/slices/editChipSlice";
import { domainUrl } from "./../../utils/globals";
import ImageList from "./widgets/ImageList";
import { setChipEngagement } from "./../../redux/slices/chipEngagementSlice";
import DocumentPreview from "./widgets/DocumentPreview";
import { setCommentChip } from "./../../redux/slices/commentChipSlice";
import { useNavigate } from "react-router-dom";
import { updateItemField } from "./../../redux/slices/pushItemsSlice";
import { getAppPrefix } from "../EmbedChannels/utility/embedHelper";
const CurationChips = ({ item, owner }) => {
  // const fileUrl = "../../assets/yashu.pdf";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSavedMessageVisible, setSavedMessageVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const dropdownRef = useRef(null);
  const { handleOpenModal } = useModal();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };

  const openShareModal = () => {
    const linkToShare = `https://${domainUrl}/profile/${item.user?.username}/chip/${item._id}`;
    handleOpenModal("modalShareChipOpen", linkToShare);
    dispatch(setChipEngagement(item._id));
  };

  const openCommentModal = () => {
    if (isLoggedIn) {
      dispatch(setCommentChip(item));
      setTimeout(() => {
        handleOpenModal("modalCommentOpen");
      }, 0);
    } else {
      navigate(
        `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${
          item.user.username
        }/profile?tab=curations`
      );
    }
  };

  const handleUpvote = () => {
    if (isLoggedIn) {
      dispatch(upvoteChip(item._id));
      dispatch(setChipEngagement(item._id));
    } else {
      navigate(
        `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${
          item.user.username
        }/profile?tab=curations`
      );
    }
  };
  const handleSaved = () => {
    if (isLoggedIn) {
      const chipId = item._id;
      const curationId = null;
      const originId = item.curation;
      dispatch(saveChip({ chipId, curationId, originId }));
      dispatch(setChipEngagement(item._id));
      setSavedMessageVisible(true);
      if (isSaved) {
        setSavedMessage("Unsaved!");
      } else {
        setSavedMessage("Saved!");
      }
      setTimeout(() => {
        setSavedMessageVisible(false);
      }, 1000);
    } else {
      openLoginModal();
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDeleteModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      dispatch(setChipIdToDelete(item._id));
      handleOpenModal("modalChipDeleteOpen");
    } else {
      openLoginModal();
    }
  };

  const handleEditModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      dispatch(setEditChipData(item));
      handleOpenModal("modalChipEditOpen");
    } else {
      openLoginModal();
    }
  };

  const handlePushCurationModal = () => {
    setIsDropdownOpen(false);
    dispatch(updateItemField({ field: "id", value: item._id }));
    dispatch(
      updateItemField({ field: "existingCurationId", value: item.curation })
    );
    handleOpenModal("modalPushtoCurationOpen");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isUpvoted = item.upvotes.includes(myData?._id);
  const isSaved = item.saved_by.includes(myData?._id);
  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link text-metaLink"
    >
      {text}
    </a>
  );

  return (
    <div className="container pl-4 pb-4 w-full pt-4 rounded-lg space-y-2.5 border border-theme-chatDivider bg-theme-tertiaryBackground">
      <div className="flex flex-row justify-between">
        <div
          className="cursor-pointer w-max"
          onClick={() => navigate(`/profile/${item.user.username}`)}
        >
          {item.user?.logo ? (
            <img
              src={item.user.logo}
              alt="Curation"
              className=" w-11 h-11 rounded-xl mr-1.5 object-cover"
            />
          ) : item.user?.color_logo ? (
            <div
              className="rounded-full w-11 h-11 mxr-1.5 shrink-0  flex items-center justify-center"
              style={{ backgroundColor: item.user?.color_logo }}
            >
              <img src={ColorProfile} alt="color-profile" className="w-6 h-6" />
            </div>
          ) : (
            <Initicon text={item.user.name} size={42} />
          )}
        </div>
        {owner ? (
          <div className="flex items-center justify-end mr-4 relative">
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
              <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
              <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
            </div>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-8 right-0 w-max rounded-md shadow-lg border
                 border-theme-chatDivider bg-theme-tertiaryBackground  ring-1 ring-black ring-opacity-5 z-50"
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div
                    className="flex flex-row px-4 items-center"
                    onClick={handleEditModal}
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
                    onClick={handleDeleteModal}
                  >
                    <img
                      src={Delete}
                      alt="delete"
                      className="dark:block hidden w-4 h-4"
                    />
                    <img
                      src={DeleteLight}
                      alt="delete"
                      className="dark:hidden w-4 h-4"
                    />
                    <p
                      className="block  ml-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                      role="menuitem"
                    >
                      Delete
                    </p>
                  </div>
                  <div
                    className="flex flex-row px-3 items-center"
                    onClick={handlePushCurationModal}
                  >
                    <img src={Send} alt="push-curation" className="w-4 h-4" />
                    <p
                      className="block  ml-1 py-2 text-sm text-theme-secondaryText cursor-pointer"
                      role="menuitem"
                    >
                      Push to Curation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <p className="text-theme-profileColor text-sm mt-1 font-light pr-4">
        {item.user.name}
      </p>
      <div className="flex flex-col space-y-2.5">
        <Linkify componentDecorator={componentDecorator}>
          <div className="w-full pr-1 overflow-hidden">
            <p className="text-theme-secondaryText text-sm font-light font-inter whitespace-pre-wrap break-words">
              {isExpanded
                ? item.text
                : `${item.text.slice(0, maxLength)}${
                    item.text.length > maxLength ? "..." : ""
                  }`}
              {item.text.length > maxLength && (
                <span
                  onClick={toggleReadMore}
                  className="text-theme-secondaryText cursor-pointer ml-1"
                >
                  {isExpanded ? "<- Show Less" : "Read More ->"}
                </span>
              )}
            </p>
          </div>
        </Linkify>
        {item.date.date && item.date.event && <DateTimeCard item={item.date} />}
        {item.location.text && <GoogleMapsCard item={item.location} />}
        <div className="mr-4">
          {item.document && item.document.url && (
            <DocumentPreview document={item.document} />
          )}
        </div>
        {item.link && !item.metaLink?.ogTitle && <RenderLink url={item.link} />}
        {item.image_urls.length !== 0 && (
          <ImageList imageCards={item.image_urls} />
        )}
        {item.metaLink && item.metaLink?.ogTitle !== "" && (
          <MetaCard
            title={item.metaLink.ogTitle}
            description={item.metaLink.ogDescription}
            imageUrl={item.metaLink.ogImage}
            link={item.link}
          />
        )}
      </div>
      <div className="ml-1 mt-3 flex flex-row justify-between items-center mr-4">
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={handleUpvote}
        >
          <img
            src={isUpvoted ? Upvoted : Upvote}
            alt="Upvote"
            className="dark:block hidden mr-0.5 h-5 w-5"
          />
          <img
            src={isUpvoted ? UpvotedLight : UpvoteLight}
            alt="Upvote"
            className="dark:hidden mr-0.5 h-5 w-5"
          />
          <p className="text-theme-secondaryText text-sm font-light">
            {item.upvotes.length}
          </p>
        </div>
        <div
          className="flex flex-row items-center mt-0.5 cursor-pointer"
          onClick={openCommentModal}
        >
          <img src={Comment} alt="Comment" className="mr-0.5" />
          <p className="text-theme-secondaryText text-sm font-light">
            {item.comments ? item?.comments : 0}
          </p>
        </div>
        <div
          className="flex flex-row items-center mt-0.5 cursor-pointer"
          onClick={openShareModal}
        >
          <img src={Send} alt="Send" className="mr-0.5 h-7 w-7" />
          <p className="text-theme-secondaryText text-sm font-light">
            {item.shared_by ? item.shared_by : ""}
          </p>
        </div>
        {/* <div className="relative">
          {" "}
          {isSavedMessageVisible && (
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg text-theme-secondaryText text-xs rounded-lg px-2 py-1">
              {savedMessage}
            </div>
          )}
          <div
            className={`${
              isSaved ? "" : "bg-theme-chatDivider"
            } px-2 py-0.5 rounded-xl cursor-pointer`}
            onClick={handleSaved}
          >
            <img
              src={isSaved ? SavedIcon : SaveIcon}
              alt="save"
              className="h-5 w-5"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CurationChips;
