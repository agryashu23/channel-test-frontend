import ProfileIcon from "../../../assets/icons/profile.svg";
import {
  makeAutoLoginRequest,
  acceptChannelRequest,
  declineChannelRequest,
  fetchChannelRequests,
} from "../../../redux/slices/businessSlice";
import ColorProfile from "../../../assets/images/color_profile.svg";
import {
  React,
  useState,
  useDispatch,
  useSelector,
  useEffect,
} from "../../../globals/imports.js";

const RequestTab = ({ apiKey }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("channel");

  const business = useSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchChannelRequests());
  }, []);

  const makeAutoLogin = () => {
    dispatch(makeAutoLoginRequest(apiKey));
  };
  const handleAcceptChannelRequest = (channelId, userId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("channelId", channelId);
    formDataToSend.append("userId", userId);
    dispatch(acceptChannelRequest(formDataToSend));
  };

  const handleDeclineChannelRequest = (channelId, userId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("channelId", channelId);
    formDataToSend.append("userId", userId);
    dispatch(declineChannelRequest(formDataToSend));
  };
  

  return (
    <div className="flex flex-col sm:pl-10 pl-5 sm:pr-0 pr-4 pt-6 lg:w-4/5  w-full">
      <p className="text-theme-secondaryText text-lg md:text-xl lg:text-2xl font-normal ">
        Requests
      </p>
      <div className="border-[1px] border-theme-tertiaryBackground my-4 pl-6"></div>
      <div className="flex flex-col">
        <div className="flex border-b border-theme-chatDivider font-normal text-sm mt-4 w-max">
          <button
            className={`py-3 sm:px-10 px-4 ${
              activeTab === "channel"
                ? "border-b-2 text-theme-secondaryText border-theme-secondaryText"
                : "text-theme-primaryText"
            }`}
            onClick={() => setActiveTab("channel")}
          >
            Channel Requests
          </button>
          <button
            className={`py-3 sm:px-10 px-4 ${
              activeTab === "login"
                ? "border-b-2 text-theme-secondaryText border-theme-secondaryText"
                : "text-theme-primaryText"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Auto-login Request
          </button>
        </div>
      </div>
      <div className="mt-10 ">
        {activeTab === "channel" ? (
          business.requests.length > 0 ? (
            <div className="rounded-lg border border-theme-chatDivider p-4 flex flex-col lg:mr-0 mr-5">
              {business.requests.map((request) => (
                <div key={request._id} className="flex flex-row space-y-2">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row items-start">
                      {request.logo ? (
                        <img
                          src={request.logo}
                          alt="profile-icon"
                          className="rounded-md w-12 h-12 object-cover"
                        />
                      ) : request.color_logo ? (
                        <div
                          className="rounded-full w-12 h-12 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: request?.color_logo }}
                        >
                          <img
                            src={ColorProfile}
                            alt="color-profile"
                            className="w-8 h-8"
                          />
                        </div>
                      ) : (
                        <img
                          src={ProfileIcon}
                          alt="profile-icon"
                          className="rounded-md w-12 h-12 object-cover"
                        />
                      )}
                      <div className="flex flex-col justify-between ml-2">
                        <p className="text-theme-secondaryText font-normal sm:text-md text-sm">
                          {request.username}
                        </p>
                        <p className="italic text-theme-primaryText sm:text-sm text-xs">
                          {request.channel_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                      <div
                        className="bg-theme-secondaryText rounded-lg
                       text-theme-primaryBackground text-center sm:px-5 px-2 py-2 text-sm"
                        onClick={() =>
                          handleAcceptChannelRequest(
                            request.channel_id,
                            request._id
                          )
                        }
                      >
                        Accept
                      </div>
                      <div
                        className="border-theme-secondaryText border rounded-lg
                       text-theme-secondaryText text-center sm:px-5 px-2 py-2 text-sm"
                        onClick={() =>
                          handleDeclineChannelRequest(
                            request.channel_id,
                            request._id
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
            <div className="text-theme-secondaryText font-normal text-md ml-4 ">
              No requests found.
            </div>
          )
        ) : (
          <div className="flex flex-col space-y-4">
            <p className="text-theme-primaryText text-sm font-normal">
              Want your users to log in automatically without entering
              credentials each time? Request Auto Login access to streamline
              their experience and boost retention. Once approved, your users
              will be authenticated instantly via secure token-based login.
            </p>

            {!business.business.autoLogin && (
              <div
                className={`${
                  business.business.auto_login_request
                    ? "bg-theme-buttonDisable text-theme-buttonDisableText"
                    : "bg-theme-secondaryText text-theme-primaryBackground"
                } text-sm font-normal rounded-md cursor-pointer
              px-6 py-2 w-max`}
                onClick={makeAutoLogin}
              >
                {business.business.auto_login_request
                  ? "Requested"
                  : "Request Auto Login"}
              </div>
            )}
            {business.business.autoLogin && (
              <div className="text-theme-secondaryText text-md font-normal">
                Auto Login is on.✅
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTab;
