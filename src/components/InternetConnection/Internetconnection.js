import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternetErrorImg from "../.././assets/images/internetError.jpg";

const Internetconnection = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
    navigate(0);
  };
  useEffect(() => {
    const handleOnline = () => {
      navigate(0);
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);

  return (
    <div className="flex items-center   justify-center min-h-screen bg-primaryBackground">
      <div className="flex flex-row items-end justify-center bg-primaryBackground">
        <img
          src={InternetErrorImg}
          alt="404 Illustration"
          className="w-2/5 -mb-8 text-theme-secondaryText"
        />
        <div className="flex flex-col ml-14 items-start">
          <h1 className="text-center text-errorLight text-md font-extralight font-inter mb-1">
            #Internet
          </h1>
          <p className="text-4xl text-primary font-medium font-inter whitespace-pre-line leading-normal tracking-wide">
            Looks like{"\n"}
            <span className="font-normal italic">your</span>
            {"\n"}
            <span className="font-bold">INTERENT CONNECTION{"\n"}</span>
            is out of world
          </p>
          <button
            className="mt-3 py-2.5 px-5 bg-primary text-buttonText text-sm rounded-full"
            onClick={navigateToHome}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Internetconnection;
