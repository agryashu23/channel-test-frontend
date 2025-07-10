import React, { useEffect,useState,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { acceptChannelRequest, declineChannelRequest, fetchBusinessChannelRequests } from '../../../redux/slices/businessSlice';
import {ChannelImages} from '../../constants/images';
import { useNavigate } from 'react-router-dom';

const ChannelRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const business = useSelector((state) => state.business);
  const [selectedChannelId, setSelectedChannelId] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBusinessChannelRequests());
  }, []);

  const handleAcceptChannelRequest = (channelId, userId,email) => {
    const formDataToSend = new FormData();
    formDataToSend.append("channelId", channelId);
    formDataToSend.append("userId", userId);
    formDataToSend.append("email", email);
    dispatch(acceptChannelRequest(formDataToSend));
  };

  const handleDeclineChannelRequest = (channelId, userId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("channelId", channelId);
    formDataToSend.append("userId", userId);
    dispatch(declineChannelRequest(formDataToSend));
  };

  const filteredRequests =
    selectedChannelId === "all"
      ? business.channelRequests
      : business.channelRequests?.filter(
          (request) => request.channel?._id === selectedChannelId
        );

        useEffect(() => {
          const handleClickOutside = (event) => {
            if (
              dropdownRef.current &&
              !dropdownRef.current.contains(event.target)
            ) {
              setDropdownOpen(false);
            }
          };
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, []);

  return (
    <div className="flex flex-col md:pl-8 pl-4  md:pr-8 pr-4 pt-6 h-full overflow-y-auto">
       <p className="text-theme-emptyEvent text-lg font-normal">
        Requests
      </p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Channels ({business.channelRequests?.length})
      </p>
      <div className="border-t border-t-theme-chatDivider my-4 "></div>
      <div className="flex flex-col xs:flex-row xs:items-center mb-4">
        <p className="text-theme-secondaryText text-md font-normal xs:mr-4">
          Filter by Channel:
        </p>
        <div className="relative w-max xs:mt-0 mt-2" ref={dropdownRef}>
        <div
          className="border border-theme-chatDivider rounded-md py-2 sm:px-3 px-2 text-sm focus:outline-none
          text-theme-primaryText bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center sm:w-60"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>
            {selectedChannelId === "all"
              ? "All Channels"
              : business.channels?.find((c) => c._id === selectedChannelId)?.name || "Unknown"}
          </span>
          <img src={dropdownOpen ? ChannelImages.ArrowUp.default : ChannelImages.ArrowDown.default} alt="dropdown" className="w-4 h-4 dark:block hidden" />
          <img src={dropdownOpen ? ChannelImages.ArrowUpLight.default : ChannelImages.ArrowDownLight.default} alt="dropdown" className="w-4 h-4 block dark:hidden" />
        </div>

          {dropdownOpen && (
            <div className="absolute z-10 mt-0.5 sm:w-60 w-full bg-theme-secondaryBackground border border-theme-chatDivider 
            rounded-md shadow-md max-h-60 overflow-y-auto">
              <div
                className="px-3 py-2 text-sm text-theme-primaryText hover:bg-theme-primaryBackground cursor-pointer"
                onClick={() => {
                  setSelectedChannelId("all");
                  setDropdownOpen(false);
                }}
              >
                All Channels
              </div>
              {business.channels?.map((channel) => (
                <div
                  key={channel._id}
                  className="py-2 px-3 text-sm text-theme-primaryText hover:bg-theme-primaryBackground cursor-pointer flex items-center space-x-2"
                  onClick={() => {
                    setSelectedChannelId(channel._id);
                    setDropdownOpen(false);
                  }}
                >
                  {/* {channel.logo && (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-5 h-5 rounded-sm object-cover"
                    />
                  )} */}
                  <span>{channel.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>        

      </div>
      {filteredRequests?.length > 0 ? (
            <div className="rounded-lg border border-theme-chatDivider sm:p-4 p-2 flex flex-col mt-4">
              {filteredRequests.map((request) => (
                <div key={request._id} className="flex flex-row my-2 items-center">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row items-start">
                      {request.user?.logo ? (
                        <img
                          src={request.user?.logo}
                          alt="profile-icon"
                          className="rounded-md w-12 h-12 object-cover"
                        />
                      ) : request.user?.color_logo ? (
                        <div
                          className="rounded-md w-12 h-12 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: request?.user?.color_logo }}
                        >
                          <img
                            src={ChannelImages.ColorProfile.default}
                            alt="color-profile"
                            className="w-8 h-8"
                          />
                        </div>
                      ) : (
                        <img
                          src={ChannelImages.Profile.default}
                          alt="profile-icon"
                          className="rounded-md w-12 h-12 object-cover"
                        />
                      )}
                      <div className="flex flex-col justify-between sm:ml-3 ml-2">
                        <p className="text-theme-secondaryText font-normal sm:text-md text-sm truncate w-full cursor-pointer" 
                        onClick={()=>navigate(`/account/${request.user?.username}/profile`)}>
                          {request.user?.username}
                        </p>
                        <p className="italic text-theme-primaryText sm:text-sm text-xs truncate w-full">
                          {request.channel?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <div
                        className="bg-theme-buttonEnable rounded-lg cursor-pointer
                       text-theme-secondaryText text-center md:px-6 px-2 py-2 text-sm"
                        onClick={() =>
                          handleAcceptChannelRequest(
                            request.channel?._id,
                            request.user?._id,
                            request.user?.email || ""
                          )
                        }
                      >
                        Accept
                      </div>
                      <div
                        className="border-theme-secondaryText border rounded-lg cursor-pointer
                       text-theme-secondaryText text-center md:px-6 px-2 py-2 text-sm"
                        onClick={() =>
                          handleDeclineChannelRequest(
                            request.channel?._id,
                            request.user?._id
                          )
                        }
                      >
                        Decline
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-theme-secondaryText font-normal text-md text-center mx-auto mt-4 ">
              No requests found.
            </div>
          )}
    </div>
  )
}

export default ChannelRequests