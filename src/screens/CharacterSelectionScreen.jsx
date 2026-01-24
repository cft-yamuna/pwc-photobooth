import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CharacterSelectionScreen = () => {
  const navigate = useNavigate();
  const { gender, setSelectedCharacter, setCharacterImageUrl } =
    useAppContext();
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacterLocal] = useState(null);

  // Helper to get previous and next indices
  const getPrevIndex = () => (currentIndex === 0 ? characters.length - 1 : currentIndex - 1);
  const getNextIndex = () => (currentIndex === characters.length - 1 ? 0 : currentIndex + 1);

  // Hardcoded URLs as requested
  const BASE_URL =
    "https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/pwc_character_images";

  useEffect(() => {
    if (!gender) {
      navigate("/gender-selection");
      return;
    }

    loadCharacters();
  }, [gender, navigate]);

  const loadCharacters = () => {
    const chars = [];
    const genderPath = gender.toLowerCase();

    for (let i = 1; i <= 6; i++) {
      const num = i.toString().padStart(2, "0");
      const filename = `${genderPath}${num}.png`;

      // Local path for UI display
      const localPath = `/images/${filename}`;

      // Remote URL for processing
      const remoteUrl = `${BASE_URL}/${genderPath}/${filename}`;

      chars.push({
        id: i,
        displayUrl: localPath,
        remoteUrl: remoteUrl,
        name: `Character ${i}`,
      });
    }

    setCharacters(chars);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1));
  };

  const handleCharacterSelect = () => {
    const character = characters[currentIndex];
    setSelectedCharacterLocal(character);
    setSelectedCharacter(character);
    setCharacterImageUrl(character.remoteUrl);
  };

  const handleContinue = () => {
    navigate("/face-capture");
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
            fontSize: "80px",
            fontWeight: "700",
            color: "white",
            marginBottom: "40px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          SELECT YOUR STYLE
        </h2>

        {characters.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "60px",
              position: "relative",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {/* Carousel Container */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: "900px",
                height: "800px",
                overflow: "hidden",
              }}
            >
              {/* Previous Character Image (partially visible on left, smaller) */}
              <div
                onClick={handlePrevious}
                style={{
                  position: "absolute",
                  left: "-200px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                  opacity: 0.7,
                }}
              >
                <img
                  src={characters[getPrevIndex()].displayUrl}
                  alt="Previous character"
                  style={{
                    width: "400px",
                    height: "600px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              {/* Active Character Image (center, bigger) */}
              <div
                onClick={handleCharacterSelect}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  zIndex: 5,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={characters[currentIndex].displayUrl}
                  alt={characters[currentIndex].name}
                  style={{
                    width: "550px",
                    height: "820px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />

                {/* Left Arrow - overlayed on center image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  style={{
                    position: "absolute",
                    left: "30px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    padding: "15px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <span
                    style={{
                      fontSize: "100px",
                      color: "white",
                      fontWeight: "bold",
                      textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                    }}
                  >
                    &#171;
                  </span>
                </button>

                {/* Right Arrow - overlayed on center image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  style={{
                    position: "absolute",
                    right: "30px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    padding: "15px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <span
                    style={{
                      fontSize: "100px",
                      color: "white",
                      fontWeight: "bold",
                      textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                    }}
                  >
                    &#187;
                  </span>
                </button>
              </div>

              {/* Next Character Image (partially visible on right, smaller) */}
              <div
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: "-200px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                  opacity: 0.7,
                }}
              >
                <img
                  src={characters[getNextIndex()].displayUrl}
                  alt="Next character"
                  style={{
                    width: "400px",
                    height: "600px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Continue Button - Shows after character selection */}
        {selectedCharacter && (
          <button
            onClick={handleContinue}
            style={{
              position: "absolute",
              bottom: "-200px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "581.58px",
              height: "167.88px",
              fontSize: "75px",
              fontWeight: "600",
              backgroundImage: "url(/images/continuebg.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "transparent",
              color: "black",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-family)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateX(-50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateX(-50%) scale(1)";
            }}
          >
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterSelectionScreen;
