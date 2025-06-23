import { domainUrl } from "./globals";

// export const extractSubdomain = (url) => {
//     const mainDomain = domainUrl;
//     const host = url.hostname;
//     if (!host.endsWith(mainDomain)) {
//       return null;
//     }
//     const parts = host.split('.');
//     if (parts.length >= 3 && parts[0] !== 'www') {
//       return parts[0];
//     }

//     return null;
//   };

export const extractSubdomain = (url) => {
  const mainDomain = domainUrl.replace(/^www\./, "");
  const host = url.hostname;

  if (!host.endsWith(mainDomain)) {
    return null;
  }
  const parts = host.split(".");
  const mainParts = mainDomain.split(".");
  if (parts.length > mainParts.length) {
    return parts.slice(0, parts.length - mainParts.length).join(".");
  }
  return null;
};
