import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import Operator_offwork_report from "../page/operators/tools/offwork_op";
import Company_info from "../page/company/company_info";
import Company_setup from "./../page/company/company_setup";
import Company_accounts from "./../page/company/company_accounts";
import Company_roles from "./../page/company/company_roles";
import Profile from "../page/profile";
import Details_op from "../page/operators/tools/details_op";
import List_operators from "../page/operators/tools/list_ops";
import Company_partner from "../page/company/company_parner";
import Company_customer from "../page/company/company_customer";
import Mobile_layout from "../mobile/layout";
import Chat_page from "../page/chats/page";
import Chat_rooms from "../page/chats/rooms/page";
import Operator_worked_report from "../page/operators/tools/worked_op";
import Approves_layout from "../page/approve/layout";
import Approve_all from "../page/approve/tabs/all";
import Approve_details from "../page/approve/tabs/details";
import Dashboard_index from "../page/dashboard";
import OP_giolamviec from "./../page/operators/tools/bangcong/index";
import Extends_index from "../page/extends";
import QR_banks from "../page/extends/qrbanks";
import Notes_records from "../page/extends/notes";
import Numtotext from "../page/extends/numtotext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Homepage_layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard_index />} />
            <Route path="notes" element={<Notes_records />} />
            <Route path="extends" element={<Extends_index />}>
              <Route index element={<Navigate to="qrbanks" replace />} />
              <Route path="qrbanks" element={<QR_banks />} />
              <Route path="num2text" element={<Numtotext />} />
            </Route>
            <Route path="chat" element={<Chat_page />}>
              <Route index element={<Chat_rooms />} />
              <Route path=":id_room" element={<Chat_rooms />} />
            </Route>
            <Route path="companys" element={<Company_layout />}>
              <Route index element={<Navigate to="configurations" replace />} />
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
                <Route path=":op_id" element={<List_operators />} />
              </Route>
              <Route path="add" element={<Operator_news />} />
              <Route path="work_report" element={<Operator_work_report />} />
              <Route path="work_off" element={<Operator_offwork_report />} />
              <Route path="work_history" element={<Operator_worked_report />} />
              <Route path="work_hour" element={<OP_giolamviec />} />
            </Route>
            <Route path="approve" element={<Approves_layout />}>
              <Route index element={<Navigate to="all" replace />} />
              <Route path=":type" element={<Approve_all />}>
                <Route path=":approve_id" element={<Approve_details />} />
              </Route>
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
