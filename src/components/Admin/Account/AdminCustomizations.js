import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showCustomToast } from "../../../widgets/toast";
import {
  setBusinessField,
  setBusinessParameterField,
  updateBusinessCustomizations,
} from "../../../redux/slices/businessSlice";

const AdminCustomizations = () => {
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business);

  const handleToggle = (key) => {
    if (key === "allowDM" || key === "talkToBrand" || key === "viewMembers") {
      const currentVal = business.business?.parameters?.[key] ?? true;
      dispatch(
        setBusinessParameterField({
          field: key,
          value: !currentVal,
        })
      );
    } else if (key === "loginControl") {
      const currentVal = business.business?.loginControl ?? "api";
      dispatch(
        setBusinessField({
          field: key,
          value: currentVal === "api" ? "direct" : "api",
        })
      );
    } else {
      dispatch(
        setBusinessField({
          field: key,
          value: !business.business?.[key],
        })
      );
    }
  };

  // Save button handler
  const handleSave = async () => {
    try {
      const data = {
        allowDM: business.business?.parameters?.allowDM ?? true,
        talkToBrand: business.business?.parameters?.talkToBrand ?? true,
        viewMembers: business.business?.parameters?.viewMembers ?? true,
        whatsappNotifications:
          business.business?.whatsappNotifications ?? false,
        chatSummary: business.business?.chatSummary ?? false,
        loginControl: business.business?.loginControl ?? "api",
      };

      dispatch(updateBusinessCustomizations(data))
        .unwrap()
        .then(() => {
          showCustomToast("Customizations updated successfully");
        })
        .catch((error) => {
          console.error("Save failed", error);
        });
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const ToggleItem = ({ label, keyName, description }) => {
    const isOn =
      keyName === "allowDM"
        ? business.business?.parameters?.allowDM ?? true
        : keyName === "talkToBrand"
        ? business.business?.parameters?.talkToBrand ?? true
        : keyName === "viewMembers"
        ? business.business?.parameters?.viewMembers ?? true
        : keyName === "whatsappNotifications"
        ? business.business?.whatsappNotifications
        : keyName === "chatSummary"
        ? business.business?.chatSummary
        : keyName === "loginControl"
        ? business.business?.loginControl === "direct"
        : false;

    return (
      <div className="flex flex-col">
        <div className="flex items-center py-3">
          <span className="text-theme-secondaryText mr-4 sm:mr-6 sm:text-md text-sm">
            {label}
          </span>
          <button
            onClick={() => handleToggle(keyName)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isOn ? "bg-theme-sidebarColor" : "bg-theme-emptyEvent"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                isOn ? "translate-x-5" : ""
              }`}
            ></div>
          </button>
        </div>
        <p className="text-theme-emptyEvent text-xs font-normal">
          {description}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col pt-6 sm:px-8 px-4 bg-theme-tertiaryBackground w-full min-h-screen">
      <p className="text-theme-emptyEvent text-lg font-normal">Account</p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Customisations
      </p>
      <div className="border-t border-t-theme-chatDivider my-4"></div>

      <div className="space-y-5">
        <ToggleItem
          label="Whatsapp notifications"
          keyName="whatsappNotifications"
          description="• Enable this to allow customizations for whatsapp notifications in topics."
        />
        <ToggleItem
          label="Allow members to send direct message to you"
          keyName="talkToBrand"
          description="• Enable this to allow members to send direct message to you using Talk to us in topic page."
        />
        <ToggleItem
          label="Allow members to send direct message to other members"
          keyName="allowDM"
          description="• Enable this to allow members to send direct message to other members in chats (DM)."
        />
        <ToggleItem
          label="Chat summary generation"
          keyName="chatSummary"
          description="• Enable this to allow customizations for chat summary generation in topics."
        />
        <ToggleItem
          label="Sync users permissions from your side"
          keyName="loginControl"
          description="• Syncing users permissions from your side will allow you to manage users permissions from your side. Like which channel/topic is accessible by which user. For more info contact support."
        />
        <ToggleItem
          label="Allow members to view other members"
          keyName="viewMembers"
          description="• Enable this to allow members to view other members in topics."
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-max px-6 py-1.5 bg-theme-buttonEnable text-theme-secondaryText rounded-lg"
      >
        {business.customLoading ? "Loading..." : "Save"}
      </button>
    </div>
  );
};

export default AdminCustomizations;
