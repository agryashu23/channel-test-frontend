import ProfileForm from "./FormProfile/ProfileForm";
import ProfileCarousel from "./Widgets/ProfileCarousel";
import UnsplashModal from "./../Modals/UnsplashModal";
import {
  fetchProfile,
  selectProfileStatus,
} from "./../../redux/slices/profileSlice";
import ProfileSkeleton from "./../skeleton/profileSkeleton";
import { updateProfileField } from "../../redux/slices/profileSlice";
import { fetchChannels } from "../../redux/slices/channelItemsSlice";
import { Outlet } from "react-router-dom";
import EmptyProfileCard from "./Widgets/EmptyProfileCard";
import { domainUrl } from "./../../utils/globals";
import { setProfileEngagement } from "./../../redux/slices/profileEngagementSlice";
import Others from "../../assets/icons/Subtract.svg";
import DarkOther from "../../assets/lightIcons/browser_light.svg";
import ThreadsLight from "../../assets/lightIcons/threads_light.svg";
import Linkify from "react-linkify";
import ChannelsTab from "./profileTabs/ChannelsTab";
import CurationsTab from "./profileTabs/CurationsTab";
import FaqsTab from "./profileTabs/FaqsTab";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";
import { ChannelImages } from "../constants/images";

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
  postRequestUnAuthenticated,
  hostUrl,
  isEmbeddedOrExternal,
} from "../../globals/imports";

const Profile = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDomainExist, setIsDomainExist] = useState(true);
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const { username } = useParams();
  const profileStatus = useSelector(selectProfileStatus);
  const profileData = useSelector((state) => state.profileData);
  const isOwner = myData?.username === username;
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const maxLength = 350;
  const searchParams = new URLSearchParams(location.search);
  const accept = searchParams.get("accept");
  const channelId = searchParams.get("channelId");
  const userId = searchParams.get("userId");
  const [inviteModal, setInviteModal] = useState(true);
  const channelName = searchParams.get("channelName");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeTab, setActiveTab] = useState("channels");
  const tabs = [
    { id: 1, name: "Channels", href: "channels" },
    { id: 2, name: "Curations", href: "curations" },
    { id: 3, name: "FAQs", href: "faqs" },
  ];

  const handleTabClick = (event, href) => {
    event.preventDefault();
    const scrollY = window.scrollY;
    setActiveTab(href);
    if (href === "channels") {
      window.history.pushState(null, "", window.location.pathname);
    } else {
      window.history.pushState(null, "", `?tab=${href}`);
    }
    window.scrollTo(0, scrollY);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "curations" || tab === "faqs") {
      setActiveTab(tab);
    } else {
      setActiveTab("channels"); // default
    }
  }, []);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

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

  useEffect(() => {
    const checkSubdomainExists = async (subdomain) => {
      try {
        const response = await postRequestUnAuthenticated(`/username/exist`, {
          username: subdomain,
        });
        if (response.success) {
          dispatch(fetchProfile(username));
          // const formData = new FormData();
          // formData.append("user_id", myUserId || null);
          // formData.append("username",username);
          dispatch(fetchChannels({user_id:myUserId,username:username}));
        } else {
          setIsDomainExist(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking subdomain:", error);
        setIsLoading(false);
        setIsDomainExist(false);
      }
    };
    checkSubdomainExists(username);
  }, [username]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
      setIsDropdownOpen2(false);
    }
  };

  const openUnsplashModal = () => setIsUnsplashModalOpen(true);
  const closeUnsplashModal = () => setIsUnsplashModalOpen(false);

  const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const openShareModal = (link) => {
    handleOpenModal("modalShareProfileOpen", link);
    dispatch(setProfileEngagement(profileData._id));
  };

  const handleEditCards = () => {
    dispatch(updateProfileField({ name: "activeTab", value: "displayCards" }));
    setIsBottomSheetOpen(true);
  };
  const handleInviteAccept = () => {
    setLoading(true);
    fetch(
      `${hostUrl}/api/accept/channel/invite?channelId=${channelId}&userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);

        setInviteModal(false);
        if (data.success) {
          setMessage("You have successfully accepted the channel invite!");
        } else {
          setMessage(data.message || "Failed to accept the invite.");
        }
      })
      .catch((error) => {
        setMessage("An error occurred while processing your request.");
        setInviteModal(false);
      });
  };
  const handleDeclineAccept = () => {
    setLoading(true);
    fetch(
      `${hostUrl}/api/decline/channel/invite?channelId=${channelId}&userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setInviteModal(false);
        if (data.success) {
          setMessage("You have successfully declined the channel invite!");
        } else {
          setMessage(data.message || "Failed to decline the invite.");
        }
      })
      .catch((error) => {
        setMessage("An error occurred while processing your request.");
        setInviteModal(false);
      });
  };

  // const handleNewsletterPage = () => {
  //   navigate(`/${myData?.username}/newsletter`);
  // };

  const handleMessageClick = () => {
    if (isLoggedIn && myData?.username) {
      navigate(
        `${getAppPrefix()}/account/${myData.username}/messages/list/${
          profileData.username
        }`
      );
    } else {
      navigate(
        `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${
          profileData.username
        }/profile`
      );
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!isDomainExist) {
    navigate(`/account/${username}/profile/404`);
    return;
  }
  const isInvite =
    inviteModal &&
    accept === "invitechannel" &&
    channelName !== "" &&
    channelId !== "" &&
    userId !== "";

  const hasImages = profileData.imageCards.length !== 0;

  return (
    <div
      className={`w-full pt-4 px-4 h-screen bg-theme-secondaryBackground overflow-y-auto custom-scrollbar relative`}
      onClick={handleClickOutside}
    >
      {isEmbeddedOrExternal() && (
        <div className="sm:hidden flex absolute left-6 top-6 text-theme-secondaryText">
          <img
            src={ChannelImages.ArrowBack.default}
            alt="arrow-back"
            className="dark:block hidden text-theme-secondaryText w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <img
            src={ChannelImages.ArrowBackLight.default}
            alt="arrow-back"
            className="dark:hidden text-theme-secondaryText w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
      )}
      {isInvite && (
        <div
          className="absolute z-60 top-0 -left-1 w-full flex flex-col bg-theme-primaryBackground  px-4 pt-2 pb-3 border-b
         border-theme-chatDivider"
        >
          <p className="text-theme-secondaryText font-normal text-sm">
            {loading
              ? "Processing... Please wait."
              : `This user requests to join the ${channelName} channel. Your decision?`}
          </p>
          <div className="flex flex-row mt-2">
            <button
              className="cursor-pointer rounded-md py-1 px-2 text-theme-primaryBackground bg-theme-secondaryText font-light text-sm"
              onClick={handleInviteAccept}
            >
              Accept Invite
            </button>
            <button
              className="cursor-pointer ml-3 border rounded-md px-2 py-1 border-theme-secondaryText 
              text-theme-secondaryText font-light text-sm"
              onClick={handleDeclineAccept}
            >
              Decline
            </button>
          </div>
        </div>
      )}
      {profileStatus === "loading" ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="">
            <div
              className={`${
                isOwner || hasImages ? "md:bg-theme-tertiaryBackground" : ""
              }  rounded-lg lg:px-6 md:px-4 px-0 py-4 sm:py-6 w-full`}
            >
              <div
                className={`flex flex-col rounded-md md:flex-row ${
                  isOwner || hasImages
                    ? "items-center md:justify-between justify-center"
                    : "items-center justify-center"
                } `}
              >
                <div
                  className={`md:w-2/5 w-full flex flex-col ${
                    isOwner || hasImages
                      ? "md:justify-start md:items-start justify-center items-center"
                      : "justify-center items-center"
                  }  mb-4`}
                >
                  {profileData.logo ? (
                    <img
                      src={profileData.logo}
                      alt="Profile"
                      className="rounded-full w-24 h-24 border border-theme-white object-cover"
                      style={{ borderWidth: "2px" }}
                    />
                  ) : profileData.color_logo ? (
                    <div
                      className="rounded-full w-24 h-24 border border-theme-white shrink-0  flex items-center justify-center"
                      style={{ backgroundColor: profileData?.color_logo }}
                    >
                      <img
                        src={ChannelImages.ColorProfile.default}
                        alt="color-profile"
                        className="w-12 h-12"
                      />
                    </div>
                  ) : (
                    <img
                      src={ChannelImages.ProfileIcon.default}
                      alt="Profile"
                      className="rounded-full w-24 h-24 bg-theme-chatDivider border border-theme-secondaryText p-6 object-cover"
                    />
                  )}
                  <div
                    className={`mt-1   ${
                      isOwner || hasImages ? "profile-text" : "text-center"
                    }`}
                  >
                    <p
                      className={`sm:text-2xl text-xl  text-theme-secondaryText font-normal font-inter`}
                    >
                      {profileData.name}
                    </p>
                    <p className="mt-1 text-xs font-light text-theme-emptyEvent font-inter">
                      {profileData.username}.{domainUrl}
                    </p>

                    {
                      <Linkify componentDecorator={componentDecorator}>
                        <p
                          className="mt-2 text-sm font-light text-theme-emptyEvent whitespace-pre-wrap 
                        overflow-hidden overflow-wrap break-word"
                        >
                          {isExpanded
                            ? profileData.description
                            : `${profileData.description.slice(0, maxLength)}${
                                profileData.description.length > maxLength
                                  ? "..."
                                  : ""
                              }`}
                          {profileData.description.length > maxLength && (
                            <span
                              onClick={toggleReadMore}
                              className="text-theme-secondaryText cursor-pointer ml-1"
                            >
                              {isExpanded ? (
                                <>
                                  <img
                                    src={ChannelImages.ArrowBack.default}
                                    alt="Show Less"
                                    className="inline-block w-4 h-4"
                                  />
                                  <span className="ml-1">Show Less</span>
                                </>
                              ) : (
                                <>
                                  <span className="mr-1">Read More</span>
                                  <img
                                    src={ChannelImages.ArrowForward.default}
                                    alt="Read More"
                                    className="inline-block w-4 h-4"
                                  />
                                </>
                              )}
                            </span>
                          )}
                        </p>
                      </Linkify>
                    }
                    
                    {(profileData.location || profileData.contact) && (
                      <p className="mt-2 font-light text-sm text-theme-emptyEvent">
                        {profileData.location}
                        {profileData.contact && profileData.location
                          ? " | "
                          : ""}
                        {profileData.contact}
                      </p>
                    )}
                    <div
                      className={`flex flex-row space-x-3  ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
                      {isOwner && (
                        <div
                          onClick={() =>
                            openShareModal(
                              `https://` +
                                profileData.username +
                                `.${domainUrl}`
                            )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer md:px-1.5 px-3 lg:px-3 mt-4 font-normal  py-2.5 
                          bg-theme-secondaryText text-theme-primaryBackground text-xs rounded-lg"
                        >
                          Share profile
                        </div>
                      )}

                      {/* {profileData.customText && profileData.customUrl && (
                        <a
                          className={`px-4 mt-4 py-2.5 ${
                            isOwner
                              ? "border border-theme-secondaryText text-theme-secondaryText"
                              : "bg-theme-secondaryText text-theme-primaryBackground"
                          } 
                           font-normal text-xs rounded-lg`}
                          href={profileData.customUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profileData.customText}
                        </a>
                      )} */}
                      {!isOwner && (
                        <div
                          className="cursor-pointer md:px-1.5 px-3 lg:px-3 mt-4 font-normal py-2.5 border bg-theme-secondaryText
                            text-sm rounded-lg border-none text-theme-primaryBackground"
                          onClick={handleMessageClick}
                        >
                          Message
                        </div>
                      )}
                      {isOwner && (
                        <button
                          className={`md:px-1.5 px-3 lg:px-3 mt-4  py-2.5 border border-theme-secondaryText 
                            text-theme-secondaryText font-normal text-xs rounded-lg`}
                          onClick={openBottomSheet}
                        >
                          {profileData.logo && profileData.description !== ""
                            ? "Edit Profile"
                            : "Complete Profile"}
                        </button>
                      )}
                    </div>
                    <div
                      className={`flex ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
                      {profileData.links.length >= 1 && (
                        <div
                          className="w-64 my-3  border border-theme-chatDivider "
                          style={{ height: "0.1px" }}
                        ></div>
                      )}
                    </div>
                    <div
                      className={`flex space-x-4 ${
                        isOwner || hasImages
                          ? "justify-center md:justify-start"
                          : "justify-center"
                      }`}
                    >
                      {profileData.links.map(
                        (link, index) =>
                          link.value && (
                            <a
                              href={link.url + link.value}
                              className="text-theme-secondaryText cursor-pointer"
                              key={index}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.title === "Threads" ? (
                                <>
                                  <img
                                    src={ThreadsLight}
                                    className="dark:hidden w-8 h-8"
                                    alt={link.value}
                                  />
                                  <img
                                    src={link.image}
                                    className="hidden dark:block w-8 h-8"
                                    alt={link.value}
                                  />
                                </>
                              ) : (
                                <img
                                  src={link.image}
                                  className="w-8 h-8"
                                  alt={link.value}
                                />
                              )}
                            </a>
                          )
                      )}
                      {profileData.otherLink && (
                        <a
                          href={profileData.otherLink}
                          className="text-theme-secondaryText cursor-pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={Others}
                            alt="other-link"
                            className="w-8 h-8 dark:block hidden"
                          />
                          <img
                            src={DarkOther}
                            alt="other-link"
                            className="w-8 h-8 dark:hidden"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {!isEmbeddedOrExternal() &&
                  (hasImages ? (
                    <div
                      className={`flex lg:ml-5 md:ml-2 md:mt-0 mt-4 md:mb-0 justify-center ${
                        !profileData.description ||
                        profileData.description.length <= 40
                          ? "xl:w-1/2"
                          : " xl:w-3/5"
                      } h-full w-full md:justify-end mb-2 lg:w-3/5 md:w-1/2`}
                    >
                      <ProfileCarousel images={profileData.imageCards} />
                    </div>
                  ) : isOwner ? (
                    <div
                      className={`flex md:ml-4 md:mt-0 mt-4 md:mb-0 justify-center ${
                        !profileData.description ||
                        profileData.description.length <= 40
                          ? "md:w-3/5 xl:w-3/5"
                          : "md:w-3/5 lg:w-1/2"
                      } h-full w-full md:justify-end mb-2`}
                    >
                      <EmptyProfileCard handleClick={handleEditCards} />
                    </div>
                  ) : null)}
              </div>
            </div>
            <div className="items-center text-center mt-3">
              {tabs.map(
                (tab) =>
                  (!isEmbeddedOrExternal() || tab.name === "Channels") && (
                    <button
                      key={tab.id}
                      onClick={(event) => handleTabClick(event, tab.href)}
                      className={`mx-2 xs:px-8 px-4 py-3 text-sm transition-colors duration-300 ${
                        activeTab === tab.href
                          ? "border-b-2 text-theme-secondaryText border-theme-secondaryText"
                          : "text-theme-emptyEvent "
                      }`}
                      style={{ marginBottom: "-1px" }}
                    >
                      {tab.name}
                    </button>
                  )
              )}
            </div>
            {!isEmbeddedOrExternal() && (
              <div
                className={`
                xs:w-88px w-72
              mx-auto border border-theme-chatDivider `}
                style={{ height: "0.1px" }}
              ></div>
            )}
            <div className="mt-6 mb-8">
              {activeTab === "channels" ? (
                <ChannelsTab gallery={false} isOwner={isOwner} />
              ) : activeTab === "curations" ? (
                <CurationsTab isOwner={isOwner}  gallery={false} />
              ) : (
                <FaqsTab username={username} isOwner={isOwner} />
              )}
            </div>

            <div
              className={`flex justify-between items-center ${
                hasImages ? "mt-2 xs:mt-4" : "mt-1"
              } -ml-2`}
            ></div>
          </div>
          <ProfileForm
            isOpen={isBottomSheetOpen}
            onClose={closeBottomSheet}
            onUnsplashClick={openUnsplashModal}
          />
          <UnsplashModal
            isOpen={isUnsplashModalOpen}
            onClose={closeUnsplashModal}
          />
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Profile;
