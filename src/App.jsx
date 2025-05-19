import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AutoFaceCapture from "./components/AutoFaceCapture";
import VoiceRAGPage from "./components/VoiceRAGPage";
import TextAnimationPage from "./components/TextAnimationPage"; 
import SimpleTextAnimation from "./components/SimpleTextAnimation"
import TranslationPage from "./components/TranslationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AutoFaceCapture />} />
        <Route path="/rag" element={<VoiceRAGPage />} />
        {/* <Route path="/demo" element={<TextAnimationPage />} />  */}
        <Route path="/demo" element={<SimpleTextAnimation />} />
        <Route path="/translation" element={<TranslationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
