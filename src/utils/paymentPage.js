import { Keys } from "../components/constants/keys";
import { createTransactionOrder, verifyPayment ,setPaymentField,failedPayment } from "../redux/slices/paymentSlice";
import { useDispatch,useSelector } from "react-redux";
import useModal from "../components/hooks/ModalHook";

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

const logMessage = (type, name) => {
  if (type === "subscription") return `Transaction for ${name} plan.`;
  if (["channel", "topic", "event"].includes(type)) return `Transaction for ${name}.`;
  return "Transaction";
};

export const usePaymentHandler = () => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const myData = useSelector((state) => state.myData);

  const handlePayment = async (data, type = "subscription") => {
    dispatch(setPaymentField({field:"loading",value:true}));
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("amount", data.amount);
      formData.append("currency", data.currency || "INR");
      formData.append("type", type);
      if (type === "subscription") {
        formData.append("planId", data.planId);
        formData.append("billingCycle", data.billingCycle);
      } else if (type === "channel") {
        formData.append("channel", data.channel);
      } else if (type === "topic") {
        formData.append("topic", data.topic);
      } else if (type === "event") {
        formData.append("event", data.event);
      }
      
      let response = null;
      await dispatch(createTransactionOrder(formData)).unwrap().then((res) => {
        response = res;
      }).catch((err) => {
        console.log(err);
      });
      const nameForLog = type === "subscription" ? data.planName : data.name || type;
      const description = logMessage(type, nameForLog);

      const options = {
        key: Keys.RazorpayTestKey,
        amount: response.amount,
        currency: response.currency,
        name: "Channels.social",
        description,
        image: "https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/logo.png",
        order_id: response.id,
        handler: async function (response) {
          const formData = new FormData();
          formData.append("razorpay_order_id", response.razorpay_order_id);
          formData.append("razorpay_payment_id", response.razorpay_payment_id);
          formData.append("razorpay_signature", response.razorpay_signature);
          let verification = null;
          await dispatch(verifyPayment(formData)).unwrap().then((res) => {
            verification = res;
          }).catch((err) => {
            dispatch(setPaymentField({field:"loading",value:false}));
            console.log(err);
          });
          if (verification.status === "success") {
            dispatch(setPaymentField({field:"paymentData",value:data}));
            dispatch(setPaymentField({field:"paymentStatus",value:"success"}));
            dispatch(setPaymentField({field:"paymentType",value:type}));
            handleOpenModal("modalPaymentSuccessOpen");
          } else {
            dispatch(setPaymentField({field:"loading",value:false}));
            alert(verification.message);
          }
        },
        modal: {
          ondismiss: () => {
            dispatch(setPaymentField({ field: "loading", value: false }));
            console.log(response.id);
            dispatch(failedPayment(response.id));
          }
        },
        prefill: {
          name: myData?.name || myData?.username,
          email: myData?.email,
          contact: myData?.contact || "",
        },
        notes: {
          address: "No. 261/1, SY No. 12/1, AECS Layout Sanjay Nagar, Bangalore, Karnataka, 560094",
        },
        theme: {
          color: "#202020",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return { handlePayment };
};