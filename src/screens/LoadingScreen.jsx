import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import GeminiService from "../services/geminiService";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const {
    uniqueId,
    userImageUrl,
    characterImageUrl,
    setOutputImageUrl,
    gender,
    selectedCharacter,
  } = useAppContext();

  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!uniqueId || !userImageUrl) {
      navigate("/");
      return;
    }

    processImage();
  }, []);

  const processImage = async () => {
    try {
      setStatusMessage("Preparing your transformation...");

      setStatusMessage("Generating with Gemini AI...");
      const geminiService = new GeminiService();

      const outputUrl = await geminiService.generateImage({
        userImageUrl,
        uniqueId: uniqueId,
      });

      if (!outputUrl) {
        throw new Error("Failed to generate image");
      }

      setOutputImageUrl(outputUrl);

      setStatusMessage("Complete! Redirecting...");
      setTimeout(() => {
        navigate("/output");
      }, 1000);
    } catch (error) {
      console.error("Processing error:", error);
      setHasError(true);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  const handleTryAgain = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url(/images/plain-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FDEEE4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px",
        boxSizing: "border-box",
      }}
    >
      <style>
        {`
          /* Rotating rings animation */
          .loader-rings {
            position: relative;
            width: 150px;
            height: 150px;
          }

          .loader-rings .ring {
            position: absolute;
            border: 4px solid transparent;
            border-radius: 50%;
          }

          .loader-rings .ring:nth-child(1) {
            width: 150px;
            height: 150px;
            border-top-color: #FD5108;
            animation: rotate1 1.5s linear infinite;
          }

          .loader-rings .ring:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 15px;
            left: 15px;
            border-right-color: #FD5108;
            animation: rotate2 1.5s linear infinite;
          }

          .loader-rings .ring:nth-child(3) {
            width: 90px;
            height: 90px;
            top: 30px;
            left: 30px;
            border-bottom-color: #FD5108;
            animation: rotate1 1s linear infinite;
          }

          .loader-rings .ring:nth-child(4) {
            width: 60px;
            height: 60px;
            top: 45px;
            left: 45px;
            border-left-color: #FD5108;
            animation: rotate2 1s linear infinite;
          }

          @keyframes rotate1 {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes rotate2 {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }

          /* Pulsing dots */
          .dots-container {
            display: flex;
            gap: 12px;
            margin-top: 40px;
          }

          .dot {
            width: 16px;
            height: 16px;
            background-color: #FD5108;
            border-radius: 50%;
            animation: pulse 1.4s ease-in-out infinite;
          }

          .dot:nth-child(1) { animation-delay: 0s; }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
          .dot:nth-child(4) { animation-delay: 0.6s; }
          .dot:nth-child(5) { animation-delay: 0.8s; }

          @keyframes pulse {
            0%, 100% {
              transform: scale(0.6);
              opacity: 0.4;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }

          /* Text shimmer effect */
          .shimmer-text {
            background: linear-gradient(
              90deg,
              #000000 0%,
              #FD5108 50%,
              #000000 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 2s linear infinite;
          }

          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}
      </style>

      {!hasError ? (
        <div style={{ textAlign: "center" }}>
          {/* Animated Rings Loader */}
          <div className="loader-rings" style={{ margin: "0 auto 30px" }}>
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
          </div>

          {/* Pulsing Dots */}
          <div className="dots-container" style={{ justifyContent: "center" }}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>

          {/* Loading Text */}
          <h2
            className="shimmer-text"
            style={{
              fontFamily: "'ITC Charter', serif",
              fontSize: "48px",
              fontWeight: "700",
              marginTop: "40px",
            }}
          >
            Magic is happening...
          </h2>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "80px",
              marginBottom: "20px",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontFamily: "'ITC Charter', serif",
              fontSize: "40px",
              fontWeight: "700",
              color: "#dc2626",
              marginBottom: "20px",
            }}
          >
            Oops! Something Went Wrong
          </h2>
          <p
            style={{
              fontFamily: "'ITC Charter', serif",
              fontSize: "24px",
              color: "#333333",
              whiteSpace: "pre-line",
              maxWidth: "600px",
              marginBottom: "30px",
            }}
          >
            {statusMessage}
          </p>

          <button
            onClick={handleTryAgain}
            style={{
              padding: "20px 60px",
              fontSize: "28px",
              fontWeight: "600",
              fontFamily: "'ITC Charter', serif",
              backgroundColor: "#FD5108",
              color: "white",
              border: "none",
              borderRadius: "0",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
