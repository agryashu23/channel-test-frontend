import React, { useState } from "react";
import { hostUrl } from "./../../../utils/globals";

const PricingModal = ({ isOpen, onClose, plan }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${hostUrl}/api/pricing/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan }),
    });

    const data = await res.json();
    if (data.success) {
      setSubmitted(true);
    } else {
      alert("Failed to save your interest. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#2c2c2c] rounded-lg p-6 w-96 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-normal">Register Interest</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            ✕
          </button>
        </div>

        {submitted ? (
          <p className="text-green-500 text-sm">
            Thanks! We’ll notify you when the <strong>{plan}</strong> plan goes
            live.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm font-light">
              <strong>Thanks for your interest in the {plan} plan!</strong>
              <br />
              <br />
              Our payment integration is coming soon. Meanwhile, please leave
              your email and we’ll notify you as soon as it's live.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-500 px-3 py-2 rounded text-white bg-transparent text-sm font-light"
              />
              <button
                type="submit"
                className="w-full bg-white text-black py-2 rounded-lg font-normal text-sm"
              >
                Notify Me
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingModal;
