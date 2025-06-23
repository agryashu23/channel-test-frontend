import React from "react";

export default function DomainVerification() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Domain Verification</h2>
      <p className="text-gray-700 mb-4">
        Before using Channels embed, you must verify ownership of your domain.
        This ensures security and allows you to generate your unique API key.
      </p>

      <p className="text-gray-700 mb-4">
        To begin the verification process, log in at{" "}
        <a
          href="https://channels.social"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          channels.social
        </a>{" "}
        and go to the <strong>Integrate Channels</strong> section in your
        sidebar.
      </p>

      <p className="text-gray-700 mb-6">
        Once you enter your domain, you’ll be given one of the following
        verification options:
      </p>

      <ul className="list-disc pl-6 space-y-4 text-gray-700 mb-6">
        <li>
          <strong>DNS Verification:</strong> Add a TXT record to your domain's
          DNS settings.
        </li>
        <li>
          <strong>TXT File Upload:</strong> Upload a provided{" "}
          <code>channels-verification.txt</code> file to the root of your
          website.
        </li>
        <li>
          <strong>Meta Tag:</strong> Paste a meta tag in the{" "}
          <code>&lt;head&gt;</code> of your homepage HTML.
        </li>
      </ul>

      <p className="text-gray-700 mb-4">
        After completing the steps for your chosen method, click the{" "}
        <strong>Verify</strong> button to complete verification.
      </p>

      <p className="text-sm text-gray-500">
        📝 Once verified, your API key will be generated and shown in the
        dashboard. Make sure to copy and save it securely.
      </p>
    </div>
  );
}
