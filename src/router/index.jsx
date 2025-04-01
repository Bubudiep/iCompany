import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../page";
import { UserProvider } from "../components/context/userContext";
import LandingPage from "../page/landing";
import Login from "../page/login";
import NotFoundPage from "../page/404";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Homepage />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
