import { setChannelOnce } from "../../../redux/slices/channelItemsSlice";
import { domainUrl } from "../../../utils/globals";
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper";
import { joinTopic, leaveTopic } from "../../../redux/slices/reorderTopicSlice";
import { showCustomToast } from "../../../widgets/toast";
import { setModalModal } from "../../../redux/slices/modalSlice";
import {
    React,
    useNavigate,
    useDispatch,
    useSelector,
    useModal,
  } from "../../../globals/imports";

const UserTopicsTab = ({username,isSubdomain,galleryUsername,channelId}) => {
  const myData = useSelector((state) => state.myData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topics = useSelector((state) => state.reorderTopic.topics);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { handleOpenModal } = useModal();




  const myUserId = myData?._id;
  
  const joinedTopics = topics.filter((topic) =>
    topic.members?.some((m) => m.user === myUserId && m.status === "joined")
  );

  const otherTopics = topics.filter((topic) => {
    const member = topic.members?.find((m) => m.user === myUserId);
    return !member || member.status !== "joined";
  });

  const handleJoinTopic = (topicId) => {
    if(isLoggedIn){
        dispatch(joinTopic(topicId))
        .unwrap()
          .then((response) => {
            dispatch(setChannelOnce(false));
            //   setJoinLoading(false);
              if(response.success && response.joined){
                navigate(
                  `c-id/topic/${response.topic._id}`
                );
              }
              else{
                showCustomToast(response.message);
              }
          })
          .catch((error) => {
            console.log(error);
            // setJoinLoading(false);
          });
    }
    else{
        if (isSubdomain) {
            window.location.replace(
              `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}&redirect=/account/${username}/channel/${channelId}`
            );
          } else {
            navigate(
              `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${username}/channel/${
                channelId
              }`
            );
          }
    }
  };

  const handleLeaveTopic = (topicId) => {
    dispatch(setModalModal({ field: "topicId", value: topicId }));
    handleOpenModal("modalLeaveTopicOpen");
  };

  const handleTopic = (topicId) => {
    navigate(`c-id/topic/${topicId}`);
  };


  const renderTopicRow = (topic) => {
    const member = topic.members?.find((m) => m.user === myUserId);
    const isRequested = member?.status === "request";
    const buttonLabel = isRequested ? "Requested" : "Join";
    const disabled = isRequested;

    return (
      <div
        key={topic._id}
        className="flex justify-between items-center bg-theme-tertiaryBackground rounded-lg px-4 py-3 my-3"
      >
        <span className="text-theme-primaryText text-sm font-normal mr-1">
          #{topic.name}
        </span>
        <button
          disabled={disabled}
          className={`text-sm px-3 py-1 rounded-md ${
            disabled
               ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
                  : "bg-theme-secondaryText text-theme-primaryBackground"
          }`}
          onClick={()=>{
            
            handleJoinTopic(topic._id);
          }}
        >
          {buttonLabel}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col mx-3 mb-2">
      <div className="border-t my-6 border-t-theme-chatDivider"></div>
      <div className="space-y-6">
        {joinedTopics.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-theme-primaryText  mb-2">
              ✅ Joined Topics
            </h3>
            {joinedTopics.map((topic) => (
              <div
                key={topic._id}
                className="flex justify-between items-center bg-theme-tertiaryBackground rounded-lg px-4 py-3 my-3"
                onClick={() => handleTopic(topic._id)}
              >
                <span className="text-theme-primaryText text-sm font-normal mr-1">
                  #{topic.name}
                </span>
                <button
                  className="border border-theme-primaryText py-1 xs:px-3 px-2 rounded-md cursor-pointer text-theme-secondaryText text-sm font-inter "
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveTopic(topic._id);
                  }}
                >
                  Exit
                </button>
              </div>
            ))}
          </div>
        )}
        {otherTopics.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-theme-primaryText  mb-2">
              ➕ Other Topics
            </h3>
            {otherTopics.map(renderTopicRow)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTopicsTab;
