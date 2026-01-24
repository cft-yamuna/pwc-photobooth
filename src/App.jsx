import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import WelcomeScreen from "./screens/WelcomeScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import NewUserScreen from "./screens/NewUserScreen";
import GenderSelectionScreen from "./screens/GenderSelectionScreen";
import CharacterSelectionScreen from "./screens/CharacterSelectionScreen";
import FaceCaptureScreen from "./screens/FaceCaptureScreen";
import LoadingScreen from "./screens/LoadingScreen";
import OutputScreen from "./screens/OutputScreen";
import "./index.css";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/registration" element={<RegistrationScreen />} />
          <Route path="/new-user" element={<NewUserScreen />} />
          <Route path="/gender-selection" element={<GenderSelectionScreen />} />
          <Route
            path="/character-selection"
            element={<CharacterSelectionScreen />}
          />
          <Route path="/face-capture" element={<FaceCaptureScreen />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/output" element={<OutputScreen />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
