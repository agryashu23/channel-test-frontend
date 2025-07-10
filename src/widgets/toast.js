import { toast } from "react-toastify";

export const showCustomToast = (message,autoClose=1000) => {
  const isDark = document.documentElement.classList.contains("dark");
  const backgroundColor = isDark ? "#e8e8e8" : "#202020"; 
  const textColor = isDark ? "#32302c" : "#c4c4c4";       
  const progressColor = isDark ? "#4b4bf9" : "#8884ff";   
  const isSmallScreen = window.innerWidth < 640;

  toast(message, {
    style: {
      backgroundColor,
      color: textColor,
      borderRadius: "8px",
      padding: "10px 10px",
      fontSize: isSmallScreen ? "14px" : "16px", 
      fontWeight: isSmallScreen ? 300 : 400,   
    },
    // progressStyle: {
    //   background: progressColor,
    // },
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    autoClose: autoClose,
  });
};
