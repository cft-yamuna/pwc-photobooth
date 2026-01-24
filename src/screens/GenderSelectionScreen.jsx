import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const GenderSelectionScreen = () => {
  const navigate = useNavigate();
  const { setGender, setSelectedCharacter, setCharacterImageUrl } = useAppContext();
  const [selectedGender, setSelectedGender] = useState(null);

  const BASE_URL =
    "https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/pwc_character_images";

  const handleGenderSelect = (genderValue) => {
    setSelectedGender(genderValue);
    setGender(genderValue);
  };

  const handleContinue = () => {
    const characterFile = selectedGender === "male" ? "male.png" : "female.png";
    const characterUrl = `${BASE_URL}/${selectedGender}/${characterFile}`;

    setSelectedCharacter({ name: characterFile });
    setCharacterImageUrl(characterUrl);

    navigate("/face-capture");
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
      {/* Select Gender Section */}
      <div style={{ marginTop: "250px" }}>
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "36px",
            fontWeight: "700",
            color: "#000000",
            margin: "0 0 20px 0",
          }}
        >
          Select Gender
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "flex-start",
          }}
        >
          {/* Male Option */}
          <div
            onClick={() => handleGenderSelect("male")}
            style={{
              cursor: "pointer",
              textAlign: "center",
              transition: "transform 0.2s ease",
              border: selectedGender === "male" ? "4px solid #E84C1E" : "4px solid transparent",
              padding: "10px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/images/male_image.png"
              alt="Male"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Female Option */}
          <div
            onClick={() => handleGenderSelect("female")}
            style={{
              cursor: "pointer",
              textAlign: "center",
              transition: "transform 0.2s ease",
              border: selectedGender === "female" ? "4px solid #E84C1E" : "4px solid transparent",
              padding: "10px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/images/female_image.png"
              alt="Female"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>

      {/* Continue Button - Fixed at bottom */}
      {selectedGender && (
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

export default GenderSelectionScreen;
