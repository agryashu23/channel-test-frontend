import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { hostUrl } from "./../../../utils/globals";

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const fullHash = window.location.hash;
    console.log("🌐 Callback hash:", fullHash);

    const hashParams = new URLSearchParams(fullHash.substring(1));
    const accessToken = hashParams.get("access_token");
    const stateRaw = hashParams.get("state");
    let redirectDomain = null;
    let hostDomain = null;
    let channel = null;

    try {
      const decoded = JSON.parse(decodeURIComponent(stateRaw));
      redirectDomain = decoded.redirectDomain;
      hostDomain = decoded.hostDomain;
      channel = decoded.channel;
    } catch (err) {
      console.error("❌ Failed to decode state:", err);
    }

    if (accessToken && redirectDomain) {
      fetchUserDetails(accessToken, redirectDomain, hostDomain, channel);
    } else {
      console.log("No access token or redirect domain received");
      window.close(); // Close popup if invalid
    }
  }, [searchParams]);

  const fetchUserDetails = async (
    accessToken,
    redirectDomain,
    hostDomain,
    channel
  ) => {
    try {
      // Get user info
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userData = response.data;

      const registerResponse = await axios.post(
        `${hostUrl}/api/embed/google/auth`,
        {
          name: userData.name,
          email: userData.email,
          domain: hostDomain,
          channel: channel,
        }
      );
      console.log(registerResponse);

      if (registerResponse.data.success) {
        const { user, token } = registerResponse.data;

        window.opener.postMessage(
          { success: true, user, token },
          redirectDomain
        );
        window.close();
      }
    } catch (error) {
      console.log("Error during authentication:", error);
      window.close();
    }
  };

  return (
    <div className="text-theme-secondaryText text-md font-normal pl-4 pt-4">
      Processing Google authentication...
    </div>
  );
};

export default GoogleAuthCallback;
