import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";
import { appConfig } from "../config/appConfig";

const NewUserScreen = () => {
  const navigate = useNavigate();
  const { setRegisteredUser } = useAppContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tag, setTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const supabaseService = useMemo(() => new SupabaseService(), []);

  const handleSubmit = async () => {
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !tag) {
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
      tag,
    });

    setIsSubmitting(false);

    if (result) {
      setRegisteredUser(result);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/gender-selection");
      }, 1500);
    } else {
      setError("Failed to register. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    fontSize: "28px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: "12px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    outline: "none",
    backdropFilter: "blur(10px)",
  };

  const labelStyle = {
    fontFamily: "var(--font-family)",
    fontSize: "24px",
    fontWeight: "600",
    color: "white",
    marginBottom: "8px",
    display: "block",
    textTransform: "uppercase",
  };

  return (
    <div
      className="screen-container"
      style={{
        backgroundImage: "url(/images/common_bg.png)",
        backgroundColor: "#0f172a",
      }}
    >
      <div className="screen-content">
        <h2
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "70px",
            fontWeight: "700",
            color: "white",
            marginBottom: "40px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          REGISTER NEW USER
        </h2>

        {showSuccess ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                color: "#10b981",
                marginBottom: "20px",
              }}
            >
              Registration Successful!
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Redirecting...
            </div>
          </div>
        ) : (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                autoComplete="off"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "24px",
                }}
              >
                <option value="" style={{ backgroundColor: "#1e293b" }}>
                  Select a tag
                </option>
                {appConfig.tagOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    style={{ backgroundColor: "#1e293b" }}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "20px",
                  textAlign: "center",
                  fontFamily: "var(--font-family)",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                marginTop: "20px",
                padding: "20px 40px",
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: "var(--font-family)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.3s ease",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </button>

            <button
              onClick={() => navigate("/registration")}
              style={{
                padding: "12px 24px",
                fontSize: "24px",
                fontFamily: "var(--font-family)",
                backgroundColor: "transparent",
                color: "rgba(255, 255, 255, 0.7)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "rgba(255, 255, 255, 0.7)";
              }}
            >
              Back to Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewUserScreen;
