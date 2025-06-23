import React from "react";
import Domain404Image from "../../assets/images/domain_404.png";
import { domainUrl } from "./../../utils/globals";

const Domain404 = () => {
  const handleNavigationHome = () => {
    window.location.href = `https://${domainUrl}`;
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex w-full flex-col xs:flex-row h-full items-center justify-center bg-primaryBackground">
        <img src={Domain404Image} alt="Img1" className=" h-1/2 rounded-xl" />
        <div className="flex flex-col xs:mt-0 mt-6 pl-0 xs:pl-10 items-start ">
          <h1 className="text-center text-errorLight text-md font-extralight font-inter mb-1">
            #404¯\(°_o)/¯
          </h1>
          <p className="sm:text-4xl xs:text-2xl text-3xl text-theme-secondaryText font-medium font-inter whitespace-pre-line leading-snug xs:leading-normal tracking-wide">
            This Domain{"\n"} does not exist.
          </p>
          <div className="flex flex-row space-x-4 mt-1 xs:mt-5">
            <button
              className="mt-3 py-2 px-6 border border-primary text-primary text-sm rounded-full"
              onClick={handleNavigationHome}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domain404;
