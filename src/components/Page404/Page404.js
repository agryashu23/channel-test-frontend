import React from "react";
import { useNavigate } from "react-router-dom";
import NotFound from "../../assets/images/not_found.png";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-start  mt-12 justify-center min-h-screen bg-theme-primaryBackground">
      <div className="flex flex-row items-end justify-center bg-theme-primaryBackground">
        <img src={NotFound} alt="404 Illustration" className="w-2/5 -mb-8" />
        <div className="flex flex-col ml-14 items-start">
          <h1 className="text-center text-theme-error text-md font-extralight font-inter mb-1">
            #404¯\(°_o)/¯
          </h1>
          <p className="text-4xl text-theme-secondaryText font-medium font-inter whitespace-pre-line leading-normal tracking-wide">
            Looks like{"\n"}
            <span className="font-normal italic">you've</span> ventured{"\n"}
            <span>into the{"\n"} </span>
            <span className="font-bold">Bermuda △{"\n"}</span>
            of the{"\n"} INTERNET
          </p>
          <button
            className="mt-3 py-2.5 px-5  text-theme-primaryBackground bg-theme-secondaryText text-sm rounded-full"
            onClick={() => navigate("/")}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page404;
