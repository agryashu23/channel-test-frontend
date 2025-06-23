// src/hooks/useInitializeApp.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "../redux/slices/authSlice";
import { fetchMyData, clearMyData } from "../redux/slices/myDataSlice";
import axios from "axios";
import { hostUrl } from "./../utils/globals";
import { setCsrfToken } from "../services/csrfToken";

const useInitializeApp = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(initializeAuth());
        // const response = await axios.get(`${hostUrl}/api/get-csrf-token`, {
        //   withCredentials: true,
        //   timeout: 5000,
        // });
        // setCsrfToken(response.data.csrfToken);
        if (auth.isLoggedIn) {
          await dispatch(fetchMyData());
        } else {
          dispatch(clearMyData());
        }
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
    };

    initializeApp();
  }, [dispatch, auth.isLoggedIn]);
};

export default useInitializeApp;
