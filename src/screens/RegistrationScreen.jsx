import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";

const RegistrationScreen = () => {
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

  // Debounce effect to show "not found" message after 1.5 seconds
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
        backgroundColor: "#FDEEE4",
        display: "flex",
        flexDirection: "column",
        padding: "60px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Title Section */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "64px",
            fontWeight: "700",
            color: "#000000",
            margin: "0 0 10px 0",
            lineHeight: "1.1",
          }}
        >
          Tax AI and Human Skills
          <br />
          Immersion
        </h1>
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "32px",
            color: "#000000",
            margin: 0,
          }}
        >
          Building future - ready skills
        </p>
      </div>

      {/* Enter Name Section */}
      <div style={{ marginTop: "40px" }}>
        <label
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "32px",
            color: "#000000",
            display: "block",
            marginBottom: "16px",
          }}
        >
          Enter your name
        </label>

        <div style={{ position: "relative", maxWidth: "800px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={isLoading ? "Loading..." : ""}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "24px",
              fontSize: "28px",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                marginTop: "8px",
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
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
                    fontSize: "24px",
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
                        marginLeft: "12px",
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
                  fontSize: "24px",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  marginBottom: "20px",
                }}
              >
                Your name is not found. Please register.
              </p>
              <button
                onClick={handleRegister}
                style={{
                  padding: "16px 40px",
                  fontSize: "24px",
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
            left: "60px",
            right: "60px",
            padding: "24px",
            fontSize: "32px",
            fontWeight: "700",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            backgroundColor: "#E84C1E",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#d4411a";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#E84C1E";
          }}
        >
          CONTINUE
        </button>
      )}
    </div>
  );
};

export default RegistrationScreen;
