// src/docs/sections/Introduction.jsx
import React from "react";

export default function Introduction() {
  return (
    <section className="">
      <div className="bg-primary/10 border-l-4 border-primary/60 p-6 rounded-xl mb-8 shadow-sm">
        <h2 className="text-3xl font-bold text-primary mb-2">Introduction</h2>
        <p className="text-gray-800 text-lg">
          Welcome to the{" "}
          <span className="font-semibold">Channels Embed SDK</span>{" "}
          documentation!
          <br />
          This guide will help you seamlessly integrate our embeddable widget
          into your website or platform.
        </p>
      </div>

      <div className="bg-white  rounded-2xl pt-3">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          With this guide, you’ll learn how to:
        </h3>
        <ul className="list-disc pl-8 text-gray-700 space-y-2 text-base">
          <li>Sign up for a Channels account</li>
          <li>Verify your domain</li>
          <li>Generate and manage your unique API key</li>
          <li>Embed the widget and fully customize it for your use case</li>
        </ul>
      </div>
    </section>
  );
}
