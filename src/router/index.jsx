import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import { UserProvider } from "../components/context/userContext";
import LandingPage from "../page/landing";
import NotFoundPage from "../page/404";
import Chat_layout from "../page/chat/layout";
import Homepage_layout from "../page/app_layout";
import LoginModal from "../page/app_login";
import Contacts_layout from "../page/contacts/layout";
import Contacts_list from "../page/contacts/list_contacts";
// import Profile from "../page/profile";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Homepage_layout />}>
            <Route path="chat" element={<Chat_layout />} />
            <Route path="contacts" element={<Contacts_layout />}>
              <Route index element={<Contacts_list />} />
              <Route path=":filter" element={<Contacts_list />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/login" element={<LoginModal />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/chat" element={<Chat_layout />} />
          {/* <Route path="/settings" element={<Profile />} /> */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
