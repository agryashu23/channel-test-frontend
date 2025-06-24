import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import { fetchMyData, clearMyData } from "../../../redux/slices/myDataSlice";
import { setTheme } from "../../../redux/slices/themeSlice";
import {
  initializeEmbedAuth,
  checkAutoLogin,
  logOutEmbed,
} from "../embedSlices/embedAuthSlice";
import { setEmbedItem } from "../embedSlices/embedHomeSlice";
import Modals from "./../../../utils/modals";
import EmbedHeaderPage from "./EmbedHeaderPage";
import { fetchBusinessCredentials } from "../../../redux/slices/businessSlice";

const EmbedHomePage = () => {
  const [loading, setLoading] = useState(false);
  const [embedLoadTimeout, setEmbedLoadTimeout] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const business = useSelector((state) => state.business);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const embedDataReceivedRef = useRef(false);
  const {username} = useParams();



  const fetchData = async () => {
    try {
      const storedEmbedData = localStorage.getItem("embedData");
      if (!storedEmbedData) return;

      const { apiKey, selectedChannel, selectedTopic, domain, channels } =
        JSON.parse(storedEmbedData);

      const formData = new FormData();
      formData.append("apiKey", apiKey);
      formData.append("selectedChannel", selectedChannel || "");
      formData.append("selectedTopic", selectedTopic || "");
      formData.append("domain", domain || "");
      formData.append("echannels", JSON.stringify(channels));

      const response = await postRequestUnAuthenticated(
        "/generate/embed-data",
        formData
      );

      if (response.success) {
        localStorage.setItem("embedFetchedData", JSON.stringify(response));
        dispatch(setEmbedItem({ field: "channels", value: response.channels }));
        dispatch(
          setEmbedItem({
            field: "selectedChannel",
            value: response.selectedChannel,
          })
        );
        dispatch(
          setEmbedItem({
            field: "selectedTopic",
            value: response.selectedTopic,
          })
        );
        dispatch(setEmbedItem({ field: "username", value: response.username }));

        embedDataReceivedRef.current = true;
        localStorage.removeItem("embedReloadAttempts");
      } else {
        console.warn("Failed to fetch embed data:", response);
      }
    } catch (error) {
      console.error("Error fetching embed data:", error);
    }
  };

  const navigateToChannelFromStorage = () => {
    const stored = localStorage.getItem("embedFetchedData");
    const authData = localStorage.getItem("auth-token");
    const data = JSON.parse(stored);
    if (!stored) return;

    if (!authData) {
      navigate(
        `/embed/channels/account/${data.username}/channel/${data.selectedChannel}`
      );
    } else if (data.selectedChannel && data.selectedTopic) {
      navigate(
        `/embed/channels/account/${data.username}/channel/${data.selectedChannel}/c-id/topic/${data.selectedTopic}`
      );
    } else if (data.selectedChannel) {
      navigate(
        `/embed/channels/account/${data.username}/channel/${data.selectedChannel}`
      );
    }
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      const message = event.data;
      if (
        typeof message === "object" &&
        message.type === "embedData" &&
        message.source === "channels-widget"
      ) {
        try {
          setLoading(true);
          const embedData = message.payload;
          localStorage.setItem("embedData", JSON.stringify(embedData));
          localStorage.setItem("theme", embedData.theme);
          document.documentElement.classList.toggle(
            "dark",
            embedData.theme === "dark"
          );
          dispatch(setTheme(embedData.theme));
          dispatch(logOutEmbed());
          dispatch(clearMyData());
          const formData = new FormData();
          formData.append("email", embedData.email);
          formData.append("domain", embedData.domain);
          formData.append("apiKey", embedData.apiKey);
          formData.append("channelName", embedData.selectedChannel);
          formData.append("autoLogin", embedData.autoLogin);
          const authResult = await dispatch(checkAutoLogin(formData))
            .unwrap()
            .catch(() => null);
          if (authResult && authResult.token && authResult.user) {
            const user = authResult.user;
            localStorage.setItem(
              "user",
              JSON.stringify({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                contact: user.contact,
                whatsapp_number: user.whatsapp_number,
              })
            );
            localStorage.setItem("auth-token", authResult.token);
            dispatch(fetchMyData());
          }

          dispatch(initializeEmbedAuth());
          await fetchData();
          if (!embedLoadTimeout) {
            setReadyToRender(true);
            navigateToChannelFromStorage();
          }
        } catch (err) {
          console.error("Error handling embedData:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!embedDataReceivedRef.current) {
        setEmbedLoadTimeout(true);
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (embedLoadTimeout) {
      const attempts = parseInt(
        localStorage.getItem("embedReloadAttempts") || "0"
      );
      if (attempts < 3) {
        localStorage.setItem("embedReloadAttempts", attempts + 1);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        console.warn("Max reload attempts reached");
      }
    }
  }, [embedLoadTimeout]);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      {/* <div
        className="absolute top-2 right-4 z-50 bg-white text-black px-3 py-1 rounded shadow"
        onClick={() => {
          // optional: redirect or call window.parent.postMessage to close iframe
          window.parent.postMessage({ type: "closeChannelsWidget" }, "*");
        }}
      >
        ✖ Close Channel
      </div> */}
      {!embedLoadTimeout && !loading && (
        <div className="flex w-full">
          <EmbedHeaderPage />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden ">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <div className="w-full h-full-height-56">
          {loading || !readyToRender ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin border-theme-secondaryText"></div>
              <p className="mt-4 text-2xl font-normal text-theme-secondaryText">
                Loading...
              </p>
            </div>
          ) : embedLoadTimeout && !readyToRender ? (
            <div className="text-center mt-10">
              <p className="text-theme-secondaryText mb-2">
                Internet connection is slow. Try refreshing.
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-theme-secondaryText rounded"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          ) : (
            <Outlet />
          )}
          <Modals />
        </div>
      </div>
    </div>
  );
};

export default EmbedHomePage;
