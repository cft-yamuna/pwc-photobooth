import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const OutputScreen = () => {
  const navigate = useNavigate();
  const { outputImageUrl, resetState } = useAppContext();

  useEffect(() => {
    if (!outputImageUrl) {
      navigate("/");
      return;
    }
  }, [outputImageUrl, navigate]);

  const handleRetake = () => {
    navigate("/face-capture");
  };

  const handlePrint = () => {
    // Open print dialog for the output image
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photo</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; }
          </style>
        </head>
        <body>
          <img src="${outputImageUrl}" onload="window.print(); window.close();" />
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
        backgroundImage: "url('/images/welcome_screen_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#FDEEE4",
        position: "relative",
      }}
    >
      {/* Output Image Container */}
      <div
        style={{
          position: "absolute",
          width: "865px",
          height: "1007px",
          top: "562px",
          left: "107.5px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        {outputImageUrl && (
          <img
            src={outputImageUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Retake Button */}
      <button
        onClick={handleRetake}
        style={{
          position: "absolute",
          width: "466px",
          height: "136px",
          top: "1688px",
          left: "62px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <img
          src="/images/retake.png"
          alt="Retake"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={{
          position: "absolute",
          width: "466px",
          height: "136px",
          top: "1688px",
          left: "548px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <img
          src="/images/print.png"
          alt="Print"
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
