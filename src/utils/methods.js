export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export const getAddressFromCoords = async (lat, lng) => {
  const apiKey = "AIzaSyA4giJjY94Cl2MJegYyp0NZYIUEOUTq9I0";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error("Unable to fetch address");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unknown location";
  }
};

export const formatChatDate = (dateString) => {
  const messageDate = new Date(dateString);
  const now = new Date();

  const isToday = messageDate.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${messageDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  } else if (isYesterday) {
    return `Yesterday, ${messageDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  } else {
    return messageDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
};
