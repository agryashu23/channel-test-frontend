import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PrivacyPage = () => {
  // const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const markdown = `
Chips2connect Pvt. Ltd. (hereinafter referred to as "Channels") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our online app, Channels.

## What information do we collect?
- Personal information: This includes your name, email address, phone number, and any other information that you voluntarily provide to us.
- Usage data: This includes information about how you use our app, such as the pages you visit, the features you use, and the time you spend using the app.
- Device data: This includes information about your device, such as the type of device, the operating system, and the device's unique identifier.

## How do we use your information?
We use your information to:
- Provide and improve our app.
- Communicate with you about our app and other products and services that we offer.
- Personalise your experience with our app.
- Target advertising to you.
- Detect and prevent fraud.

## How do we share your information?
We may share your information with the following third parties:
- Service providers
- Advertisers
- Business partners
- Law enforcement

## How do we protect your information?
We take steps to protect your information from unauthorized access, use, or disclosure. However, no method of transmission or storage is 100% secure.

## Your choices
- You can choose not to provide personal information.
- You can unsubscribe from marketing emails.
- You can request deletion or access via reach@chips.social

## Changes to this Privacy Policy
We may update this Privacy Policy from time to time.

## Contact us
reach@chips.social
`;

  // useEffect(() => {
  //   fetch(
  //     "https://raw.githubusercontent.com/Chips-social/chips-constants/main/privacy-policy.md"
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch Privacy Policy.");
  //       }
  //       return response.text();
  //     })
  //     .then((text) => {
  //       setMarkdown(text);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching markdown file:", err);
  //       setError("Failed to load privacy policy.");
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 text-theme-secondaryText text-primaryText-light">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
        Privacy Policy
      </h1>

      {/* {loading && <p className="text-center text-sm">Loading...</p>}

      {error && <p className="text-center text-red-500">{error}</p>} */}

      {/* Show Privacy Policy Content */}
      <div className="text-sm leading-6 text-theme-secondaryText space-y-3">
        <p>
          Chips2connect Pvt. Ltd. (hereinafter referred to as "Channels") is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and share your personal information when you use our
          online app, Channels.
        </p>
        <h2 className="font-semibold mt-4">What information do we collect?</h2>
        <ul className="list-disc list-inside">
          <li>Personal information: name, email, phone number</li>
          <li>Usage data: pages visited, features used, time spent</li>
          <li>Device data: device type, OS, unique ID</li>
        </ul>

        <h2 className="font-semibold mt-4">How do we use your information?</h2>
        <ul className="list-disc list-inside">
          <li>Provide and improve the app</li>
          <li>Communicate with users</li>
          <li>Personalize experience and run ads</li>
          <li>Detect and prevent fraud</li>
        </ul>

        <h2 className="font-semibold mt-4">
          How do we share your information?
        </h2>
        <ul className="list-disc list-inside">
          <li>Service providers</li>
          <li>Advertisers</li>
          <li>Business partners</li>
          <li>Law enforcement (when legally required)</li>
        </ul>

        <h2 className="font-semibold mt-4">Security</h2>
        <p>
          We take measures to protect your data but cannot guarantee 100%
          security.
        </p>

        <h2 className="font-semibold mt-4">Your Choices</h2>
        <p>
          You can opt out of marketing emails, decline to give info, or request
          data deletion via{" "}
          <a href="mailto:reach@chips.social" className="underline">
            reach@chips.social
          </a>
          .
        </p>

        <h2 className="font-semibold mt-4">Updates</h2>
        <p>This policy may be updated from time to time.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
