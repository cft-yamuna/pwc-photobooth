import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";

const FaceCaptureScreen = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const {
    setUniqueId,
    setCapturedImage,
    setCapturedImageBlob,
    setUserImageUrl,
    gender,
    characterImageUrl,
  } = useAppContext();

  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const captureAndProcess = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setIsCapturing(false);
      return;
    }

    setCapturedImage(imageSrc);
    setIsProcessing(true);

    try {
      const supabaseService = new SupabaseService();
      const newUniqueId = supabaseService.generateUniqueId();
      setUniqueId(newUniqueId);

      const imageBlob = convertBase64ToBlob(imageSrc);
      setCapturedImageBlob(imageBlob);

      // Upload to Supabase
      const uploadedUrl = await supabaseService.uploadImageBytes(
        imageBlob,
        newUniqueId
      );

      if (!uploadedUrl) {
        throw new Error("Failed to upload image");
      }

      setUserImageUrl(uploadedUrl);

      // Save record to database
      await supabaseService.saveImageRecord({
        uniqueId: newUniqueId,
        imageUrl: uploadedUrl,
        gender: gender,
        characterImage: characterImageUrl,
      });

      // Navigate to loading screen for RunPod processing
      navigate("/loading");
    } catch (error) {
      console.error("Error processing capture:", error);
      alert("Failed to process image. Please try again.");
      setIsProcessing(false);
      setIsCapturing(false);
    }
  }, [
    webcamRef,
    gender,
    characterImageUrl,
    navigate,
    setUniqueId,
    setCapturedImage,
    setCapturedImageBlob,
    setUserImageUrl,
  ]);

  const startCapture = () => {
    setIsCapturing(true);
    setCountdown(3);
  };

  useEffect(() => {
    let timer;
    if (isCapturing && countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else if (countdown === 0) {
        // Countdown finished, trigger capture
        captureAndProcess();
        setCountdown(null); // Reset countdown
      }
    }
    return () => clearTimeout(timer);
  }, [isCapturing, countdown, captureAndProcess]);

  const convertBase64ToBlob = (base64Data) => {
    const byteString = atob(base64Data.split(",")[1]);
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
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
        <div
          style={{
            position: "relative",
            width: "708px",
            height: "916px",
            margin: "0 auto",
            border: "20px solid #0EC8F0",
            marginTop: "340px",

            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 708,
              height: 590,
              facingMode: "user",
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
            >
              <span
                style={{
                  fontSize: "150px",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                {countdown}
              </span>
            </div>
          )}
        </div>

        <div style={{ marginTop: "60px" }}>
          {!isCapturing && !isProcessing && (
            <button
              onClick={startCapture}
              style={{
                width: "690px",
                height: "202px",
                fontSize: "80px",
                fontWeight: "600",
                backgroundImage: "url(/images/capturebg.png)",
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
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
            </button>
          )}

          {isProcessing && (
            <div
              style={{
                fontSize: "60px",
                color: "white",
                fontFamily: "var(--font-family)",
                fontWeight: "600",
                animation: "fadeInOut 2s ease-in-out infinite",
              }}
            >
              <style>
                {`
                  @keyframes fadeInOut {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                  }
                `}
              </style>
              Magic happening...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceCaptureScreen;
