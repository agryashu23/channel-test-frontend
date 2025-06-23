import React from "react";

export default function RequestAutoLogin() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Requesting Auto Login Access</h2>

      <p className="text-gray-700 mb-4">
        The <code className="bg-gray-100 px-1 rounded">autoLogin</code>{" "}
        parameter allows your users to skip the login screen when accessing the
        embed. This is useful for platforms with a secure internal login system.
      </p>

      <p className="text-gray-700 mb-4">
        However, for security reasons,{" "}
        <strong>autoLogin must be approved by the Channels team</strong>. It can
        only be requested by logged-in admins of verified domains.
      </p>

      <p className="text-gray-700 mb-4">
        To request autoLogin access, please follow these steps:
      </p>

      <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
        <li>
          Log in to your Channels account at{" "}
          <a
            href="https://channels.social"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            channels.social
          </a>
        </li>
        <li>
          From the sidebar, go to the <strong>Admin Dashboard</strong> section.
        </li>
        <li>
          From the admin sidebar, go to the <strong>Requests</strong> section.
        </li>
        <li>
          Select the <strong>Auto Login Access</strong> request option.
        </li>
        <li>Fill in your details and provide your use case for auto login.</li>
        <li>
          Click <strong>Submit Request</strong>. Our team will review and
          respond shortly.
        </li>
      </ol>

      <p className="text-sm text-gray-500">
        ⚠️ You must be logged in with a verified admin account to access the
        request section.
      </p>
    </div>
  );
}
