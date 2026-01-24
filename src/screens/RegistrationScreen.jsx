import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";

const RegistrationScreen = () => {
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
    "PwC",
    "Client",
    "Speaker",
    "Other"
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
    padding: "24px 20px",
    fontSize: "28px",
    fontFamily: "'ITC Charter', serif",
    borderRadius: "0",
    border: "none",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    outline: "none",
    boxSizing: "border-box",
  };

  const placeholderColor = "#666666";

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url(/images/welcome_screen_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FDEEE4",
        display: "flex",
        flexDirection: "column",
        padding: "50px",
        boxSizing: "border-box",
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* Title Section */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontFamily: "'ITC Charter', serif",
            fontSize: "48px",
            fontWeight: "700",
            color: "#000000",
            margin: "0 0 8px 0",
            lineHeight: "1.2",
          }}
        >
          Tax AI and Human Skills
          <br />
          Immersion
        </h1>
        <p
          style={{
            fontFamily: "'ITC Charter', serif",
            fontSize: "28px",
            fontWeight: "400",
            color: "#000000",
            margin: 0,
          }}
        >
          Building future - ready skills
        </p>
      </div>

      {/* Register Section */}
      <div>
        <h2
          style={{
            fontFamily: "'ITC Charter', serif",
            fontSize: "36px",
            fontWeight: "700",
            color: "#000000",
            margin: "0 0 20px 0",
          }}
        >
          Register yourself
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
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
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23666666' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 20px center",
              backgroundSize: "24px",
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
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23666666' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 20px center",
              backgroundSize: "24px",
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
          padding: "20px",
          fontSize: "32px",
          fontWeight: "400",
          fontFamily: "'ITC Charter', serif",
          backgroundColor: "#E84C1E",
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

export default RegistrationScreen;
