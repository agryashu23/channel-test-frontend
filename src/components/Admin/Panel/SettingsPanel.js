import CopyIcon from "../../../assets/icons/copy_icon.png";
import { React, useState, useSelector } from "../../../globals/imports.js";

const SettingsPanel = () => {
  const [copied, setCopied] = useState(false);
  const business = useSelector((state) => state.business);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(business.business.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };
  return (
    <div className="flex flex-col px-4 pt-6 bg-theme-tertiaryBackground">
       <p className="text-theme-emptyEvent text-lg font-normal">
        Panel
      </p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Settings
      </p>
      <div className="border-t border-t-theme-chatDivider my-4 "></div>
      <div>
        <p className="text-md text-theme-primaryText font-light mt-6 mb-2">
          API Key
        </p>
        <div className="flex flex-row items-center mt-1">
          <input
            type="password"
            value={business.business.apiKey}
            readOnly
            className="sm:w-1/2 w-3/4 bg-theme-primaryBackground px-4 py-4 rounded-lg text-sm text-theme-secondaryText "
          />
          <div className="relative">
            <img
              src={CopyIcon}
              alt="Copy"
              className="ml-4 cursor-pointer h-6 w-6"
              onClick={handleCopy}
            />
            {copied && (
              <p className="absolute bottom-6 left-2 text-xs text-theme-emptyEvent mt-1">
                Copied
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-md text-theme-primaryText font-light mt-6 mb-2">
        Domain name
      </p>
      <div className="flex flex-row items-center">
        <input
          type="text"
          value={business.business.domain}
          readOnly
          className="sm:w-1/2 w-3/4 bg-theme-primaryBackground px-4 py-4 rounded-lg text-sm text-theme-secondaryText "
        />
        <p className="ml-3 text-sm mt-1 text-theme-emptyEvent italic ">
          Read only
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
