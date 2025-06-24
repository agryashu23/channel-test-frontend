import React, { useState } from "react";
import useModal from "./../../hooks/ModalHook";
import EmptyChannelCard from "./../Widgets/EmptyChannelCard";
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

const ChannelsTab = ({ gallery = false, isOwner }) => {
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const { username } = useParams();
  const { channels } = useSelector((state) => state.channelItems);
  const dispatch = useDispatch();
  const galleryUsername = useSelector((state) => state.galleryData.username);
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);
  const [joinLoading, setJoinLoading] = useState(false);
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
    dispatch(createChannelInvite(id))
      .unwrap()
      .then((invite) => {
        dispatch(setChannelField({ field: "code", value: invite.code }));
        setTimeout(() => {
          handleOpenModal("modalShareChannelOpen", id);
        }, 500);
      })
      .catch((error) => {
        alert(error);
      });
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
      const isMember = channel.members.find(member=>member.user.toString()===myData?._id.toString());
      if(isMember && isMember.status==="request"){
        showCustomToast("You have already requested to join this channel");
        return;
      }
      else {
        setJoinLoading(true);
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then((response) => {
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
    if(!isLoggedIn || !myData?._id){
      return "Join channel";
    }
    else if(channel.user?._id.toString()===myData?._id.toString()){
      return "";
    }
    else if(channel.members?.find(member=>member.user.toString()===myData?._id.toString() && member.status==="joined")){
      return "Exit channel";
    }else if(channel.members?.find(request=>request.user.toString()===myData?._id.toString() && request.status==="request")){
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

        <div className="flex flex-row space-x-4 items-end">
        {isLoggedIn && myData?._id === channel?.user._id ? (
            <button
              onClick={() =>
                handleOwnerShareChannel(channel._id, channel.user.username)
              }
              className="cursor-pointer px-3 mt-4 font-normal py-2.5 bg-theme-secondaryText text-theme-primaryBackground text-xs rounded-lg"
            >
              Share join link
            </button>
          ) : buttonState === "Exit channel" ? (
            <button
              className="border border-theme-primaryText py-2 px-3 mt-4 rounded-lg cursor-pointer text-theme-secondaryText text-sm font-inter"
              onClick={() => handleLeaveChannel(channel)}
            >
              Exit channel
            </button>
          ) : (
            <button
              className={`py-2 px-3 mt-4 text-center rounded-lg text-sm font-inter ${
                buttonState === "Requested"
                  ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
                  : "bg-theme-secondaryText text-theme-primaryBackground"
              }`}
              disabled={buttonState === "Requested" || joinLoading}
              onClick={() => {
                if (buttonState === "Join channel") handleJoinChannel(channel);
              }}
            >
              {buttonState}
            </button>
          )
        }
          {isLoggedIn && myData?._id === channel?.user._id ? (
            <button
              className={`px-4 mt-4  py-2.5 border border-theme-secondaryText 
           text-theme-secondaryText font-normal text-xs rounded-lg`}
              onClick={() => handleEditChannel(channel)}
            >
              Edit Channel
            </button>
          ) : (
            <button
              onClick={() =>
                handleShareChannel(channel._id, channel.user.username)
              }
              className={`px-4 mt-4  py-2.5 border border-theme-secondaryText 
         text-theme-secondaryText font-normal text-xs rounded-lg`}
            >
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
};

export default ChannelsTab;
