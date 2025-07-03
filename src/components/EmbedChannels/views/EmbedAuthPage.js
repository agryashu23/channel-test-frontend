import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { hostUrl } from "../../../utils/globals";
import OtpInput from "react-otp-input";
import { setEmbedCredentials } from "../embedSlices/embedAuthSlice";
import googleLogo from "../../../assets/channel_images/google_logo.svg";
import { getCsrfToken } from "../../../services/csrfToken";
import StorageManager from "./../utility/storage_manager";
import { domainUrl } from "./../../../utils/globals";
import DateTimeCard from "./../../chips/widgets/DateTime";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMyData } from "../../../redux/slices/myDataSlice";

const EmbedAuthPage = ({  }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otpBackend, setOtpBackend] = useState("");
  const [otp, setOtp] = useState("");
  const [newError, setNewError] = useState("");
  const [channelId, setChannelId] = useState("");
  const [showOtp, setShowOtp] = useState("");
  const [embedData, setEmbedData] = useState(null);
  const [embedData2, setEmbedData2] = useState(null);
  const dispatch = useDispatch();
  const csrfToken = getCsrfToken();
  const [currentDomain, setCurrentDomain] = useState("");
  const location = useLocation();
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectDomain, setRedirectDomain] = useState("");
  const navigate = useNavigate();

  // const [channelId, setChannelId] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("embedData");
    const data2 = localStorage.getItem("embedFetchedData");
    if (data) {
      const dataId = JSON.parse(data); 
      setEmail(dataId?.email|| "");
      setCurrentDomain(dataId.domain);
      setEmbedData(dataId);
    }
    if(data2){
      const dataId = JSON.parse(data2);
      setEmbedData2(dataId);
    }
  }, []);

  const clearData = () => {
    setFullName("");
    setEmail("");
    setOtp("");
    setOtpBackend("");
    setNewError("");
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      let normalizedRedirect = redirectParam;
      normalizedRedirect = normalizedRedirect.replace(
        /(?:\/embed\/channels)+/g,
        ""
      );
      normalizedRedirect = `/embed/channels${
        normalizedRedirect.startsWith("/") ? "" : "/"
      }${normalizedRedirect}`;
      setRedirectUrl(normalizedRedirect);
      const match = redirectParam.match(/\/channel\/([^/]+)/);
      if (match && match[1]) {
        setChannelId(match[1]);
      }
    }
  }, [location.search]);

  const handleSendOtp = async () => {
    setNewError("");
    try {
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
      };
      await axios
        .post(`${hostUrl}/api/login/embed`, userData, {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.success) {
            setOtpBackend(response.data.otp);
            setShowOtp(true);
          } else {
            setNewError(response.data.message);
          }
        });
    } catch (error) {
      setNewError("Error Registering. Please try again");
    }
  };

  const handleChangeOtp = async (value) => {
    setOtp(value);
    
    if (value.length === 6 && value === otpBackend) {
      setNewError("");
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
        domain: currentDomain,
        channel: channelId,
        originalEmail:embedData?.email || null,
        originalChannel:embedData2?.selectedChannel || null,
        originalTopic:embedData2?.selectedTopic || null,
      };
      try {
        await axios
          .post(`${hostUrl}/api/verify/login/embed`, userData, {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            // withCredentials: true,
          })
          .then((response) => {
            if (response.data.success) {
              const user = response.data.user;
              const partialUser = {
                name: user.name,
                username: user.username,
                email: user.email,
                contact: user.contact,
                whatsapp_number: user.whatsapp_number,
                _id: user._id,
              };
              localStorage.setItem("user", JSON.stringify(partialUser));
              localStorage.setItem("auth-token", response.data.token);
              dispatch(
                setEmbedCredentials({
                  user: response.data.user,
                  token: response.data.token,
                })
              );
              clearData(); 

              dispatch(fetchMyData());
              if (redirectUrl !== "") {
                navigate(`${redirectUrl}`, {
                  replace: true,
                });
              } else {
                if (embedData2) {
                  navigate(
                    `/embed/channels/account/${embedData2.username}/channel/${embedData2.selectedChannel}`,
                    {
                      replace: true,
                    }
                  );
                }
              }
            } else {
              setNewError(response.data.message);
            }
          });
      } catch (error) {
        setNewError("Error Registering. Please try again");
      }
    } else if (otp.length === 6) {
      setNewError("Enter Correct Otp");
    }
  };

  const handleGoogleAuthPopup = () => {
    const originalDomain = embedData.domain;

    setNewError("");
    const authUrl = `https://channels.social/embed/google-auth/login?domain=${window.location.origin}&hostDomain=${originalDomain}&channel=${channelId}&originalEmail=${embedData?.email || null}&originalChannel=${embedData2?.selectedChannel || null}&originalTopic=${embedData2?.selectedTopic || null}`;
    const popup = window.open(
      authUrl,
      "_blank",
      "width=500,height=600,left=100,top=100"
    );
    const handleMessage = (event) => {
      const allowedOrigin = "https://channels.social";

      if (event.origin !== allowedOrigin) return;

      const { success, user, token } = event.data;
      if (success) {
        const partialUser = {
          name: user.name,
          _id: user._id,
          email: user.email,
          username: user.username,
          contact: user.contact,
          whatsapp_number: user.whatsapp_number,
        };

        localStorage.setItem("auth-token", token);
        localStorage.setItem("user", JSON.stringify(partialUser));
        dispatch(
          setEmbedCredentials({
            user,
            token,
          })
        );
        dispatch(fetchMyData());
        if (redirectUrl !== "") {
          navigate(`${redirectUrl}`, {
            replace: true,
          });
        } else {
          if (embedData2) {
            navigate(
              `/embed/channels/account/${embedData2.username}/channel/${embedData2.selectedChannel}`,
              {
                replace: true,
              }
            );
          }
        }
      }
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="flex items-center justify-center h-full pb-10 bg-theme-secondaryBackground">
      <div className="max-w-[450px] w-[90%] xs:w-3/4 sm:w-3/5 md:1/2 lg:w-1/3 xl:w-[30%] flex flex-col items-center ">
        <h3 className="text-2xl sm:text-4xl text-center font-medium tracking-wider text-theme-secondaryText font-inter">
          Sign In
        </h3>
        <p className="text-theme-secondaryText text-sm mt-2">"ʕっ•ᴥ•ʔっ"</p>
        <div className="mt-6 space-y-6 w-full px-6">
          <div className="relative">
            <label
              className="absolute left-4 -top-2 text-xs z-20 font-light font-inter bg-theme-secondaryBackground 
              text-theme-secondaryText"
            >
              Full Name (optional)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pt-3 pb-4 pl-4 pr-3 rounded-md  text-sm font-light font-inter border border-theme-modalBorder bg-transparent 
              text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
              placeholder=""
            />
          </div>

          <div className="relative">
            <label
              className="absolute left-4 -top-2 text-xs z-20 font-light font-inter bg-theme-secondaryBackground 
              text-theme-secondaryText"
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pt-3 pb-4 pl-3 pr-20 rounded-md text-sm  font-light font-inter border border-theme-modalBorder bg-transparent 
              text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
              placeholder=""
            />
            <div
              className="bg-theme-secondaryText cursor-pointer px-2 py-1.5 text-theme-primaryBackground
             absolute text-xs right-2 top-3 rounded-md font-light"
              onClick={handleSendOtp}
            >
              Send Otp
            </div>
          </div>

          {showOtp && (
            <div className="flex justify-center">
              <OtpInput
                value={otp}
                onChange={handleChangeOtp}
                numInputs={6}
                renderSeparator={<span className="w-2 xs:w-4"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "36px",
                      height: "40px",
                      borderRadius: "6px",
                      border: isDark ? "1px solid #5a5a5a" : "#edecea",
                      backgroundColor: isDark ? "#2B2930" : "#e8e8e8",
                      textAlign: "center",
                      color: isDark ? "#ffffff" : "#202020",
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="text-center text-theme-error my-4 font-light text-sm tracking-wide">
          {newError}
        </div>

        <button
          onClick={handleGoogleAuthPopup}
          className="w-max px-6 py-2 mb-4 text-xs font-normal items-center
          text-theme-secondaryText bg-theme-tertiaryBackground rounded-xl border border-chatDivider"
        >
          <img
            src={googleLogo}
            alt="Google logo"
            className="inline w-6 h-6 mr-2"
          />
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </button>
      </div>
    </div>
  );
};

export default EmbedAuthPage;
