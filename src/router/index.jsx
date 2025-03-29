import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../page";
import { UserProvider } from "../components/context/userContext";
import LandingPage from "../page/landing";
import Login from "../page/login";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Homepage />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
