import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/CustomerDashboard";
import Navbar from "./components/Navbar";
import VerifyOtp from "./pages/VerifyOtp";
import ProfilePage from "./pages/ProfilePage";
import ApplyCertification from "./pages/ApplyCertification";
import CertificationProgress from "./pages/CertificationProgress";
import AssignedAudit from "./pages/AssignedAudit";
import AdminDashboard from "./pages/AdminDashboard";
import AuditorSetup from "./pages/AuditorSetup";
import InviteAuditor from "./pages/InviteAuditor";
import InvitationHistory from "./pages/InvitationHistory";
import AdminAuditors from "./pages/AdminAuditors";
import AdminCompanies from "./pages/AdminCompanies";
import ForgotPassword from "./pages/ForgotPassword";
import AdminManageApplications from "./pages/AdminManageApplications"
// import AuditorDashboard from "./pages/AuditorDashboard";
function App() {
  return (
    <BrowserRouter>
      {/* Granuler main navbar */}
      <Navbar />

      <Routes>
        {/* Redirect root to register */}
        <Route path="/" element={<Navigate to="/register" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
<Route path="/dashboard/apply" element={<ApplyCertification />} />
<Route path="/dashboard/progress" element={<CertificationProgress />} />
<Route path="/audit" element={<AssignedAudit />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/auditor/setup" element={<AuditorSetup />} />
<Route path="/admin/invite" element={<InviteAuditor />} />
<Route path="/admin/invitations" element={<InvitationHistory />} />
<Route path="/admin/auditors" element={<AdminAuditors />} />
<Route path="/admin/companies" element={<AdminCompanies />} />
{/* <Route path="/auditor/dashboard" element={<AuditorDashboard />} /> */}
<Route path="/forgot-password" element={<ForgotPassword />} />
 <Route path="/admin/applications" element={<AdminManageApplications />} />     
      </Routes>
    </BrowserRouter>
  );
}


export default App;
