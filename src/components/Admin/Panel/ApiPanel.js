import React, { useState } from "react";
import { postRequestAuthenticated } from "../../../globals/imports.js";
import CopyIcon from "../../../assets/icons/copy_icon.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


const ApiPanel = () => {
  const [secureCode, setSecureCode] = useState("");
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const res = await postRequestAuthenticated("/business/generate-code");
      if (res.success) {
        setSecureCode(res.code);
      }
    } catch (error) {
      console.error("Failed to generate secure code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (secureCode) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      navigator.clipboard.writeText(secureCode);
    }
  };

  return (
    <div className="flex flex-col sm:px-10 px-5   pt-6 h-full overflow-y-auto bg-theme-tertiaryBackground">
      <p className="text-theme-emptyEvent text-lg font-normal">
        Panel
      </p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        API
      </p>

      <div className="border-t border-t-theme-chatDivider my-4 "></div>

      <p className="text-sm text-theme-emptyEvent mb-4 italic">
        Use this API to sync your user, channel, and topic data with our system.
        You’ll need to generate a secret code and send it with your request.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-theme-secondaryText mb-2">
          Secure Code
        </label>
        <div className="flex items-center gap-2">
          <input
            type={hidden ? "password" : "text"}
            value={secureCode}
            readOnly
            className="bg-theme-secondaryText rounded px-3 py-2 text-sm w-full max-w-xs"
            placeholder="Click Generate"
          />
          {/* <button
            type="button"
            onClick={() => setHidden(!hidden)}
            className="p-2  rounded"
            title={hidden ? "Show" : "Hide"}
          >
            {hidden ? <Visibility className="text-theme-secondaryText" size={18} /> : <VisibilityOff className="text-theme-secondaryText" size={18} />}
          </button> */}
            <div className="relative">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2  rounded"
                title="Copy"
              >
                <img src={CopyIcon} alt="copy" className="w-5 h-5 flex-shrink-0" />
                {copied && (
                  <p className="absolute bottom-8 left-2 text-xs text-theme-emptyEvent mt-1">
                    Copied
                  </p>
                )}
              </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGenerateCode}
          disabled={loading}
          className="mt-3 px-4 py-2 text-theme-secondaryText bg-theme-buttonEnable rounded-lg text-sm"
        >
          {loading ? "Generating..." : "Generate Secret Code"}
        </button>
      </div>

      <div className="text-sm">
        <p className="font-semibold mb-1 text-theme-secondaryText mt-4">API Endpoint:</p>
        <code className="bg-theme-secondaryText p-2 rounded block mb-3">
          POST /api/business/member/sync
        </code>

        <p className="font-semibold mb-1 text-theme-secondaryText mt-4">Headers:</p>
        <code className="bg-theme-secondaryText p-2 rounded block mb-3">
          Content-Type: application/json
        </code>

        <p className="font-semibold mb-1 text-theme-secondaryText mt-4">Request Body:</p>
        <pre className="bg-theme-secondaryText p-3 rounded text-sm mb-3 overflow-x-auto">
{`{
  "secureCode": "your-generated-code",
  "channelName": "YourChannel",
  "topicNames": ["topic1", "topic2"],
  "email": "user@example.com"
}`}
                    </pre>

                    <p className="font-semibold mb-1 text-theme-secondaryText mt-4">Successful Response:</p>
                    <pre className="bg-theme-secondaryText p-3 rounded text-sm overflow-x-auto mb-2">
{`{
  "success": true,
  "message": "Data synced"
}`}
        </pre>
      </div>
    </div>
  );
};

export default ApiPanel;
