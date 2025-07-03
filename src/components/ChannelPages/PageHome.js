import PageForm from "./PageForm";
import PageChat from "./PageChat";
import {
  fetchTopic,
  setTopicField,
  fetchTopicSubscription,
} from "../../redux/slices/topicSlice";
import { fetchChannel } from "../../redux/slices/channelSlice";
import TopicHomeSkeleton from "./../skeleton/Topic/TopicHomeSkeleton";
import InviteTopicPage from "./../Channel/InviteTopicPage";
import { connectSocketWithUser } from "../../utils/socket";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";
import { fetchBusinessCredentials } from "../../redux/slices/businessSlice";

import {
  React,
  useState,
  useEffect,
  useNavigate,
  useDispatch,
  useSelector,
  useParams,
  useLocation,
  useSearchParams,
} from "../../globals/imports";

const PageHome = () => {
  const { channelId, topicId } = useParams();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topic);
  const topicStatus = useSelector((state) => state.topic.topicstatus);
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const galleryUsername = useSelector((state) => state.galleryData.username);
  const location = useLocation();
  const fromGallery = location.state?.fromGallery;
  const params = useParams();
  const username = fromGallery ? galleryUsername : params.username;
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");
  const navigate = useNavigate();
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const business = useSelector((state) => state.business);

  useEffect(() => {
    if (isLoggedIn && username) {
      if(!business.business?._id){
        dispatch(fetchBusinessCredentials(username));
      }
    }
  }, [isLoggedIn,username]);

  useEffect(() => {
    if(isLoggedIn && myUserId){
      dispatch(fetchTopic(topicId));
    }
  }, [topicId, channelId]);

  useEffect(() => {
    if (isLoggedIn && myUserId) {
      connectSocketWithUser(myUserId);
    }
  }, [isLoggedIn, myUserId]);

  

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  useEffect(() => {
    if (!isLoggedIn && !myUserId) {
      const timeout = setTimeout(() => {
        navigate(
          `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${username}/channel/${channelId}/c-id/topic/${topicId}`
        );
      }, 500); 
      return () => clearTimeout(timeout);
    }
  }, [isLoggedIn, username, channelId, topicId, myUserId, navigate]);

  const loading = topicStatus === "loading";

  const isMember = topic?.members?.find(member=>member?.user?.toString()===myUserId.toString() && member.status==="joined");
  const isRequested = topic?.members?.find(member=>member?.user?.toString()===myUserId.toString() && member.status==="request");
  const isTopicOwner = topic?.user?._id ===myUserId;

  if (inviteCode) {
    return (
      <InviteTopicPage
        code={inviteCode}
        topicId={topicId}
        username={username}
        channelId={channelId}
      />
    );
  }

  if (loading || !topic || !topic._id) {
    return <TopicHomeSkeleton />;
  }

  if (isLoggedIn &&  myUserId && !isTopicOwner && !isMember && isRequested) {
    return (
      <div className="w-full h-screen bg-theme-secondaryBackground px-4 text-center flex flex-col justify-center font-bold text-lg text-theme-secondaryText">
        <p>You have already requested to join this topic. Waiting for approval...</p>
        <div
          className="cursor-pointer text-sm font-normal text-center mt-4 rounded-lg mx-auto
         bg-theme-secondaryText py-2 px-3 text-theme-primaryBackground w-max"
          onClick={() =>
            navigate(`${getAppPrefix()}/account/${username}/channel/${channelId}`)
          }
        >
          Return to Channel Page
        </div>
      </div>
    );
  }
  if (isLoggedIn &&  myUserId && !isTopicOwner &&  !isMember && !isRequested) {
    return (
      <div className="w-full h-screen bg-theme-secondaryBackground px-4 text-center flex flex-col justify-center font-bold text-lg text-theme-secondaryText">
        <p>You have not joined this topic. Please join the Topic from Channel Page.</p>
        <div
          className="cursor-pointer text-sm font-normal text-center mt-4 rounded-lg mx-auto
         bg-theme-secondaryText py-2 px-3 text-theme-primaryBackground w-max"
          onClick={() =>
            navigate(`${getAppPrefix()}/account/${username}/channel/${channelId}`)
          }
        >
          Return to Channel Page
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-theme-secondaryBackground flex flex-row ">
      <div className="flex-1 overflow-hidden">
        <PageChat
          topicId={topicId}
          topic={topic}
          channelId={channelId}
          isLoggedIn={isLoggedIn}
          myData={myData}
          channelName={topic.channel.name}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isBottomSheetOpen}
          username={username}
        />
      </div>

      <div className="">
        <PageForm
          isOpen={isBottomSheetOpen}
          onClose={closeBottomSheet}
          topic={topic}
          channel={topic.channel}
        />
      </div>
    </div>
  );
};

export default PageHome;
