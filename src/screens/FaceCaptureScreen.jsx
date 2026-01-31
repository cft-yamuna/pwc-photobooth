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
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/images/capture-screen-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FDEEE4",
        position: "relative",
      }}
    >
      {/* Webcam Container */}
      <div
        style={{
          position: "absolute",
          width: "865px",
          height: "1007px",
          top: "562px",
          left: "107.5px",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 865,
            height: 1007,
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

      {/* Capture Button */}
      {!isCapturing && !isProcessing && (
        <button
          onClick={startCapture}
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50px",
            right: "50px",
            backgroundColor: "#FD5108",
            border: "none",
            cursor: "pointer",
            padding: "30px",
            fontSize: "72px",
            fontWeight: "600",
            fontFamily: "'ITC Charter', serif",
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "4px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          CAPTURE
        </button>
      )}

      {/* Processing Message */}
      {isProcessing && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "40px",
            color: "#000",
            fontFamily: "'ITC Charter', serif",
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
        </div>
      )}
    </div>
  );
};

export default FaceCaptureScreen;
