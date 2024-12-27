import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ScrollToTop from "./utils/scrollToTop/ScrollToTop";
import InternetChecker from "./utils/InternetChecker/InternetChecker";
import Navbar from "./Template/Navbar";
import Login from "./Pages/Credentials/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Layout from "./Template/LayoutMain/LayoutMain/Layout";
import EmailModal from "./Pages/Credentials/Login/EmailModal";
import OtpModal from "./Pages/Credentials/Login/OtpModal";
import NewSignUps from "./Pages/NewSignUps/NewSignUps";
import Customers from "./Pages/Customers/Customers";
import Support from "./Pages/Support/Support";
import ReviewsAndRating from "./Pages/ReviewsAndRating/ReviewsAndRating";
import Categories from "./Pages/Categories/Categories";
import SubCategories from "./Pages/SubCategories/SubCategories";
import CommissionDue from "./Pages/CommissionDue/CommissionDue";
import VerifyChef from "./Pages/VerifyPartners/VerifyChef/VerifyChef";
import Booking from "./Pages/Booking/Booking";
import Pricing from "./Pages/Pricing/Pricing";
import Inquiries from "./Pages/Inquiries/Inquiries";
import Comments from "./Pages/Comments/Comments";
import Discount from "./Pages/Discount/Discount";
import Roles from "./Pages/Roles/Roles";
import Settings from "./Pages/Settings/Settings";
import Reporting from "./Pages/Reporting/Reporting";
import Staff from "./Pages/Staff/Staff";
// import VerifyChef from "./Pages/VerifyPartners/VerifyChef/VerifyChef";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isSuperAdminLoggedInOfServiceProvider");
    const encryptedToken = sessionStorage.getItem(
      "TokenForSuperAdminOfServiceProvider"
    );

    if (isLoggedIn === "true" && encryptedToken) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem("isSuperAdminLoggedInOfServiceProvider");
    sessionStorage.removeItem("TokenForSuperAdminOfServiceProvider");
  };

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Move the Router down here so useLocation works correctly
  return (
    <BrowserRouter>
      <AppContent
        isOffline={isOffline}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        loggedIn={loggedIn}
      />
    </BrowserRouter>
  );
}

function AppContent({ isOffline, loggedIn }) {
  const location = useLocation();

  // Define the layout paths where the Navbar should be hidden
  const isLayoutRoute = [
    "/dashboard",
    "/partners",
  ].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {/* Conditionally render the Navbar */}
      {!isLayoutRoute && <Navbar />}
      {isOffline && <InternetChecker />}

      <Routes>
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Login />} />
        <Route path="/email-modal" element={<EmailModal />} />
        <Route path="/OTPmodal" element={<OtpModal />} />

        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/partners" element={<NewSignUps />} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/support" element={<Support/>} />
          <Route path="/reviews-&-ratings" element={<ReviewsAndRating/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/sub-categories" element={<SubCategories/>}/>
          <Route path="/commission-due" element={<CommissionDue/>}/>
          <Route path="/verify-partner" element={<VerifyChef/>}/>
          <Route path="/booking" element={<Booking/>} />
          <Route path="/pricing-module" element={<Pricing/>}/>
          <Route path="/inquiries" element={<Inquiries/>}/>
          <Route path="/comments" element={<Comments/>}/>
          <Route path="/discount" element={<Discount/>}/>
          <Route path="/roles" element={<Roles/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/reporting" element={<Reporting/>} />
          <Route path="/staff" element={<Staff/>} />

        </Route>
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
