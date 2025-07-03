import { setChannelOnce } from "../../../redux/slices/channelItemsSlice";
import { domainUrl } from "../../../utils/globals";
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper";
import { joinTopic, leaveTopic } from "../../../redux/slices/reorderTopicSlice";
import { showCustomToast } from "../../../widgets/toast";
import { setModalModal } from "../../../redux/slices/modalSlice";
import {ChannelImages} from "../../constants/images";
import {
    React,
    useNavigate,
    useDispatch,
    useSelector,
    useModal,
  } from "../../../globals/imports";
import { usePaymentHandler } from "../../../utils/paymentPage";

const UserTopicsTab = ({username,isSubdomain,galleryUsername,channelId}) => {
  const myData = useSelector((state) => state.myData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topics = useSelector((state) => state.reorderTopic.topics);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { handleOpenModal } = useModal();
  const { handlePayment } = usePaymentHandler();

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
            if(response.success && response.paywall && response.paywallPrice>0){
              const data = {
                amount:response.paywallPrice,
                currency:"INR",
                topic:response.topic._id,
                name:response.topic.name,
                channel:response.topic.channel,
                type:"topic",
                username:username
              }
              handlePayment(data,"topic");
              return;
            }
            dispatch(setChannelOnce(false));
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
    const isJoined = member?.status === "joined";
    const isRequested = member?.status === "request";
    const buttonLabel = isRequested ? "Requested" : "Join";
    const disabled = isRequested;

    return (
        <div
          key={topic._id}
          className="flex flex-row justify-between items-center bg-theme-tertiaryBackground rounded-lg px-4 py-3 my-3"
        >
          <div className="flex flex-col mr-1">
            <span className="text-theme-primaryText text-sm font-normal">
              #{topic.name}
            </span>
            {!isJoined &&  <div className="flex flex-row items-center mt-0.5">
              <img className="mr-1 w-3 h-3 mt-0.5 dark:block hidden" loading="lazy" src={topic.visibility==="paid"?ChannelImages.Secure.default:topic.visibility==="anyone"?
                ChannelImages.LockOpen.default:ChannelImages.Lock.default} alt="lock"  />
                <img className="mr-1 w-3 h-3 mt-0.5 dark:hidden block" loading="lazy" src={topic.visibility==="paid"?ChannelImages.SecureLight.default:topic.visibility==="anyone"?
                ChannelImages.LockOpenLight.default:ChannelImages.LockLight.default} alt="lock-light"  />
              <p className="mt-1 text-xs font-light text-theme-emptyEvent">
                {topic.visibility==="paid"
                  ? `This topic requires a ₹${topic.paywallPrice} fee to join.`
                  : topic.visibility === "anyone"
                  ? "Public topic — anyone can join."
                  : "Invite-only — admin approval required."}
              </p>
            </div>}
          </div>
         
          <button
            disabled={disabled}
            className={`text-sm px-3 py-1.5 rounded-md ${
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
                className="flex justify-between cursor-pointer items-center bg-theme-tertiaryBackground rounded-lg px-4 py-3 my-3"
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
