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
<Route path="/apply" element={<ApplyCertification />} />
<Route path="/progress" element={<CertificationProgress />} />
<Route path="/audit" element={<AssignedAudit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
