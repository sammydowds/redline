import { BrowserRouter, Route, Routes } from "react-router";
import { Editor } from "./components/Editor/Editor";
import { EditorHome } from "./components/Editor/EditorHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/edit" element={<Editor />} />
        <Route path="/edit/:fileName" element={<Editor />} />
        <Route path="/" element={<EditorHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
