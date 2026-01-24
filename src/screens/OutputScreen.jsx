import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";

const OutputScreen = () => {
  const navigate = useNavigate();
  const { outputImageUrl, registeredUser, uniqueId, resetState } = useAppContext();
  const canvasRef = useRef(null);
  const [compositeImageUrl, setCompositeImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Get user details
  const userName = registeredUser?.full_name || "User Name";
  const userCategory = registeredUser?.tag || "Category";

  const generateCompositeImage = useCallback(async () => {
    if (!outputImageUrl) return;

    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Load frame image
      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";

      const frameLoaded = new Promise((resolve, reject) => {
        frameImg.onload = resolve;
        frameImg.onerror = reject;
      });
      frameImg.src = "/images/frame.png";

      // Load output image
      const outputImg = new Image();
      outputImg.crossOrigin = "anonymous";

      const outputLoaded = new Promise((resolve, reject) => {
        outputImg.onload = resolve;
        outputImg.onerror = reject;
      });
      outputImg.src = outputImageUrl;

      // Wait for both images to load
      await Promise.all([frameLoaded, outputLoaded]);

      // Set canvas size to match frame
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;

      // Draw frame first (background)
      ctx.drawImage(frameImg, 0, 0);

      // Calculate output image position (matching the gray area in frame)
      // These values are percentages converted to pixels based on frame dimensions
      const outputX = frameImg.width * 0.078;
      const outputY = frameImg.height * 0.265 + 50; // 50px down
      const outputWidth = frameImg.width * 0.844;
      const outputHeight = frameImg.height * 0.58 - 50; // Reduce height to compensate

      // Calculate aspect ratio to crop from bottom instead of squeezing
      const targetAspectRatio = outputWidth / outputHeight;
      const sourceAspectRatio = outputImg.width / outputImg.height;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = outputImg.width;
      let sourceHeight = outputImg.height;

      if (sourceAspectRatio < targetAspectRatio) {
        // Source is taller - crop from bottom
        sourceHeight = outputImg.width / targetAspectRatio;
        sourceY = 0; // Start from top, crop bottom
      } else {
        // Source is wider - crop from sides (center crop)
        sourceWidth = outputImg.height * targetAspectRatio;
        sourceX = (outputImg.width - sourceWidth) / 2;
      }

      // Draw output image with cropping
      ctx.drawImage(
        outputImg,
        sourceX, sourceY, sourceWidth, sourceHeight,
        outputX, outputY, outputWidth, outputHeight
      );

      // Draw user name (bottom left)
      ctx.font = "bold 48px 'ITC Charter', Georgia, serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      ctx.fillText(userName, frameImg.width * 0.07, frameImg.height * 0.92);

      // Draw category (bottom right)
      ctx.font = "400 48px 'ITC Charter', Georgia, serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "right";
      ctx.fillText(userCategory, frameImg.width * 0.93, frameImg.height * 0.92);

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0);
      });

      // Upload to Supabase
      const supabaseService = new SupabaseService();
      const uploadedUrl = await supabaseService.uploadImageBytes(
        blob,
        uniqueId,
        {
          prefix: "composite_",
          extension: ".png",
        }
      );

      if (uploadedUrl) {
        setCompositeImageUrl(uploadedUrl);

        // Also update the record in database with composite image
        await supabaseService.updateOutputImage(uniqueId, uploadedUrl);
      }
    } catch (error) {
      console.error("Error generating composite image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [outputImageUrl, userName, userCategory, uniqueId]);

  useEffect(() => {
    if (!outputImageUrl) {
      navigate("/");
      return;
    }

    generateCompositeImage();
  }, [outputImageUrl, navigate, generateCompositeImage]);

  const handleRetake = () => {
    navigate("/face-capture");
  };

  const handlePrint = () => {
    const imageUrl = compositeImageUrl || outputImageUrl;

    // Open print dialog for the composite image
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photo</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
            img { max-width: 100%; max-height: 100vh; }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleStartOver = () => {
    resetState();
    navigate("/");
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Hidden canvas for generating composite image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Frame with Output Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "30px",
        }}
      >
        {isGenerating ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "100px 20px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #FDEEE4",
                borderTop: "4px solid #FD5108",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <p
              style={{
                marginTop: "20px",
                fontFamily: "'ITC Charter', serif",
                fontSize: "20px",
                color: "#333",
              }}
            >
              Generating your photo...
            </p>
          </div>
        ) : compositeImageUrl ? (
          <img
            src={compositeImageUrl}
            alt="Your Photo with Frame"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        ) : (
          <>
            {/* Frame Background */}
            <img
              src="/images/frame.png"
              alt="Frame"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            {/* Output Image - positioned over the gray area in frame */}
            {outputImageUrl && (
              <img
                src={outputImageUrl}
                alt="Your Photo"
                style={{
                  position: "absolute",
                  top: "calc(26.5% + 50px)",
                  left: "7.8%",
                  width: "84.4%",
                  height: "calc(58% - 50px)",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            )}

            {/* User Name - bottom left */}
            <div
              style={{
                position: "absolute",
                bottom: "6%",
                left: "7%",
                fontFamily: "'ITC Charter', serif",
                fontSize: "24px",
                fontWeight: "700",
                color: "#000000",
              }}
            >
              {userName}
            </div>

            {/* Category - bottom right */}
            <div
              style={{
                position: "absolute",
                bottom: "6%",
                right: "7%",
                fontFamily: "'ITC Charter', serif",
                fontSize: "24px",
                fontWeight: "400",
                color: "#000000",
              }}
            >
              {userCategory}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          maxWidth: "600px",
          justifyContent: "center",
        }}
      >
        {/* Retake Button */}
        <button
          onClick={handleRetake}
          disabled={isGenerating}
          style={{
            flex: 1,
            padding: "20px",
            fontSize: "24px",
            fontWeight: "600",
            fontFamily: "'ITC Charter', serif",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            border: "2px solid #000000",
            borderRadius: "0",
            cursor: isGenerating ? "not-allowed" : "pointer",
            opacity: isGenerating ? 0.5 : 1,
            transition: "all 0.3s ease",
            textTransform: "uppercase",
          }}
        >
          RETAKE
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={isGenerating}
          style={{
            flex: 1,
            padding: "20px",
            fontSize: "24px",
            fontWeight: "600",
            fontFamily: "'ITC Charter', serif",
            backgroundColor: "#FD5108",
            color: "white",
            border: "none",
            borderRadius: "0",
            cursor: isGenerating ? "not-allowed" : "pointer",
            opacity: isGenerating ? 0.5 : 1,
            transition: "all 0.3s ease",
            textTransform: "uppercase",
          }}
        >
          PRINT
        </button>
      </div>

      {/* Start Over Button */}
      <button
        onClick={handleStartOver}
        style={{
          width: "548px",
          height: "136px",
          padding: "0",
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "0",
          cursor: "pointer",
          transition: "all 0.3s ease",
          marginTop: "20px",
        }}
      >
        <img
          src="/images/restart.png"
          alt="Start Over"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </button>
    </div>
  );
};

export default OutputScreen;
