//  export const getAppPrefix = () => {
import StorageManager from "./storage_manager";
//    const hostname = window.location.hostname;
//    const isChannelsDomain =
//      hostname === "channels.social" || hostname.endsWith(".channels.social");
//    return isChannelsDomain ? "" : "/embed/channels";
//  };

export const getAppPrefix = () => {
  const host = localStorage.getItem("embedData");
  if (!host) return "";
  const data = JSON.parse(host);
  const domain = data.domain;
  const isChannelsDomain =
    domain === "channels.social" || domain.endsWith(".channels.social");
  return isChannelsDomain ? "" : "/embed/channels";
};
