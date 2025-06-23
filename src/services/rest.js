import axios from "axios";
import { getAuthToken } from "./cookies";
import { hostUrl } from "./../utils/globals";
import StorageManager from "./../components/EmbedChannels/utility/storage_manager";

export const isEmbeddedOrExternal = () => {
  if (typeof window === "undefined") return false;

  const host = localStorage.getItem("embedData");
  if (!host) return false;
  const data = JSON.parse(host);
  const domain = data.domain;
  return !(
    domain === "channels.social" ||
    // domain === "localhost" ||
    domain.endsWith(".channels.social")
  );
};

export const postRequestAuthenticated = async (endpoint, data) => {
  const externalToken = localStorage.getItem("auth-token");
  const authToken = getAuthToken();
  const selectedToken = !isEmbeddedOrExternal() ? authToken : externalToken;
  // console.log(selectedToken);
  // console.log(!isEmbeddedOrExternal());
  try {
    if (selectedToken) {
      const url = `${hostUrl}/api${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          "auth-token": selectedToken,
          // "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: !isEmbeddedOrExternal(),
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        return {
          error: true,
          success: false,
          auth: false,
          message: "Invalid Token",
        };
      } else {
        return { error: true, success: false, message: "Network Error" };
      }
    } else {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    }
  } catch (e) {
    console.error("Error in authenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
export const postRequestAuthenticatedWithFile = async (endpoint, data) => {
  const externalToken = localStorage.getItem("auth-token");
  const authToken = getAuthToken();
  const selectedToken = !isEmbeddedOrExternal() ? authToken : externalToken;

  try {
    if (selectedToken) {
      const url = `${hostUrl}/api${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          "auth-token": !isEmbeddedOrExternal() ? authToken : externalToken,
          // "X-CSRF-Token": csrfToken,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: !isEmbeddedOrExternal(),
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        return {
          error: true,
          success: false,
          auth: false,
          message: "Invalid Token",
        };
      } else {
        return { error: true, success: false, message: "Network Error" };
      }
    } else {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    }
  } catch (e) {
    console.error("Error in authenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
export const postRequestUnAuthenticatedWithFile = async (
  endpoint,
  data,
  headers = {}
) => {
  try {
    // const csrfToken = getCsrfToken();
    const url = `${hostUrl}/api${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        // "X-CSRF-Token": csrfToken,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: !isEmbeddedOrExternal(),
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    } else {
      return { error: true, success: false, message: "Network Error" };
    }
  } catch (e) {
    console.error("Error in authenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
export const postRequestUnAuthenticated = async (
  endpoint,
  data,
  headers = {}
) => {
  try {
    // const csrfToken = getCsrfToken();
    const url = `${hostUrl}/api${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        // "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: !isEmbeddedOrExternal(),
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    } else {
      return { error: true, success: false, message: "Network Error" };
    }
  } catch (e) {
    console.error("Error in unauthenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
