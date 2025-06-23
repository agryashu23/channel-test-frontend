// src/pages/ContactPage.jsx (or /contact-us route)
import React from "react";

const ContactUs = () => (
  <div className="max-w-3xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-semibold mb-4 text-theme-secondaryText">
      Contact Us
    </h1>
    <p className="text-theme-secondaryText text-sm mb-2">
      We'd love to hear from you. If you have questions, feedback, or concerns,
      please reach us at:
    </p>
    <p className="text-theme-secondaryText text-sm">
      📧 Email:{" "}
      <a href="mailto:reach@chips.social" className="underline">
        reach@chips.social
      </a>
    </p>
    <p className="text-theme-secondaryText text-sm mt-2">
      🏢 Company: Chips2connect Pvt. Ltd., India
    </p>
  </div>
);

export default ContactUs;
