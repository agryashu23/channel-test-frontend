import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedOnboardingRoute = ({ children }) => {
  const isOnboardingAllowed = useSelector((state) => state.auth.isOnboarding);

  if (!isOnboardingAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};
