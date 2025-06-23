import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen px-4 sm:px-10 py-12 bg-theme-primaryBackground text-theme-secondaryText font-light">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-semibold mb-6">
          Cancellation & Refund Policy
        </h1>

        <p className="mb-4">
          Channels.social provides digital services through paid subscriptions.
          We strive to maintain transparency and fairness in our billing and cancellation process.
        </p>

        <h2 className="text-lg text-white font-medium mt-6 mb-2">Subscription Cancellation</h2>
        <p className="mb-4">
          Users may cancel their subscription at any time from their account settings. Once cancelled, your subscription will remain active until the end of the current billing cycle.
        </p>

        <h2 className="text-lg text-white font-medium mt-6 mb-2">Refund Policy</h2>
        <p className="mb-4">
          We do not offer refunds for partially used billing cycles or accidental purchases. All subscription payments are non-refundable unless otherwise required by law.
        </p>

        <h2 className="text-lg text-white font-medium mt-6 mb-2">Contact</h2>
        <p className="mb-4">
          If you believe you’ve been billed in error or have questions about your subscription,
          please contact us at <a href="mailto:reach@channels.social" className="underline text-white">reach@channels.social</a>.
        </p>
      </div>
    </div>
  );
};

export default CancellationPolicy;
