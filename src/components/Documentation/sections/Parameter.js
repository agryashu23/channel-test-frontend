import React, { useState } from "react";

export default function Parameters() {
  const [openIndex, setOpenIndex] = useState(null);

  const parameters = [
    {
      name: "channels",
      type: "Array of Strings",
      required: "❌",
      default: "[] (all channels in profile)",
      example: '["Channel1", "Channel2"]',
      description:
        "An array of channel names to be available in the embed. If not provided, all channels from the user’s profile are included.",
    },
    {
      name: "selectedChannel",
      type: "String",
      required: "✅",
      default: "First channel in the list",
      example: '"Channel1"',
      description:
        "The name of the channel that should be pre-selected when the embed opens.",
    },
    {
      name: "selectedTopic",
      type: "String",
      required: "✅",
      default: "First topic in selected channel",
      example: '"Topic4"',
      description:
        "The name of the topic you want to auto-open inside the selected channel. Must exist in the channel.",
    },
    {
      name: "email",
      type: "String",
      required: "✅",
      default: "None",
      example: '"user@example.com"',
      description:
        "The email of the user opening the widget. Used for session tracking and authentication.",
    },
    {
      name: "autoLogin",
      type: "Boolean",
      required: "❌",
      default: "false",
      example: "true",
      description:
        "If set to true (and supported from your Channels settings), the user will be auto-logged in without a login prompt.",
    },
    {
      name: "theme",
      type: "String",
      required: "❌",
      default: "dark",
      example: '"dark"',
      description: "Choose theme between 'dark' and 'light' for your embed.",
      extra: (
        <div className="text-xs text-gray-500 mt-2">
          <strong>Possible values:</strong> <code>dark</code>,{" "}
          <code>light</code>
        </div>
      ),
    },
    {
      name: "position",
      type: "String",
      required: "❌",
      default: '"right"',
      example: '"right", "left", "center", "bottom"',
      description: "Controls where the widget appears on the screen.",
      extra: (
        <div className="text-xs text-gray-500 mt-2">
          <strong>Possible values:</strong>
          <br />
          <pre className="bg-gray-50 p-2 rounded mt-1">
            <code>
              <code>right : bottom-right of screen</code>
              <br />
              <code>left : bottom-left of screen</code>
              <br />
              <code>center : center of screen</code>
              <br />
              <code>bottom : bottom center of screen</code>
              <br />
            </code>
          </pre>
        </div>
      ),
    },
    {
      name: "width",
      type: "Object",
      required: "❌",
      default: '{ default: "450px", sm: "100%" }',
      example: '{ default: "450px", sm: "100%" }',
      description: "Customizes the widget's width for different screen sizes.",
      extra: (
        <div className="text-xs text-gray-500 mt-2">
          <strong>Keys:</strong> <code>default</code>, <code>xl</code>,{" "}
          <code>lg</code>, <code>md</code>, <code>sm</code>
          <br />
          <strong>Min width:</strong> <code>300px</code>
          <br />
          <strong>Example:</strong>
          <pre className="bg-gray-50 p-2 rounded mt-1">
            <code>{`{
  default: "450px",
  xl: "600px", // <1300px
  lg: "500px", // <1100px
  md: "400px", // <800px
  sm: "100%"   // <500px
}`}</code>
          </pre>
        </div>
      ),
    },
    {
      name: "height",
      type: "Object",
      required: "❌",
      default: '{ default: "90%", sm: "80%" }',
      example: '{ default: "90%", sm: "80%" }',
      description: "Customizes the widget's height for different screen sizes.",
      extra: (
        <div className="text-xs text-gray-500 mt-2">
          <strong>Keys:</strong> <code>default</code>, <code>xl</code>,{" "}
          <code>lg</code>, <code>md</code>, <code>sm</code>
          <br />
          <strong>Min height:</strong> <code>500px | 50%</code>
          <br />
          <strong>Example:</strong>
          <pre className="bg-gray-50 p-2 rounded mt-1">
            <code>{`{
  default: "90%",
  xl: "90%", // <1300px
  lg: "90%", // <1100px
  md: "85%", // <800px
  sm: "80%"   // <500px
}`}</code>
          </pre>
        </div>
      ),
    },
  ];

  return (
    <section className="">
      <h2 className="text-3xl font-bold mb-6 text-primary">Embed Parameters</h2>
      <p className="text-gray-700 mb-6">
        Below is a complete list of parameters you can pass to{" "}
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          window.openChannelsWidget(...)
        </code>
        . These control how the widget loads and what data is prefilled for the
        user.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left text-sm rounded-2xl overflow-hidden">
          <thead className="bg-gray-100 font-medium">
            <tr>
              <th className="border px-4 py-4">Parameter</th>
              <th className="border px-4 py-4">Type</th>
              <th className="border px-4 py-4 text-center">Required</th>
              <th className="border px-4 py-4">Default</th>
              <th className="border px-4 py-4">Description</th>
              <th className="border px-4 py-4 text-center">Example / Info</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, i) => (
              <React.Fragment key={param.name}>
                <tr className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-4 font-medium">{param.name}</td>
                  <td className="border px-4 py-4">{param.type}</td>
                  <td className="border px-4 py-4 text-center">
                    {param.required}
                  </td>
                  <td className="border px-4 py-4">{param.default}</td>
                  <td className="border px-4 py-4 max-w-60">
                    {param.description}
                  </td>
                  <td className="border px-4 py-4 text-xs text-gray-700 text-center">
                    {param.example && (
                      <code className="bg-gray-100 rounded px-2 py-1">
                        {param.example}
                      </code>
                    )}
                    {param.extra && (
                      <button
                        className="ml-2 text-blue-500 underline hover:text-blue-700 text-xs"
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        aria-label="Show more info"
                      >
                        {openIndex === i ? "Hide Info" : "More Info"}
                      </button>
                    )}
                  </td>
                </tr>
                {/* Expanded info row */}
                {param.extra && openIndex === i && (
                  <tr>
                    <td colSpan={6} className="bg-blue-50 border-t px-4 py-4">
                      {param.extra}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
