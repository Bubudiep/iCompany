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
import Chat_room from "../page/chat/messages/chatroom";
import Operators_layout from "../page/operators/layouts";
import Operator_list from "../page/operators/tools/list_op";
import Operator_news from "../page/operators/tools/new_op";
import Operator_work_report from "../page/operators/tools/report_op";
import Operator_offwork_report from "../page/operators/tools/offwork_op";
import Company_info from "../page/company/company_info";
import Company_setup from "./../page/company/company_setup";
import Company_accounts from "./../page/company/company_accounts";
import Company_roles from "./../page/company/company_roles";
import Profile from "../page/profile";
import Details_op from "../page/operators/tools/details_op";
import List_operators from "../page/operators/tools/list_ops";
import Company_partner from "../page/company/comapny_parner";
import Company_customer from "../page/company/company_customer";
import Mobile_layout from "../mobile/layout";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Homepage_layout />}>
            <Route path="chat" element={<Chat_layout />}>
              <Route index element={<Chat_room />} />
              <Route path=":id_room" element={<Chat_room />} />
            </Route>
            <Route path="companys" element={<Company_layout />}>
              <Route index element={<Company_info />} />
              <Route path="infomation" element={<Company_info />} />
              <Route path="configurations" element={<Company_setup />} />
              <Route path="accounts" element={<Company_accounts />} />
              <Route path="roles" element={<Company_roles />} />
              <Route path="customers" element={<Company_customer />} />
              <Route path="partners" element={<Company_partner />} />
            </Route>
            <Route path="operators" element={<Operators_layout />}>
              <Route index element={<Operator_list />} />
              <Route path="all" element={<Operator_list />}>
                <Route index element={<List_operators />} />
                <Route path=":op_id" element={<Details_op />} />
              </Route>
              <Route path="add" element={<Operator_news />} />
              <Route path="work_report" element={<Operator_work_report />} />
              <Route path="work_off" element={<Operator_offwork_report />} />
            </Route>
            <Route path="contacts" element={<Contacts_layout />}>
              <Route index element={<Contacts_list />} />
              <Route path=":filter" element={<Contacts_list />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="user" element={<Profile />} />
          </Route>
          <Route path="/mobile" element={<Mobile_layout />}></Route>
          <Route path="/login" element={<LoginModal />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/chat" element={<Chat_layout />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
