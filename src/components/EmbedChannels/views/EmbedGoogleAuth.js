import { useEffect } from "react";
import axios from "axios";

const GoogleAuthPopup = () => {
  console.log("work2");

  const redirectToGoogleAuth = (redirectDomain, hostDomain, channel) => {
    const clientId =
      "391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(
      "https://channels.social/auth/google/callback"
    );
    const scope = encodeURIComponent("email profile");
    const stateObject = {
      redirectDomain,
      hostDomain,
      channel,
    };
    const state = encodeURIComponent(JSON.stringify(stateObject));

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${state}&prompt=select_account`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectDomain = urlParams.get("domain");
    const hostDomain = urlParams.get("hostDomain");
    const channel = urlParams.get("channel");

    setTimeout(() => {
      redirectToGoogleAuth(redirectDomain, hostDomain, channel);
    }, 100); // delay allows console.log to flush
  }, []);

  return (
    <div className="text-theme-secondaryText text-md font-normal text-center pt-12">
      Redirecting to Google Authentication...
    </div>
  );
};

export default GoogleAuthPopup;
