import React, { useEffect,useState,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { acceptTopicRequest, declineTopicRequest, fetchTopicRequests } from '../../../redux/slices/businessSlice';
import {ChannelImages} from '../../constants/images';
import { useNavigate } from 'react-router-dom';

const TopicRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const business = useSelector((state) => state.business);
  const [selectedChannelId, setSelectedChannelId] = useState("all");
  const [selectedTopicId, setSelectedTopicId] = useState("all");
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const channelDropdownRef = useRef(null);
  const topicDropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTopicRequests());
  }, []);

  const handleAcceptTopicRequest = (topicId, userId,email) => {
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", topicId);
    formDataToSend.append("userId", userId);
    formDataToSend.append("email", email);
    dispatch(acceptTopicRequest(formDataToSend));
  };

  const handleDeclineTopicRequest = (topicId, userId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("topicId",topicId);
    formDataToSend.append("userId", userId);
    dispatch(declineTopicRequest(formDataToSend));
  };

  useEffect(() => {
    if (selectedChannelId === "all") {
      setSelectedTopicId("all");
    } else {
      const topicExists = availableTopics.some((t) => t._id === selectedTopicId);
      if (!topicExists) {
        setSelectedTopicId("all");
      }
    }
  }, [selectedChannelId]);
  


    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          channelDropdownRef.current &&
          !channelDropdownRef.current.contains(event.target)
        ) {
          setChannelDropdownOpen(false);
        }
        if (
          topicDropdownRef.current &&
          !topicDropdownRef.current.contains(event.target)
        ) {
          setTopicDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const selectedChannel = business.channels?.find((c) => c._id === selectedChannelId);
    const availableTopics = selectedChannel?.topics || [];

    const filteredRequests = business.topicRequests?.filter((request) => {
      const matchChannel = selectedChannelId === "all" || request.channel === selectedChannelId;
      const matchTopic = selectedTopicId === "all" || request.topic?._id === selectedTopicId;
      return matchChannel && matchTopic;
    });
    

  return (
    <div className="flex flex-col md:pl-8 pl-4  md:pr-8 pr-4 pt-6 h-full overflow-y-auto">
       <p className="text-theme-emptyEvent text-lg font-normal">
        Requests
      </p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Topics ({business.topicRequests?.length})
      </p>
      <div className="border-t border-t-theme-chatDivider my-4 "></div>
      <div className="flex flex-row flex-wrap gap-6 mb-4">
  <div className="flex flex-col w-full sm:w-auto relative" ref={channelDropdownRef}>
    <p className="text-sm text-theme-secondaryText mb-2 ">Filter by Channel</p>
    <div
      className="border border-theme-chatDivider rounded-md py-2 sm:px-3 px-2 text-sm 
      bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center text-theme-primaryText w-full sm:w-64"
      onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
    >
      <span>
        {selectedChannelId === "all"
          ? "All Channels"
          : selectedChannel?.name || "Unknown"}
      </span>
      <img
        src={
          channelDropdownOpen
            ? ChannelImages.ArrowUp.default
            : ChannelImages.ArrowDown.default
        }
        alt="dropdown"
        className="w-4 h-4 ml-2"
      />
    </div>

    {channelDropdownOpen && (
      <div className="absolute top-16 z-10 mt-0.5 w-full sm:w-64 bg-theme-secondaryBackground border border-theme-chatDivider rounded-md shadow-md max-h-60 overflow-y-auto">
        <div
          className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
          onClick={() => {
            setSelectedChannelId("all");
            setSelectedTopicId("all");
            setChannelDropdownOpen(false);
          }}
        >
          All Channels
        </div>
        {business.channels?.map((channel) => (
          <div
            key={channel._id}
            className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
            onClick={() => {
              setSelectedChannelId(channel._id);
              setSelectedTopicId("all");
              setChannelDropdownOpen(false);
            }}
          >
            {channel.name}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Topic Filter Block */}
  <div className="flex flex-col w-full sm:w-auto relative" ref={topicDropdownRef}>
    <p className="text-sm text-theme-secondaryText mb-2 ">Filter by Topic</p>
    <div
      className={`border border-theme-chatDivider rounded-md py-2 sm:px-3 px-2 text-sm bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center text-theme-primaryText w-full sm:w-64 ${
        selectedChannelId === "all" ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={() => {
        if (selectedChannelId !== "all") setTopicDropdownOpen(!topicDropdownOpen);
      }}
    >
      <span>
        {selectedTopicId === "all"
          ? "All Topics"
          : availableTopics.find((t) => t._id === selectedTopicId)?.name || "Unknown"}
      </span>
      <img
        src={
          topicDropdownOpen
            ? ChannelImages.ArrowUp.default
            : ChannelImages.ArrowDown.default
        }
        alt="dropdown"
        className="w-4 h-4 ml-2"
      />
    </div>

    {topicDropdownOpen && (
      <div className="absolute z-10  top-16 mt-0.5 w-full sm:w-64 bg-theme-secondaryBackground border border-theme-chatDivider rounded-md shadow-md max-h-60 overflow-y-auto">
        <div
          className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
          onClick={() => {
            setSelectedTopicId("all");
            setTopicDropdownOpen(false);
          }}
        >
          All Topics
        </div>
        {availableTopics.map((topic) => (
          <div
            key={topic._id}
            className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
            onClick={() => {
              setSelectedTopicId(topic._id);
              setTopicDropdownOpen(false);
            }}
          >
            {topic.name}
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
                            className="w-12 h-12"
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
                          {request.topic?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <div
                        className="bg-theme-buttonEnable rounded-lg cursor-pointer
                       text-theme-secondaryText text-center md:px-6 px-2 py-2 text-sm"
                        onClick={() =>
                          handleAcceptTopicRequest(
                            request.topic?._id,
                            request.user?._id,
                            request.user?.email
                          )
                        }
                      >
                        Accept
                      </div>
                      <div
                        className="border-theme-secondaryText border rounded-lg cursor-pointer
                       text-theme-secondaryText text-center md:px-6 px-2 py-2 text-sm"
                        onClick={() =>
                          handleDeclineTopicRequest(
                            request.topic?._id,
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
            <div className="text-theme-secondaryText font-normal text-md text-center mx-auto mt-12 ">
              No requests found.
            </div>
          )}
    </div>
  )
}

export default TopicRequests