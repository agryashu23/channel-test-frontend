import React, { useState ,useRef,useEffect} from "react";
import useModal from "./../../hooks/ModalHook";
import EmptyChannelCard from "./../Widgets/EmptyChannelCard";
import {
  setChannelIdToDelete,
  setChannelNameToDelete,
} from "../../../redux/slices/deleteChannelSlice.js";
import { useSelector, useDispatch } from "react-redux";
import ChannelLogo from "../../../assets/icons/default_channel_logo.svg";
import {
  setChannelField,
  createChannelInvite,
  joinChannel,
} from "../../../redux/slices/channelSlice.js";
import {
  setCreateChannelField,
  setCreateChannelItems,
} from "../../../redux/slices/createChannelSlice.js";
import { setModalModal } from "../../../redux/slices/modalSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { domainUrl } from "./../../../utils/globals";
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper.js";
import { showCustomToast } from "../../../widgets/toast.js";
import { setChannelOnce } from "../../../redux/slices/channelItemsSlice.js";
import EmptyChatIcon from "../../../assets/icons/empty_chat.svg";
import { usePaymentHandler } from "../../../utils/paymentPage";
import {ChannelImages} from "../../constants/images";

const ChannelsTab = ({ gallery = false, isOwner }) => {
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(null);
  const dropdownEditRef = useRef(null);
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const { username } = useParams();
  const { channels } = useSelector((state) => state.channelItems);
  const dispatch = useDispatch();
  const galleryUsername = useSelector((state) => state.galleryData.username);
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);
  const [joinLoading, setJoinLoading] = useState(false);
  const { handlePayment } = usePaymentHandler();
  
  const handleEditChannel = (channel) => {
    const transformedData = {
      ...channel,
    };
    dispatch(setCreateChannelItems(transformedData));
    dispatch(setCreateChannelField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalChannelOpen");
    }, 500);
  };
  const handleShareChannel = (id, username) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    handleOpenModal("modalShareChannelOpen", id);
  };
  const handleOwnerShareChannel = (id, username) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    dispatch(setModalModal({ field: "type", value: "channel" }));
    dispatch(setModalModal({ field: "channelId", value: id }));
    handleOpenModal("modalInviteOpen");
    // dispatch(createChannelInvite(id))
    //   .unwrap()
    //   .then((invite) => {
    //     dispatch(setChannelField({ field: "code", value: invite.code }));
    //     setTimeout(() => {
    //       handleOpenModal("modalShareChannelOpen", id);
    //     }, 500);
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownEditRef.current &&
        !dropdownEditRef.current.contains(event.target)
      ) {
        setIsEditDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleEditDropdown = (id) => {
    setIsEditDropdownOpen(id);
  };



  const handleChannelPage = (channel) => {
    navigate(`/account/${channel.user.username}/channel/${channel._id}`);
  };

  const handleLeaveChannel = (channel) => {
    dispatch(setModalModal({ field: "channelId", value: channel._id }));
    dispatch(setModalModal({ field: "isTabChannel", value: true }));
    handleOpenModal("modalLeaveChannelOpen");
  };

  const handleJoinChannel = (channel) => {
    if (isLoggedIn) {
      const isMember = channel.members.find(member=>member?.user?.toString()===myUserId.toString());
      if(isMember && isMember.status==="request"){
        showCustomToast("You have already requested to join this channel");
        return;
      }
      else {
        setJoinLoading(true);
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then((response) => {
            if(response.success && response.paywall && response.paywallPrice>0){
              const data = {
                amount:response.paywallPrice,
                currency:"INR",
                channel:response.channel._id,
                name:response.channel.name,
                type:"channel",
                username:channel.user.username
              }
              handlePayment(data,"channel");
              return;
            }
            dispatch(setChannelOnce(false));
              setJoinLoading(false);
              if(response.success && response.joined && response.joinStatus==="already"){
                navigate(
                  `${getAppPrefix()}/account/${username}/channel/${
                    channel._id
                  }/c-id/topic/${response.topics[0]}`
                );
              }
              else if(response.success && response.joined){
                navigate(
                  `${getAppPrefix()}/account/${username}/channel/${
                    channel._id
                  }`
                );
              }
              else{
                showCustomToast(response.message);
              }
          })
          .catch((error) => {
            console.log(error);
            setJoinLoading(false);
          });
      }
    } else {
      if (isSubdomain) {
        window.location.replace(
          `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}&redirect=/account/${username}/channel/${channel._id}`
        );
      } else {
        navigate(
          `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${username}/channel/${
            channel._id
          }`
        );
      }
    }
  };

  const channelButtonState=(channel)=>{
    if(!isLoggedIn || !myUserId){
      return "Join channel";
    }
    else if(channel.user?._id.toString()===myUserId.toString()){
      return "";
    }
    else if(channel.members?.find(member=>member?.user?.toString()===myUserId.toString() && member.status==="joined")){
      return "Exit channel";
    }else if(channel.members?.find(request=>request?.user?.toString()===myUserId.toString() && request.status==="request")){
      return "Requested";
    }else{
      return "Join channel";
    }
  }


  if (channels.length === 0 && isOwner) {
    return <EmptyChannelCard />;
  }
  if (channels.length === 0) {
    return (
      <div className="text-theme-secondaryText text-center pt-6 flex flex-col items-center justify-center h-full">
        <img src={EmptyChatIcon} alt="emptyChatIcon" className="h-28" />
        <p className="text-theme-secondaryText text-md font-normal mt-4">No Channels found.</p>
      </div>
    );
  }
  return channels.map((channel) => {
  const isChannelPart = channels?.members?.find(member=>member?.user?.toString()===myUserId.toString() && member.status==="joined");
    const buttonState = channelButtonState(channel);
    return (
    <div
      key={channel._id}
      className="p-3 rounded-lg mt-4 border border-theme-chatDivider justify-start flex xs:flex-row flex-col items-start"
    >
      {channel.logo ? (
        <img
          src={channel.logo}
          alt="logo"
          className="h-16 w-16 rounded-lg  cursor-pointer flex-shrink-0 object-cover "
          onClick={() => handleChannelPage(channel)}
        />
      ) : (
        <img
          src={ChannelLogo}
          alt="logo"
          className="h-16 w-16 rounded-lg  cursor-pointer flex-shrink-0 object-cover "
          onClick={() => handleChannelPage(channel)}
        />
      )}
      <div className="flex flex-col xs:ml-3 xs:-mt-1  mt-1.5 ">
        <div
          className="text-theme-secondaryText text-lg font-normal  cursor-pointer "
          onClick={() => handleChannelPage(channel)}
        >
          {channel.name}
        </div>
        <p
          className="text-theme-emptyEvent text-sm font-light xs:mt-0 mt-2.5"
          style={{ whiteSpace: "pre-line" }}
        >
          {channel.description?.length > 150
            ? channel.description.slice(0, 150) + "..."
            : channel.description}
        </p>
        {(!isOwner && !isChannelPart) &&  <div className="flex flex-row items-center ">
              <img className="mr-1 w-3 h-3 mt-0.5 dark:block hidden" loading="lazy" src={channel.visibility==="paid"?ChannelImages.Secure.default:channel.visibility==="anyone"?
                ChannelImages.LockOpen.default:ChannelImages.Lock.default} alt="lock"  />
                <img className="mr-1 w-3 h-3 mt-0.5 dark:hidden block" loading="lazy" src={channel.visibility==="paid"?ChannelImages.SecureLight.default:channel.visibility==="anyone"?
                ChannelImages.LockOpenLight.default:ChannelImages.LockLight.default} alt="lock-light"  />
              <p className="mt-1 text-xs font-ligh text-theme-emptyEvent">{channel.visibility==="paid"?`This channel is paywalled. Youll be able to access 
              it once you pay the price of ₹${channel.paywallPrice}/-`:channel.visibility==="anyone"?"This is a public channel. Anyone can join."
              :"This channel is invite-only. You'll be able to access it once the admin approves your request."}</p>
          </div>}
          <div className="flex flex-row xs:space-x-4 space-x-3 pt-2">
          {isOwner ? (
            <div
              className="py-2 xs:px-3 px-2 cursor-pointer text-theme-primaryBackground bg-theme-secondaryText rounded-lg text-xs font-inter"
              onClick={() => handleOwnerShareChannel(channel._id)}
            >
              Create join link
            </div>
          ) : buttonState === "Exit channel" ? (
            <div
              className="border border-theme-primaryText py-2 xs:px-3 px-2 rounded-lg cursor-pointer text-theme-secondaryText text-xs font-inter"
              onClick={() => handleLeaveChannel(channel)}
            >
              Exit channel
            </div>
          ) : (
            <div
              className={`py-2 xs:px-3 px-2 rounded-lg text-xs font-inter text-center cursor-pointer ${
                buttonState === "Requested"
                  ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
                  : "bg-theme-secondaryText text-theme-primaryBackground"
              }`}
              onClick={() => buttonState === "Requested" ? null : handleJoinChannel(channel)}
            >
              {buttonState}
            </div>
          )}      
            {isOwner ? (  
              <div className="relative flex items-center">
                <img
                  src={ChannelImages.Dots.default}
                  alt="dots"
                  className="dark:block hidden w-6 h-6 mr-2 cursor-pointer"
                  onClick={() => toggleEditDropdown(channel._id)}
                />
                <img
                  src={ChannelImages.DotsLight.default}
                  alt="dots"
                  className="dark:hidden w-6 h-6 mr-2 cursor-pointer"
                  onClick={() => toggleEditDropdown(channel._id)}
                />
                {isEditDropdownOpen === channel._id && (
                  <div
                    ref={dropdownEditRef}
                    className="absolute top-6 left-0 mt-1 ml-3 w-24 rounded-md shadow-lg border  border-theme-chatDivider
                             bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div className="flex flex-row px-3 items-center">
                        <img
                          src={ChannelImages.Edit.default}
                          alt="edit"
                          className="dark:block hidden w-4 h-4"
                        />
                        <img
                          src={ChannelImages.EditLight.default}
                          alt="edit"
                          className="dark:hidden w-4 h-4"
                        />
                        <p
                          className="block font-light px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                          role="menuitem"
                          onClick={handleEditChannel}
                        >
                          Edit
                        </p>
                      </div>
                      <div
                        className="flex flex-row px-3 items-center"
                        onClick={(e) => {
                          dispatch(setChannelIdToDelete(channel._id));
                          dispatch(setChannelNameToDelete(channel.name));
                          handleOpenModal("modalDeleteChannelOpen");
                        }}
                      >
                        <img
                          src={ChannelImages.Delete.default}
                          alt="edit"
                          className="dark:block hidden w-4 h-4"
                        />
                        <img
                          src={ChannelImages.DeleteLight.default}
                          alt="edit"
                          className="dark:hidden w-4 h-4"
                        />
                        <p
                          className="block px-2 py-2 font-light text-sm   text-theme-secondaryText cursor-pointer"
                          role="menuitem"
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`py-2 px-3 rounded-lg cursor-pointer ${
                  "border border-theme-primaryText text-theme-secondaryText text-xs font-inter"
                } `}
                onClick={() => handleShareChannel(channel._id)}
              >
                Share Invite
              </div>
            )}
          </div>
        </div>
    </div>
  );
});
};

export default ChannelsTab;
