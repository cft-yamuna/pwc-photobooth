import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";

const NewUserScreen = () => {
  const navigate = useNavigate();
  const { setRegisteredUser, setGender } = useAppContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGenderValue] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabaseService = useMemo(() => new SupabaseService(), []);

  const categoryOptions = [
    "Leader",
    "Program Team",
    "Facilitator",
    "Learner",
    "Visitor",
    "AI Champion",
    "CSR Champion"
  ];

  const handleContinue = async () => {
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !gender || !category) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    const result = await supabaseService.registerUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      tag: category,
    });

    setIsSubmitting(false);

    if (result) {
      setRegisteredUser(result);
      setGender(gender.toLowerCase());
      navigate("/face-capture");
    } else {
      setError("Failed to register. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "32px 24px",
    fontSize: "36px",
    fontFamily: "'ITC Charter', serif",
    borderRadius: "0",
    border: "none",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
  };

  const placeholderColor = "#666666";

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url(/images/register-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FDEEE4",
        display: "flex",
        flexDirection: "column",
        padding: "50px 50px 250px 50px", // Increased bottom padding to clear fixed button
        boxSizing: "border-box",
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* Title Section */}


      {/* Register Section */}
      <div style={{ marginTop: "500px" }}>


        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            maxWidth: "100%",
          }}
        >
          {/* First Name */}
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            style={{
              ...inputStyle,
              color: firstName ? "#000000" : placeholderColor,
            }}
          />

          {/* Last Name */}
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            style={{
              ...inputStyle,
              color: lastName ? "#000000" : placeholderColor,
            }}
          />

          {/* Email ID */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email ID"
            autoComplete="off"
            style={{
              ...inputStyle,
              color: email ? "#000000" : placeholderColor,
            }}
          />

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGenderValue(e.target.value)}
            style={{
              ...inputStyle,
              paddingRight: "60px", // Extra padding for arrow
              cursor: "pointer",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='9' stroke='%23000000' stroke-width='1.5'/%3E%3Cpath d='M8.5 10.5L12 14L15.5 10.5' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 24px center",
              backgroundSize: "32px",
              color: gender ? "#000000" : placeholderColor,
            }}
          >
            <option value="" disabled>Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Category of attendee */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              ...inputStyle,
              paddingRight: "60px", // Extra padding for arrow
              cursor: "pointer",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='9' stroke='%23000000' stroke-width='1.5'/%3E%3Cpath d='M8.5 10.5L12 14L15.5 10.5' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 24px center",
              backgroundSize: "32px",
              color: category ? "#000000" : placeholderColor,
            }}
          >
            <option value="" disabled>Category of attendee</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "20px",
              textAlign: "center",
              marginTop: "20px",
              fontFamily: "'ITC Charter', serif",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={isSubmitting}
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50px",
          right: "50px",
          padding: "30px",
          fontSize: "72px",
          fontWeight: "600",
          fontFamily: "'ITC Charter', serif",
          backgroundColor: "#FD5108",
          color: "white",
          border: "none",
          borderRadius: "0",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          transition: "all 0.3s ease",
          textTransform: "uppercase",
          letterSpacing: "4px",
        }}
      >
        {isSubmitting ? "SUBMITTING..." : "CONTINUE"}
      </button>
    </div>
  );
};

export default NewUserScreen;
