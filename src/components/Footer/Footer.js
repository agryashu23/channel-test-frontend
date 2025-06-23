import React, { forwardRef, useEffect } from "react";
import Logo from "../../assets/icons/channels_logo.svg";
import Linkedin from "../../assets/icons/Linkedin.svg";
import Instagram from "../../assets/icons/instagram.svg";
import useModal from "./../hooks/ModalHook";
import { useLocation, useNavigate } from "react-router-dom";
import { domainUrl } from "./../../utils/globals";

const Footer = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { handleOpenModal } = useModal();

  const handleTermsOpen = () => {
    handleOpenModal("modalTermsOpen");
  };
  const handlePrivacyOpen = () => {
    navigate("/privacy-policy");
    handleOpenModal("modalPrivacyOpen");
  };

  const handleNavigateHome = () => {
    const hostnameParts = window.location.hostname.split(".");
    const isSubdomain = hostnameParts.length > 2 && hostnameParts[0] !== "www";
    if (isSubdomain) {
      window.open(`https://${domainUrl}`, "_blank");
    } else {
      navigate("/");
    }
  };
  return (
    <footer
      ref={ref}
      className="bg-theme-footerBackground w-full text-theme-secondaryText h-28 text-center flex  z-10"
    >
      <div className="flex flex-col px-2 xs:px-4 sm:px-6 lg:px-12 md:px-12  w-full justify-center">
        <div className="flex flex-row justify-between items-start">
          <img
            src={Logo}
            alt="Logo"
            className="w-auto xs:h-[27px] h-[22px]"
            onClick={handleNavigateHome}
          />
          <div className="flex flex-row items-center space-x-4">
            <a
              href="https://www.linkedin.com/company/chips2connect/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={Linkedin}
                alt="linkedin"
                className="cursor-pointer  text-xs font-normal font-inter leading-tight"
              />
            </a>
            <a
              href="https://www.instagram.com/channels.social/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={Instagram}
                alt="instagram"
                className="cursor-pointer text-xs font-normal font-inter leading-tight"
              />
            </a>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-8 items-center">
          <div className="flex flex-row">
            <p
              className="text-theme-emptyEvent  text-[10px]  md:text-xs font-normal font-inter leading-tight cursor-pointer"
              onClick={handleTermsOpen}
            >
              Terms of Service
            </p>
            <p
              className="text-theme-emptyEvent text-[10px]  md:text-xs font-normal ml-4 font-inter leading-tight cursor-pointer"
              onClick={handlePrivacyOpen}
            >
              Privacy Policy
            </p>
          </div>
          <p className="text-theme-emptyEvent text-[10px]  md:text-xs font-light md:font-normal font-inter leading-tight">
            &copy; 2023 Chips2Connect Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
