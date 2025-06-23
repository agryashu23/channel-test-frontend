// src/docs/sections/GettingStarted.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GettingStarted() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mb-4">Getting Started</h2>

      <ol className="list-decimal pl-6  text-gray-700 space-y-4">
        <li>
          Create an account on{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("https://channels.social")}
          >
            channels.social
          </span>
          .
        </li>
        <li>
          Log in and navigate to the <strong>Embed Channels</strong> section
          from the sidebar.
        </li>
        <li>
          Read the instructions carefully and verify the domain where you want
          to embed Channels.
        </li>
        <li>
          After verification, your API key will be generated. Copy and securely
          store this key.
        </li>
      </ol>
    </div>
  );
}
