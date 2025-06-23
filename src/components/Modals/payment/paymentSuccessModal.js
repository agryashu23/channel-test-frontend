import React, { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/lottie/payment-success.json";
import { getAppPrefix } from "./../../EmbedChannels/utility/embedHelper";

const PaymentSuccessModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.modals.modalPaymentSuccessOpen);
  const myData = useSelector((state) => state.myData);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(closeModal("modalPaymentSuccessOpen"));
        navigate(`${getAppPrefix()}/account/${myData.username}/profile`);
      }, 3000);
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
