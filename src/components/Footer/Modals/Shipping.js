import React from "react";

const Shipping = () => {
  return (
    <div className="min-h-screen px-4 sm:px-10 py-12 bg-theme-primaryBackground text-theme-secondaryText font-light">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-semibold mb-6">
          Shipping & Delivery Policy
        </h1>

        <p className="mb-4">
          Channels.social is a provider of digital services only. We do not sell
          or ship any physical goods.
        </p>

        <p className="mb-4">
          All services are delivered electronically through our platform,
          immediately or within the subscription period, depending on the nature
          of the service.
        </p>

        <p className="mb-4">
          As there is no physical product involved, shipping and delivery
          policies do not apply.
        </p>

        <p className="mb-4">
          For any questions, please contact us at{" "}
          <a
            href="mailto:reach@channels.social"
            className="underline text-white"
          >
            reach@channels.social
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Shipping;
