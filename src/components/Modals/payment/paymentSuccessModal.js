import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/images/payment_success.json";
import { getAppPrefix } from "./../../EmbedChannels/utility/embedHelper";
import { setPaymentField } from "../../../redux/slices/paymentSlice";

const PaymentSuccessModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.modals.modalPaymentSuccessOpen);
  const myData = useSelector((state) => state.myData);
  const paymentData = useSelector((state) => state.payment);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(setPaymentField({field:"loading",value:false}));

        dispatch(closeModal("modalPaymentSuccessOpen"));
        if(paymentData.paymentType === "subscription" && paymentData.paymentData.planId){
          navigate(`${getAppPrefix()}/account/${myData.username}/profile`);
        }else if(paymentData.paymentType === "channel" && paymentData.paymentData.channel){
          navigate(`${getAppPrefix()}/account/${paymentData.paymentData.username}/channel/${paymentData.paymentData.channel}`);
        }else if(paymentData.paymentType === "topic" && paymentData.paymentData.topic && paymentData.paymentData.channel){
          navigate(`${getAppPrefix()}/account/${paymentData.paymentData.username}/channel/${paymentData.paymentData.channel}/c-id/topic/${paymentData.paymentData.topic}`);
        }else if(paymentData.paymentType === "event" && paymentData.paymentData.event){
          navigate(`${getAppPrefix()}/event/${paymentData.paymentData.event}`);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch, navigate]);

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3 p-8 flex flex-col items-center">
            <Dialog.Title></Dialog.Title>
            <Lottie
              animationData={successAnimation}
              loop={false}
              style={{ width: 120, height: 120 }}
            />
            <h2 className="text-xl font-semibold mt-4 text-center">
              Payment Successfull!
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Redirecting ....
            </p>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PaymentSuccessModal;
