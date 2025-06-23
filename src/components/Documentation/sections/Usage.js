// src/docs/sections/Usage.jsx
import React from "react";

export default function Usage() {
  return (
    <section className=" px-2 py-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        Embedding & Usage
      </h2>

      {/* General Frameworks */}
      <div className="bg-white shadow rounded-2xl mb-8 p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 flex items-center">
          <span className="mr-2">🌐</span>
          React, Vue, Angular, PHP, HTML/JS
        </h3>
        <ul className="mb-4 ml-4 list-disc text-gray-600 text-base">
          <li>
            Open your <span className="font-mono">index.html</span> (or main
            HTML template).
          </li>
          <li>
            Add the following <span className="font-mono">&lt;script&gt;</span>{" "}
            tag inside your <span className="font-mono">&lt;head&gt;</span>:
          </li>
        </ul>
        <pre className="bg-gray-100 border border-gray-200 p-4 rounded-xl text-xs overflow-x-auto mb-2">
          <code>
            {`<script src="https://channels.social/widget.js?apiKey=YOUR_API_KEY_HERE"
  onload="window.ChannelsWidget && window.ChannelsWidget()"></script>`}
          </code>
        </pre>
        <p className="text-gray-500 text-xs mt-1">
          (Replace <span className="font-mono">YOUR_API_KEY_HERE</span> with
          your real API key.)
        </p>
      </div>

      {/* Next.js */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 flex items-center">
          <span className="mr-2">⚡️</span>
          Next.js
        </h3>
        <p className="mb-2 text-gray-700">For Next.js, you have two options:</p>
        <ol className="list-decimal mb-4 ml-6 text-gray-600 text-base">
          <li>
            <span className="font-semibold">
              Globally in <span className="font-mono">pages/_document.js</span>:
            </span>
            <pre className="bg-gray-100 border border-gray-200 mt-2 mb-2 p-4 rounded-xl text-xs overflow-x-auto">
              <code>{`// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          src="https://channels.social/widget.js?apiKey=YOUR_API_KEY_HERE"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`}</code>
            </pre>
          </li>
          <li className="mt-4">
            <span className="font-semibold">
              On a specific page/component using{" "}
              <span className="font-mono">next/script</span>:
            </span>
            <pre className="bg-gray-100 border border-gray-200 mt-2 mb-2 p-4 rounded-xl text-xs overflow-x-auto">
              <code>{`import Script from 'next/script';
export default function Home() {
  return (
    <>
      <Script
        src="https://channels.social/widget.js?apiKey=YOUR_API_KEY_HERE"
        strategy="afterInteractive"
      />
      {/* Rest of your code */}
    </>
  );
}
`}</code>
            </pre>
          </li>
        </ol>
        <p className="text-gray-500 text-xs mt-1">
          (Make sure to replace{" "}
          <span className="font-mono">YOUR_API_KEY_HERE</span> with your actual
          key.)
        </p>
      </div>
    </section>
  );
}
