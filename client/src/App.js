import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Components/login";
import { Signup } from "./Components/signup";
import { GeoData } from "./Components/geo_data";
import { FileUpload } from "./Components/fileupload";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/geoData" element={<GeoData />} />
        <Route exact path="/upload" element={<FileUpload />} />
      </Routes>
    </div>
  );
}

export default App;
