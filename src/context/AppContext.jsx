import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [uniqueId, setUniqueId] = useState(null);
  const [gender, setGender] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImageBlob, setCapturedImageBlob] = useState(null);
  const [userImageUrl, setUserImageUrl] = useState(null);
  const [characterImageUrl, setCharacterImageUrl] = useState(null);
  const [outputImageUrl, setOutputImageUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const resetState = () => {
    setUniqueId(null);
    setGender(null);
    setSelectedCharacter(null);
    setCapturedImage(null);
    setCapturedImageBlob(null);
    setUserImageUrl(null);
    setCharacterImageUrl(null);
    setOutputImageUrl(null);
    setIsProcessing(false);
    setRegisteredUser(null);
  };

  const value = {
    uniqueId,
    setUniqueId,
    gender,
    setGender,
    selectedCharacter,
    setSelectedCharacter,
    capturedImage,
    setCapturedImage,
    capturedImageBlob,
    setCapturedImageBlob,
    userImageUrl,
    setUserImageUrl,
    characterImageUrl,
    setCharacterImageUrl,
    outputImageUrl,
    setOutputImageUrl,
    isProcessing,
    setIsProcessing,
    registeredUser,
    setRegisteredUser,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
