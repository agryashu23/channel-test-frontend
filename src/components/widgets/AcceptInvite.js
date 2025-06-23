import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { hostUrl } from "../../utils/globals";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icons/channels_logo.svg";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing your request...");
  const navigate = useNavigate();

  useEffect(() => {
    const channelId = searchParams.get("channelId");
    const userId = searchParams.get("userId");

    fetch(
      `${hostUrl}/api/accept/channel/invite?channelId=${channelId}&userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("You have successfully accepted the channel invite!");
        } else {
          setMessage(data.message || "Failed to accept the invite.");
        }
      })
      .catch((error) => {
        console.error("Error accepting invite:", error);
        setMessage("An error occurred while processing your request.");
      });
  }, [searchParams]);

  return (
    <div className="flex flex-col items-start w-full h-full mt-4 ">
      <img
        src={Logo}
        alt="logo"
        className="ml-4 h-8 text-start items-start justify-start"
      />
      <div className="text-theme-secondaryText  justify-center flex flex-col mx-auto mt-10 ">
        <h2>{message}</h2>
        <div
          className={`py-2 mt-4 px-3 cursor-pointer mx-auto text-theme-primaryBackground bg-theme-secondaryText w-max
                 
                   rounded-lg text-xs sm:text-sm font-inter`}
          onClick={() => navigate("/")}
        >
          Back to home
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
