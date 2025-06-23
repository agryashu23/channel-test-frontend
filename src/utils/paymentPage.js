import axios from "axios";
import { hostUrl } from "./globals";
import { postRequestAuthenticated } from "../services/rest";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePaymentSuccess = () => {};

export const handlePayment = async (myData, data) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("amount", data.amount);
    formData.append("currency", data.currency);
    formData.append("planId", data.planId);
    formData.append("billingCycle", data.billingCycle);
    const response = await postRequestAuthenticated(
      `${hostUrl}/api/create-order`,
      formData
    );
    const options = {
      key: "rzp_live_w50CppHJGDmkhe",
      amount: response.amount,
      currency: response.currency,
      name: "Channels.social",
      description: `Transaction for ${data.planName} plan.`,
      image:
        "https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/logo.svg",
      order_id: response.id,
      handler: async function (response) {
        const verification = await postRequestAuthenticated(
          `${hostUrl}/api/verify-payment`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
        );
        if (verification.status === "success") {
          handlePaymentSuccess();
        } else {
          alert(verification.message);
        }
      },
      prefill: {
        name: myData?.fullName || myData?.username,
        email: myData?.email,
        contact: myData?.contact || myData?.whatsapp_number || "",
      },
      notes: {
        address:
          "No. 261/1, SY No. 12/1, AECS Layout Sanjay Nagar, Bangalore, Karnataka, 560094",
      },
      theme: {
        color: "#202020",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
  }
};
