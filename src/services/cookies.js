import Cookies from "js-cookie";
import { domainUrl } from "./../utils/globals";

export const setAuthCookies = (token, user) => {
  const userData = {
    name: user.name,
    username: user.username,
    _id: user._id,
  };

  const cookieOptions = {
    domain: `.${domainUrl}`,
    path: "/",
  };

  Cookies.set("token", token, cookieOptions);
  Cookies.set("user", JSON.stringify(userData), cookieOptions);

  const expiryTime = new Date().getTime() + 14 * 24 * 60 * 60 * 1000;
  Cookies.set("tokenExpiry", expiryTime, cookieOptions);
};

export const getAuthToken = () => Cookies.get("token");

export const getUserData = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const checkTokenExpiry = () => {
  const tokenExpiry = Cookies.get("tokenExpiry");
  if (tokenExpiry && new Date().getTime() > tokenExpiry) {
    removeAuthCookies();
    return true;
  } else {
    return false;
  }
};

export const removeAuthCookies = () => {
  const cookieOptions = {
    domain: `.${domainUrl}`,
    path: "/",
  };

  Cookies.remove("token", cookieOptions);
  Cookies.remove("user", cookieOptions);
  Cookies.remove("tokenExpiry", cookieOptions);
};

export const updateAuthUsername = (newUsername) => {
  const user = getUserData();
  if (user) {
    user.username = newUsername;
    Cookies.set("user", JSON.stringify(user), {
      domain: `.${domainUrl}`,
      path: "/",
    });
  }
};

/*import Cookies from "js-cookie";
import { domainUrl } from "./../utils/globals";
export const setAuthCookies = (token, user) => {
  const userData = {
    name: user.name,
    username: user.username,
    _id: user._id,
  };
  Cookies.set("token", token);
  Cookies.set("user", JSON.stringify(userData));
  const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  Cookies.set("tokenExpiry", expiryTime);
};
export const getAuthToken = () => Cookies.get("token");
export const getUserData = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};
export const checkTokenExpiry = () => {
  const tokenExpiry = Cookies.get("tokenExpiry");
  if (tokenExpiry && new Date().getTime() > tokenExpiry) {
    removeAuthCookies();
    return true;
  } else {
    return false;
  }
};
export const removeAuthCookies = () => {
  Cookies.remove("token");
  Cookies.remove("user");
  const allCookies = Cookies.get();
  Object.keys(allCookies).forEach((cookieName) => {
    Cookies.remove(cookieName, { path: "/" });
    Cookies.remove(cookieName, { path: "/", domain: `.${domainUrl}` });
  });
};
export const updateAuthUsername = (newUsername) => {
  const user = getUserData();
  if (user) {
    user.username = newUsername;
    Cookies.set("user", JSON.stringify(user));
  }
};*/
