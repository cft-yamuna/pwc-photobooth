import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { setRegisteredUser } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const supabaseService = useMemo(() => new SupabaseService(), []);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const users = await supabaseService.getAllUsers();
      setAllUsers(users);
      setIsLoading(false);
    };
    loadUsers();
  }, [supabaseService]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allUsers
      .filter((user) => user.full_name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [searchQuery, allUsers]);

  useEffect(() => {
    setShowNotFound(false);

    if (!searchQuery.trim() || selectedUser || filteredUsers.length > 0) {
      return;
    }

    const timer = setTimeout(() => {
      if (searchQuery.trim() && filteredUsers.length === 0 && !selectedUser) {
        setShowNotFound(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchQuery, filteredUsers.length, selectedUser]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedUser(null);
    setShowDropdown(true);
    setShowNotFound(false);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.full_name);
    setShowDropdown(false);
  };

  const handleContinue = () => {
    if (selectedUser) {
      setRegisteredUser(selectedUser);
      navigate("/gender-selection");
    }
  };

  const handleRegister = () => {
    navigate("/new-user");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url(/images/welcome_screen_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FDEEE4",
        padding: "50px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
     
     

      {/* Enter Name Section */}
      <div style={{ marginTop: "400px" }}>
        <label
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "28px",
            color: "#000000",
            display: "block",
            marginBottom: "16px",
          }}
        >
          Enter your name
        </label>

        <div style={{ position: "relative", maxWidth: "100%" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={isLoading ? "Loading..." : ""}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "20px 24px",
              fontSize: "24px",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              borderRadius: "0",
              border: "none",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          {/* Dropdown */}
          {showDropdown && filteredUsers.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: "4px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 10,
              }}
            >
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  style={{
                    padding: "16px 24px",
                    fontSize: "22px",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    color: "#000000",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  <span>{user.full_name}</span>
                  {user.tag && (
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "18px",
                        color: "#666666",
                        fontStyle: "italic",
                      }}
                    >
                      ({user.tag})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Not Found Message */}
          {showNotFound && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "22px",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  marginBottom: "16px",
                }}
              >
                Your name is not found. Please register.
              </p>
              <button
                onClick={handleRegister}
                style={{
                  padding: "14px 36px",
                  fontSize: "20px",
                  fontWeight: "600",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                REGISTER NOW
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button - Fixed at bottom */}
      {selectedUser && (
        <button
          onClick={handleContinue}
          style={{
            position: "fixed",
            bottom: "40px",
            left: "50px",
            right: "50px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img
            src="/images/continuebutton.png"
            alt="Continue"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </button>
      )}
    </div>
  );
};

export default WelcomeScreen;
