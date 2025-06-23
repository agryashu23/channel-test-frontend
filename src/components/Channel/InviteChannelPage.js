import { joinChannelInvite } from "../../redux/slices/channelSlice.js";
import {
  React,
  useState,
  useEffect,
  useNavigate,
  useDispatch,
  useSelector,
} from "../../globals/imports";

const InviteChannelPage = ({ code, channelId, username }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [error, setError] = useState("Redirecting to the channel page...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      if (isLoggedIn) {
        const formDataToSend = new FormData();
        formDataToSend.append("channelId", channelId);
        formDataToSend.append("code", code);
        dispatch(joinChannelInvite(formDataToSend))
          .unwrap()
          .then((channel) => {
            setLoading(false);
            navigate(`c-id/topic/${channel.topics[0]}`);
          })
          .catch((error) => {
            setLoading(false);
            setError(
              "Invalid Code or Channel. Redirecting back to channel...."
            );
            setTimeout(() => {
              navigate(`/account/${username}/channel/${channelId}`);
            }, 1000);
          });
      } else {
        navigate(
          `/get-started?redirect=/account/${username}/channel/${channelId}?code=${code}`
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, isLoggedIn, channelId, code, navigate, username]);

  return (
    <div
      className="bg-theme-secondaryBackground 
    w-full h-full flex flex-col justify-center items-center"
    >
      <div className="border border-theme-chatDivider bg-theme-tertiaryBackground rounded-md px-8 py-8 flex flex-col">
        <p className="text-theme-secondaryText font-normal text-md ">{error}</p>

        <div className="mt-10">
          <div className="flex justify-center">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-primaryText"></div>
            )}
          </div>
        </div>
        <p className="text-theme-secondaryText font-normal text-sm mt-4 text-center">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default InviteChannelPage;
