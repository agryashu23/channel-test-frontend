
import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { useNavigate } from "react-router-dom";
import { getAppPrefix } from "./../../EmbedChannels/utility/embedHelper";
import { setPaymentField } from "../../../redux/slices/paymentSlice";
import Close from "../../../assets/icons/Close.svg";
import { usePaymentHandler } from "../../../utils/paymentPage";


const PaymentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.modals.modalPaymentOpen);
  const myData = useSelector((state) => state.myData);
  const paymentData = useSelector((state) => state.payment.data);
  const { handlePayment } = usePaymentHandler();


  const handleClose=()=>{
    dispatch(closeModal("modalPaymentOpen"));
  }

  const handlePaymentPage=()=>{
    handleClose();
    const data = {
        amount:(paymentData.totalAmount/1.18)/100,
        currency:"INR",
        planId:paymentData.planId,
        billingCycle:paymentData.billingCycle,
    }
    handlePayment(data,"subscription");    
  }

  if (!isOpen) return null;
  const formatAmount = (amt) => `₹${(amt / 100).toFixed(2)}`;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3 p-6 flex flex-col items-center">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Upgrade Subscription
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <p className="mb-4 text-sm text-theme-secondaryText">
                    You're upgrading to:{" "}
                    <span className="font-medium">
                        {paymentData.planId.charAt(0).toUpperCase() + paymentData.planId.slice(1)}
                    </span>{" "}
                    ({paymentData.billingCycle})
                    </p>
                <div className="space-y-2 text-sm">
                <div className="flex justify-between text-theme-secondaryText font-light">
                    <span>Base Price</span>
                    <span>{formatAmount(paymentData.amount)}</span>
                </div>
                <div className="flex justify-between text-theme-secondaryText font-light">
                    <span>Credit from {paymentData.oldPlanId} ({paymentData.remainingDays} days left)</span>
                    <span className="text-green-500">- {formatAmount(paymentData.creditAmount)}</span>
                </div>
                <div className="flex justify-between text-theme-secondaryText font-light">
                    <span>GST (18%)</span>
                    <span>{formatAmount(paymentData.gstAmount)}</span>
                </div>
                <div className="border-t border-theme-chatDivider my-2"></div>
                <div className="flex justify-between text-theme-secondaryText font-medium">
                    <span>Total to Pay</span>
                    <span>{formatAmount(paymentData.totalAmount)}</span>
                </div>
                </div>

                <div className="mt-6 flex justify-end">
                <button
                    className="px-4 py-2 rounded-md bg-theme-buttonEnable text-theme-secondaryText text-sm"
                    onClick={handlePaymentPage}
                >
                    Pay
                </button>
                </div>
              
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PaymentModal;
