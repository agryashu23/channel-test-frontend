import { React, useEffect } from "react";
import chipBackground from "../../assets/images/background_pattern.svg";
import Chips from "./Chips";
import { useSelector, useDispatch } from "react-redux";
import ChipProfileView from "./widgets/ChipProfileView";
import ProfileIcon from "../../assets/icons/profile.svg";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile } from "./../../redux/slices/profileSlice";
import { fetchChip } from "./../../redux/slices/chipItemSlice";
import ProfileChips from "./ProfileChips";
import { postRequestAuthenticated } from "./../../services/rest";
import { setProfileData } from "../../redux/slices/profileSlice";
import { setMyData } from "../../redux/slices/myDataSlice";
import { domainUrl } from "./../../utils/globals";
import useModal from "./../hooks/ModalHook";

const ChipState = () => {
  const profileData = useSelector((state) => state.profileData);
  const chipItemData = useSelector((state) => state.chipItem);
  const myData = useSelector((state) => state.myData);
  const { handleOpenModal } = useModal();

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { username, chipId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (chipId) {
      dispatch(fetchChip(chipId));
    }
    if (username) {
      dispatch(fetchProfile(username));
    }
  }, [username, dispatch, chipId]);

  const handleButtonClick = () => {
    const url = `https://${username}.${domainUrl}`;
    window.open(url, "_blank");
  };

  const owner = username === myData?.username;
  return (
    <div className="w-[98%] flex flex-col sm:flex-row bg-primaryBackground min-h-screen ">
      <div className="sm:w-1/2 w-full sm:relative">
        <div className="relative w-full h-full pr-2">
          <img
            src={chipBackground}
            alt="Chip state"
            className=" hidden sm:flex absolute lg:top-0 md:-top-1/4 sm:-top-1/3 left-0 w-full h-full object-cover"
          />{" "}
          {/* Cover entire container */}
          <div className="flex flex-col justify-center sm:absolute sm:top-[10%] lg:left-[20%] md:left-[10%] sm:left-[10%] w-full sm:w-4/5 md:w-4/5 lg:w-3/5 sm:z-10">
            {chipItemData.chip.curation && (
              <div
                className="flex flex-row items-center mb-3 w-max cursor-pointer"
                onClick={() =>
                  navigate(`/curation/${chipItemData.chip.curation._id}`)
                }
              >
                <img
                  src={chipItemData.chip.curation.image}
                  alt="curation-image"
                  className="w-14 h-10 rounded-md mr-4"
                />
                <p className="text-theme-secondaryText text-base  font-normal">
                  {chipItemData.chip.curation.name}
                </p>
              </div>
            )}
            {chipItemData.chip &&
              chipItemData.chip.user &&
              (owner ? (
                <ProfileChips item={chipItemData.chip} />
              ) : (
                <Chips item={chipItemData.chip} />
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-md sm:mt-0 mt-6 sm:w-1/2 w-[98%] bg-chipBackground p-6">
        <div className="flex flex-row justify-between items-center">
          <h1 className="lg:text-3xl md:text-2xl xs:text-xl text-md text-theme-secondaryText font-normal font-familjen-grotesk">
            More from the author
          </h1>
          <button
            className="bg-primary sm:px-4 px-1 py-1.5 rounded-3xl text-buttonText  font-inter text-xs"
            onClick={handleButtonClick}
          >
            View full profile
          </button>
        </div>
        <div className="mt-4 bg-profileBackground flex py-4 px-5 flex-col items-center justify-center rounded-lg w-full">
          {profileData.logo ? (
            <img
              src={profileData.logo}
              alt="Profile"
              className="rounded-full w-[80px] h-20 border border-white object-cover"
              style={{ borderWidth: "3px" }}
            />
          ) : (
            <img
              src={ProfileIcon}
              alt="Profile"
              className="rounded-full w-[80px] h-20 border border-white object-cover"
            />
          )}
          <div className={`mt-1 text-center`}>
            <h1 className="text-xl text-theme-secondaryText font-normal font-familjen-grotesk">
              {profileData.name}
            </h1>
            <p className="mt-1 text-xs  font-normal text-viewAll font-inter">
              {profileData.username}.{domainUrl}
            </p>
            <p className="mt-2 text-xs font-light text-textColor">
              {profileData.description}
            </p>
            {(profileData.location || profileData.contact) && (
              <p className="mt-2 text-xs text-viewAll">
                {profileData.location}
                {profileData.contact && profileData.location ? " | " : ""}
                {profileData.contact}
              </p>
            )}
            <div className={`flex space-x-4 justify-center `}>
              {profileData.customText && profileData.customUrl && (
                <a
                  href={profileData.customUrl}
                  className="px-5 mt-4  py-2 bg-primary text-buttonText text-sm rounded-lg"
                >
                  {profileData.customText}
                </a>
              )}
              {/* {!owner &&  <button className={`px-4 mt-4  py-2 ${isSubscribed?"bg":"bg-buttonBackground"} text-primary text-sm rounded-lg`} onClick={handleSubscribe}>{isSubscribed?"Subscribed":"Subscribe" }</button>} */}
            </div>
          </div>
        </div>
        <div className="mt-4 w-full">
          <ChipProfileView />
        </div>
      </div>
    </div>
  );
};

export default ChipState;
