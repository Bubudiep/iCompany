import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import { UserProvider } from "../components/context/userContext";
import LandingPage from "../page/landing";
import NotFoundPage from "../page/404";
import Chat_layout from "../page/chat/layouts/layout";
import Homepage_layout from "../page/app_layout";
import LoginModal from "../page/app_login";
import Contacts_layout from "../page/contacts/layout";
import Contacts_list from "../page/contacts/list_contacts";
import Company_layout from "../page/company/layout";
import Operators_layout from "../page/operators/layouts";
import Operator_list from "../page/operators/tools/list_op";
import Operator_news from "../page/operators/tools/new_op";
import Operator_work_report from "../page/operators/tools/report_op";
// import Profile from "../page/profile";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Homepage_layout />}>
            <Route path="chat" element={<Chat_layout />} />
            <Route path="companys" element={<Company_layout />}></Route>
            <Route path="operators" element={<Operators_layout />}>
              <Route index element={<Operator_list />} />
              <Route path="all" element={<Operator_list />} />
              <Route path="add" element={<Operator_news />} />
              <Route path="work_report" element={<Operator_work_report />} />
            </Route>
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
