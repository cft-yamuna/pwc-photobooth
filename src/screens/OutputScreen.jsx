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
      // 105px margin on left, image extends to 105px from right edge
      const outputX = 105;
      const outputY = frameImg.height * 0.265 + 50; // 50px down
      const outputWidth = frameImg.width - 210 - 100; // 105px margin on each side, reduced by 100px
      const outputHeight = outputWidth; // 1:1 aspect ratio (square)

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
        // Source is wider - crop from right (left align)
        sourceWidth = outputImg.height * targetAspectRatio;
        sourceX = 0; // Start from left
      }

      // Draw output image with cropping
      ctx.drawImage(
        outputImg,
        sourceX, sourceY, sourceWidth, sourceHeight,
        outputX, outputY, outputWidth, outputHeight
      );

      // Helper function to wrap text at word boundaries
      const wrapText = (text, maxChars) => {
        if (text.length <= maxChars) return [text];
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          if ((currentLine + ' ' + word).trim().length <= maxChars) {
            currentLine = (currentLine + ' ' + word).trim();
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      };

      // Draw user name (bottom left) with wrapping for names > 25 chars
      ctx.font = "bold 72px 'ITC Charter', Georgia, serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";

      const nameLines = wrapText(userName, 20).slice(0, 2); // Max 20 chars per line, max 2 lines
      let nameY = outputY + outputHeight + 100; // Position 60px below the image
      const nameLineHeight = 80; // Space between lines (adjusted for 80px font)
      for (const line of nameLines) {
        ctx.fillText(line, 105, nameY);
        nameY += nameLineHeight;
      }

      // Draw category (left aligned, below name)
      ctx.font = "400 62px 'ITC Charter', Georgia, serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      const categoryY = nameY + 10; // Small gap below last name line
      ctx.fillText(userCategory, 105, categoryY);

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
            @page { 
              margin: 0; 
              size: 4in 6in;
            }
            body { 
              margin: 0; 
              padding: 0;
              width: 100%; 
              height: 100%;
            }
            img { 
              width: 100%; 
              height: 100%; 
              object-fit: fill;
            }
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
        backgroundImage: "url(/images/output-bg.png)",
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
          marginTop: "150px",
          maxWidth: "700px",
          marginBottom: "0px",
        }}
      >
        {isGenerating ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 10px",
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
                fontSize: "40px",
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
                  left: "6%",
                  width: "84.4%",
                  height: "calc(58% - 50px)",
                  objectFit: "cover",
                  objectPosition: "top left",
                }}
              />
            )}

            {/* User Name - bottom left */}
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "6%",
                fontFamily: "'ITC Charter', serif",
                fontSize: "40px",
                fontWeight: "700",
                color: "#000000",
              }}
            >
              {userName}
            </div>

            {/* Category - left aligned, below name */}
            <div
              style={{
                position: "absolute",
                bottom: "4%",
                left: "6%",
                fontFamily: "'ITC Charter', serif",
                fontSize: "34px",
                fontWeight: "400",
                color: "#000000",
              }}
            >
              {userCategory}
            </div>
          </>
        )}
      </div>

      {/* All Buttons Section - Fixed at Bottom */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50px",
          right: "50px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {/* Retake and Print Buttons Row */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
          <button
            onClick={handleRetake}
            disabled={isGenerating}
            style={{
              flex: 1,
              height: "136px",
              fontSize: "72px",
              fontWeight: "600",
              fontFamily: "'ITC Charter', serif",
              backgroundColor: "transparent",
              color: "#FD5108",
              border: "2px solid #FD5108",
              borderRadius: "0",
              cursor: isGenerating ? "not-allowed" : "pointer",
              opacity: isGenerating ? 0.5 : 1,
              transition: "all 0.3s ease",
              textTransform: "uppercase",
            }}
          >
            RETAKE
          </button>

          <button
            onClick={handlePrint}
            disabled={isGenerating}
            style={{
              flex: 1,
              height: "136px",
              fontSize: "72px",
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

        <button
            onClick={handleStartOver}
            disabled={isGenerating}
            style={{
              width: "100%",
              height: "136px",
              fontSize: "72px",
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
            HOME
          </button>
      </div>
    </div>
  );
};

export default OutputScreen;
