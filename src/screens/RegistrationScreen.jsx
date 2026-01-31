import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationScreen = () => {
  const navigate = useNavigate();

  // Redirect to new user screen since this seems to be deprecated/unused
  React.useEffect(() => {
    navigate("/new-user");
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default RegistrationScreen;
