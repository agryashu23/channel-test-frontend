import React, { useState } from "react";
import {
  reactCode,
  vueCode,
  nextjsCode,
  flutterCode,
  phpCode,
  htmlJsCode,
  angularCode,
  angularTsCode,
} from "../widgets/IntegrationCodes.js";

export default function Integrations() {
  const [tab, setTab] = useState("react");

  const codeMap = {
    react: reactCode,
    vue: vueCode,
    nextjs: nextjsCode,
    flutter: flutterCode,
    php: phpCode,
    htmljs: htmlJsCode,
    angular: angularTsCode,
  };

  const labels = {
    react: "React",
    vue: "Vue",
    nextjs: "Next.js",
    flutter: "Flutter",
    php: "PHP",
    angular: "Angular",
    htmljs: "HTML / JS",
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-bold mb-4">Embed Channels in Your Stack</h2>
      <p className="text-gray-700 mb-6">
        Use the examples below to integrate Channels embed in different frontend
        and backend environments. Each setup contains a trigger button, the open
        function, and the iframe to embed the widget.
      </p>

      {/* Tab Menu */}
      <div className="flex space-x-4 mb-4 border-b w-full overflow-x-auto no-scrollbar">
        {Object.keys(labels).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`sm:px-4 px-2 py-2 font-normal sm:font-medium ${
              tab === key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
        <code>{codeMap[tab]}</code>
      </pre>
      <p className="text-gray-500 text-xs mt-1">
        (Replace{" "}
        <span className="font-mono">
          {"{CHANNEL_NAME}"}, {"{TOPIC_NAME}"}, {"{USER_EMAIL}"}
        </span>{" "}
        with your real values.)
      </p>
    </div>
  );
}
