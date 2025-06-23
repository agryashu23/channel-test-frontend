import { toast } from "react-toastify";

export const showCustomToast = (message) => {
  const isDark = document.documentElement.classList.contains("dark");
  const backgroundColor = isDark ? "#e8e8e8" : "#202020"; 
  const textColor = isDark ? "#32302c" : "#c4c4c4";       
  const progressColor = isDark ? "#4b4bf9" : "#8884ff";   

  toast(message, {
    style: {
      backgroundColor,
      color: textColor,
      borderRadius: "8px",
      padding: "10px 10px",
    },
    // progressStyle: {
    //   background: progressColor,
    // },
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    autoClose: 1500,
  });
};
