// src/components/MapCard.js
import { React, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Maps from "../../../assets/images/maps.png";
import { Keys } from "../../constants/keys";

const containerStyle = {
  width: "100%",
  height: "150px",
};

const mapOptions = {
  disableDefaultUI: true,
  mapTypeId: "roadmap",
};

const parseCoordinatesFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const query = params.get("query");
    if (query) {
      const [lat, lng] = query.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (error) {
    console.error("Invalid URL:", error);
  }
  return { lat: 14.5995, lng: 120.9842 };
};

const GoogleMapsEvent = ({ url, text }) => {
  const [showMap, setShowMap] = useState(false);
  const [center, setCenter] = useState({ lat: 14.5995, lng: 120.9842 });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: Keys.GoogleMapsApiKey,
  });

  const handleMarkerClick = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    if (url) {
      const coordinates = parseCoordinatesFromUrl(url);
      setCenter(coordinates);
    }
  }, [url]);

  const handleShowMap = () => {
    setShowMap(true);
  };

  

  return (
    <div className="w-full rounded-xl overflow-hidden mr-4 border-2 border-theme-chatDivider">
      <div className="relative ">
        {!showMap ? (
          <div
            className="flex flex-col items-center  justify-center h-[150px] cursor-pointer bg-theme-primaryBackground text-white w-full"
            onClick={handleShowMap}
          >
            <img src={Maps} alt="maps" className="h-5 w-5 " />
            <span>Click to load map</span>
          </div>
        ) : loadError ? (
          <div>Error loading maps</div>
        ) : !isLoaded ? (
          <div>Loading Maps...</div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            options={mapOptions}
          >
            <Marker
              position={center}
              title="Location"
              icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              onClick={handleMarkerClick}
            />
          </GoogleMap>
        )}

        {/* <div className="absolute bottom-0 w-full left-0 right-0 bg-theme-tertiaryBackground bg-opacity-70 text-theme-secondaryText p-1">
          <p className="text-xs px-2 font-inter text-theme-secondaryText font-light p-0">
            {text}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default GoogleMapsEvent;
