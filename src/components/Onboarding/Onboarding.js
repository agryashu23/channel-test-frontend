import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { domainUrl } from "./../../utils/globals";
import { updateUser } from "../../redux/slices/authSlice";
import { updateMyField } from "../../redux/slices/myDataSlice";
import Tick from "../../assets/icons/tick.svg";
import { useLocation } from "react-router-dom";
import { setOnboarding } from "../../redux/slices/authSlice";
import { ChannelImages } from "../constants/images";

import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";
import { useNavigate } from "react-router-dom";

import {
  getUserData,
  setAuthCookies,
  getAuthToken,
} from "./../../services/cookies";

const Onboarding = () => {
  const [isUsername, setIsUsername] = useState(null);
  const [domainName, setDomainName] = useState("");
  const [isUsernameLoading, setUsernameLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectDomain, setRedirectDomain] = useState("");

  const handleDomainChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-z0-9]*$/;
    if (regex.test(value)) {
      setDomainName(value);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get("redirect");
    const redirectParamDomain = searchParams.get("redirectDomain");
    if (redirectParam) {
      setRedirectUrl(redirectParam);
    }
    if (redirectParamDomain) {
      setRedirectDomain(redirectParamDomain);
    }
  }, [location.search]);

  const checkUsername = async () => {
    if (domainName !== "") {
      try {
        setUsernameLoading(true);
        const response = await postRequestUnAuthenticated("/check/username", {
          username: domainName,
        });
        setIsUsername(response.success);
        return response.success;
      } catch (error) {
        console.error("Error checking username", error);
        return false;
      } finally {
        setUsernameLoading(false);
      }
    }
    return false;
  };

  const handleClaimDomain = async (e) => {
    e.preventDefault();
    const isAvailable = await checkUsername();
    if (domainName !== "" && isAvailable) {
      try {
        const response = await postRequestAuthenticated("/claim/username", {
          username: domainName,
        });
        if (response.success === true) {
          const currentUser = getUserData();
          if (currentUser) {
            currentUser.username = domainName;
            setAuthCookies(getAuthToken(), currentUser);
          }
          dispatch(updateUser({ username: domainName }));
          dispatch(updateMyField({ name: "username", value: domainName }));
          if (redirectDomain !== "" && redirectUrl !== "") {
            window.location.replace(
              `https://${redirectDomain}.${domainUrl}${redirectUrl}`
            );
            dispatch(setOnboarding(false));
          } else if (redirectDomain !== "") {
            window.location.replace(`https://${redirectDomain}.${domainUrl}`);
            dispatch(setOnboarding(false));
          } else if (redirectUrl !== "") {
            navigate(`${redirectUrl}`, { replace: true });
            dispatch(setOnboarding(false));
          } else {
            navigate(`/account/${domainName}/welcome`, { replace: true });
            dispatch(setOnboarding(false));
          }
        } else {
          setIsUsername(false);
        }
      } catch (error) {
        console.error("Error claiming domain", error);
      }
    }
  };

  const handleSkip = () => {
    const currentUser = getUserData();
    if (redirectDomain !== "" && redirectUrl !== "") {
      window.location.replace(
        `https://${redirectDomain}.${domainUrl}${redirectUrl}`
      );
      dispatch(setOnboarding(false));
    } else if (redirectDomain !== "") {
      window.location.replace(`https://${redirectDomain}.${domainUrl}`);
      dispatch(setOnboarding(false));
    } else if (redirectUrl !== "") {
      navigate(`${redirectUrl}`, { replace: true });
      dispatch(setOnboarding(false));
    } else {
      navigate(`/account/${currentUser.username}/welcome`, { replace: true });
      dispatch(setOnboarding(false));
    }

  };

  return (
    <div className="flex sm:flex-row flex-col w-full  bg-theme-primaryBackground h-full">
      <div className="bg-theme-primaryBackground pl-3 pt-4 ">
        <img src={ChannelImages.CLogo.default} alt="logo" />
      </div>
      <div className="flex flex-col justify-center sm:items-start items-center w-full lg:pl-[10%] md:w-1/2 sm:w-3/5 h-full  bg-theme-primaryBackground">
        <p className="text-theme-secondaryText sm:text-3xl text-2xl font-medium tracking-wide font-inter">
          First things first,
          <br />
          claim your domain
        </p>
        <p className="text-theme-secondaryText text-sm font-light  mt-1 font-inter">
          before anyone else takes it. Also it’s free :)
        </p>
        <div className="relative lg:w-88px sm:w-80 xs:w-3/4 w-[90%] flex items-center mt-5 border border-theme-emptyEvent rounded-md p-2 bg-chipBackground">
          <input
            type="text"
            className="flex py-2 lg:w-48 w-44 text-theme-secondaryText font-normal font-inter bg-theme-primaryBackground focus:outline-none 
             dark:placeholder:text-primaryText placeholder:text-sm placeholder:font-normal placeholder:font-inter"
            placeholder="Your domain name"
            value={domainName}
            maxLength={40}
            onChange={handleDomainChange}
          />
          <div className="absolute right-2 flex flex-row items-center">
            <span className="border-l border-theme-chatDivider h-6 mr-2"></span>
            <span className="text-theme-emptyEvent text-sm font-normal">
              .{domainUrl}
            </span>
          </div>
        </div>
        {isUsernameLoading ? (
          <div className="text-theme-secondaryText">...</div>
        ) : (
          <div className="flex flex-row items-center mt-1">
            {isUsername && <img src={Tick} alt="Tick" className="w-5 h-5" />}
            <p
              className={`${
                isUsername ? "text-theme-secondaryText" : "text-theme-error"
              } font-light ml-1 font-inter text-xs`}
            >
              {isUsername
                ? "Available"
                : isUsername === false
                ? "Username already exist."
                : ""}
            </p>
          </div>
        )}
        <button
          className={`lg:w-88px md:w-80 w-3/4  py-2.5 mt-6 rounded-xl ${
            domainName !== ""
              ? "text-theme-primaryBackground bg-theme-secondaryText"
              : "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
          }  font-normal`}
          onClick={handleClaimDomain}
        >
          Claim Link
        </button>
        <button
          className={`lg:w-88px md:w-80 w-3/4 mt-4 text-center text-sm ${
            "text-theme-primaryText"
          }  font-light`}
          onClick={handleSkip}
        >
          Skip Now
        </button>
      </div>

      <div className="sm:flex  hidden justify-start items-center bg-theme-onboardBackground w-full sm:w-1/2 h-full">
        <img
          src="https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/Onboard.svg"
          alt="LinkOnboard"
          className="w-3/4 lg:w-1/2 h-auto bg-theme-onboardBackground"
        />
      </div>
    </div>
  );
};

export default Onboarding;
