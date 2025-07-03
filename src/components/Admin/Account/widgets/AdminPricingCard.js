import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePaymentHandler } from "../../../../utils/paymentPage";
import { setPaymentField } from "../../../../redux/slices/paymentSlice";
import { postRequestAuthenticated } from "../../../../services/rest";
import useModal from "../../../hooks/ModalHook";
import Loading from "../../../../widgets/Loading";

const AdminPricingCard = ({ plan, type ,index}) => {
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myData = useSelector((state) => state.myData);
  const paymentData = useSelector((state) => state.payment);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handlePayment } = usePaymentHandler();
  const {handleOpenModal} = useModal();

  const handleInfoOpen = (index) => setOpenInfoIndex(index);
  const handleInfoClose = () => setOpenInfoIndex(null);

  const extractFeatures = () => {
    const f = plan.features;
    const features = [];
    if (plan._id === "enterprise") {
      features.push({ name: `Pay as you go`, available: true });
      features.push({ name: `Unlimited Channels`, available: true });
      features.push({ name: `Unlimited Users`, available: true });
      features.push({ name: `Unlimited Newsletters`, available: true });
    }
    if (f.maxChannels && plan._id !== "enterprise")
      features.push({
        name: `${
          f.maxChannels === 1
            ? `${f.maxChannels} Channel`
            : `Upto ${f.maxChannels} Channels`
        }`,
        available: true,
      });
    if (f.userLimit && plan._id !== "enterprise")
      features.push({ name: `Total ${f.userLimit} users`, available: true });
    if (f.paidEvents !== undefined)
      features.push({ name: "Paid Events", available: f.paidEvents });
    if (f.autoLogin !== undefined)
      features.push({ name: "Auto Login", available: f.autoLogin });
    if (f.newslettersPerMonth > 0 && plan._id !== "enterprise")
      features.push({
        name: `${f.newslettersPerMonth} Monthly Newsletters`,
        available: true,
      });
    if (f.integrationSupport !== undefined)
      features.push({
        name: "Integration Support",
        available: f.integrationSupport,
      });
    if (f.communityManager !== undefined)
      features.push({
        name: "Community Manager",
        available: f.communityManager,
      });
    if (f.inAppNotifications !== undefined)
      features.push({
        name: "In-App Notifications",
        available: f.inAppNotifications,
      });

    if (f.analytics) {
      const analyticsList = Object.entries(f.analytics)
        .filter(([_, value]) => value.enabled)
        .map(([_, value]) => value.label);

      if (analyticsList.length) {
        features.push({
          name: f.analyticTitle,
          available: true,
          info: analyticsList,
        });
      } else {
        features.push({ name: "Analytics", available: false });
      }
    }
    return features;
  };

  const featureList = extractFeatures();

  const handleStartClick = async(price, planId, type,index) => {
    if(!isLoggedIn){
      navigate("/get-started");
    }
    else{
      if (index===0) {
        navigate(`/account/${myData.username}/profile`);
      } else{
      // setIsModalOpen(true);
       const data = {
         amount: price,
         currency: "INR",
         planId: planId,
         billingCycle: type,
       };
       const res = await postRequestAuthenticated("/calculate/upgrade/details", data);
       if(res.success){
          dispatch(setPaymentField({field:"data",value:res.data}));
          handleOpenModal("modalPaymentOpen");
       }
      }
    }
  };

  return (
    <div className="border border-theme-chatDivider rounded-lg p-4 flex flex-col relative space-y-4">
      {<>
      <div className="flex flex-row justify-between items-center">
        <div className="text-theme-sidebarColor text-lg font-normal">{plan.name}</div>

        {plan.badge && (
          <div className=" bg-[#CAD83C] text-black text-xs px-2 py-1 rounded-full">
            {plan.badge}
          </div>
        )}
      </div>
      {plan._id !== "enterprise" && (
        <div className="text-theme-secondaryText text-2xl font-light flex items-center space-x-2">
          <span className="font-normal">
            {type === "monthly"
              ? "₹" + plan.pricing.monthly.price
              : "₹" + plan.pricing.annually.price}
          </span>
          <span className="flex flex-col justify-start">
            {plan._id !== "basic" &&
              type === "monthly" &&
              plan.pricing.monthly.intialFee && (
                <span className="text-xs text-theme-emptyEvent line-through">
                  {"₹" + plan.pricing.monthly.intialFee}
                </span>
              )}
            {plan._id !== "basic" &&
              type === "annually" &&
              plan.pricing.annually.intialFee && (
                <span className="text-xs text-theme-emptyEvent line-through">
                  {"₹" + plan.pricing.annually.intialFee}
                </span>
              )}
            {plan._id !== "basic" && (
              <span className="text-xs font-extralight -pt-0.5">
                {type === "monthly" ? "/month" : "/year"}
              </span>
            )}
          </span>
          {plan._id!=="basic" &&  <p className="text-xs text-theme-secondaryText font-extralight">+ GST/-</p>}
        </div>
      )}
      {plan._id === "enterprise" && (
        <div className="text-theme-secondaryText text-2xl font-light flex items-center space-x-2">
          Custom Pricing
        </div>
      )}
      {plan.description && (
        <p className="text-xs text-theme-secondaryText font-extralight">{plan.description}</p>
      )}

      {plan.buttonText !== "Talk to Sales" && (
        <button
          className={`${
            index!==0
              ? "bg-theme-buttonEnable text-theme-secondaryText "
              : "border border-white text-theme-secondaryText"
          } text-sm py-2 rounded-lg  font-light`}
          onClick={() =>
            handleStartClick(
              type === "monthly"
                ? plan.pricing.monthly.price
                : plan.pricing.annually.price,
              plan._id,
              type,
              index
            )
          }
        >
          {index===0?"Current plan":"Upgrade"}
        </button>
      )}
      {plan.buttonText === "Talk to Sales" && (
        <a
          href="https://calendly.com/channels_social/talk-to-us"
          target="_blank"
          rel="noopener noreferrer"
          className={`${"border border-theme-secondaryText text-theme-secondaryText"} text-center text-sm py-2 rounded-lg  font-light`}
        >
          {plan.buttonText}
        </a>
      )}

     
      <ul className="text-theme-secondaryText font-light text-sm space-y-2 pt-2">
        <p className="text-[#898989] text-sm font-light">
          {plan.buttonText === "Get started for free"
            ? "Features:"
            : plan.buttonText === "Talk to Sales"
            ? ""
            : "Core Features:"}
        </p>

        {featureList.map(
          (feature, index) =>
            feature.available && (
              <li key={index} className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-theme-secondaryText`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature.name}</span>
                {feature.info && (
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-theme-secondaryText cursor-pointer ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onMouseEnter={() => handleInfoOpen(index)}
                      onMouseLeave={handleInfoClose}
                      onClick={() => handleInfoOpen(index)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                      />
                    </svg>

                    {openInfoIndex === index && (
                      <div className="absolute top-6 left-0 w-40 bg-[#333333]  text-theme-secondaryText font-light text-sm rounded-md shadow-lg p-2 z-50">
                        {feature.info.map((line, i) => (
                          <p key={i} className="text-xs py-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
        )}
      </ul>
      </>}
    </div>
  );
};

export default AdminPricingCard;
