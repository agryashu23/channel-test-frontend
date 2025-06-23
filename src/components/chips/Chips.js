import { React, useState } from "react";
import SaveIcon from "../../assets/icons/save_icon.svg";
import SavedIcon from "../../assets/icons/favorite.svg";
import Upvote from "../../assets/icons/upvote.svg";
import UpvoteLight from "../../assets/lightIcons/upvote_light.svg";
import UpvotedLight from "../../assets/lightIcons/upvote_filled_light.svg";
import Upvoted from "../../assets/icons/upvoted.svg";
import ColorProfile from "../../assets/images/color_profile.svg";
import Send from "../../assets/icons/Send.svg";
import MetaCard from "./widgets/MetaCard";
import Comment from "../../assets/icons/Comment.svg";
import GoogleMapsCard from "./widgets/googleMapsCard";
import DateTimeCard from "./widgets/DateTime";
import ImageList from "./widgets/ImageList";
import RenderLink from "./widgets/videoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { upvoteChip, saveChip } from "./../../redux/slices/profileItemsSlice";
import useModal from "./../hooks/ModalHook";
import { domainUrl } from "./../../utils/globals";
import Initicon from "./../../widgets/InitIcon";
import { setChipEngagement } from "./../../redux/slices/chipEngagementSlice";
import DocumentPreview from "./widgets/DocumentPreview";
import Linkify from "react-linkify";
import { setCommentChip } from "./../../redux/slices/commentChipSlice";
import { useNavigate } from "react-router-dom";
import { getAppPrefix } from "../EmbedChannels/utility/embedHelper";

const Chips = ({ item }) => {
  const [isSavedMessageVisible, setSavedMessageVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { handleOpenModal } = useModal();
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = 250;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const openShareModal = () => {
    const linkToShare = `https://${domainUrl}/profile/${item.user?.username}/chip/${item._id}`;
    handleOpenModal("modalShareChipOpen", linkToShare);
    dispatch(setChipEngagement(item._id));
  };
  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
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
      dispatch(setChipEngagement(chipId));
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

  const isUpvoted = item.upvotes?.includes(myData?._id);
  const isSaved = item.saved_by?.includes(myData?._id);

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link text-theme-buttonEnable"
    >
      {text}
    </a>
  );
  return (
    <div className="container pl-4 pb-4 w-full pt-4 space-y-2.5 rounded-lg border border-theme-chatDivider bg-theme-tertiaryBackground">
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
      <p className="text-theme-profileColor text-sm mt-1 font-normal pr-4">
        {item.user?.name}
      </p>
      <div className="flex flex-col space-y-2.5">
        {
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
        }
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
        {item.metaLink && item.metaLink.ogTitle !== "" && (
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
          {isSavedMessageVisible && (
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg text-theme-secondaryText text-xs rounded-lg px-2 py-1">
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

export default Chips;
