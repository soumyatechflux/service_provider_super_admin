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
import Banner from "./Pages/Banner/Banner";
import Services from "./Pages/Services/Services";
import FAQs from "./Pages/FAQs/FAQs";
import AboutUs from "./Pages/AboutUs/AboutUs";
import TermsConditions from "./Pages/Terms&Conditions/TermsConditions";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import CancellationPlicy from "./Pages/CancellationPlicy/CancellationPlicy";
import RefundPolicy from "./Pages/RefundPolicy/RefundPolicy";
import ServerDown from "./Pages/ServerDown/ServerDown";
import UnderConstruction from "./Pages/UnderConstruction/UnderConstruction";
import CookForDayTab from "./Pages/SubCategories/Settings/Chef/CookForDay/CookForDayTab";
import CookForOneMeal from "./Pages/SubCategories/Settings/Chef/CookForOneMeal/CookForOneMeal";
import ChefForPartyTab from "./Pages/SubCategories/Settings/Chef/ChefForParty/ChefForPartyTab";
import OutStationTripTab from "./Pages/SubCategories/Settings/Driver/OutStationTripTab/OutStationTripTab";
import OutStationRoundTripTab from "./Pages/SubCategories/Settings/Driver/OutStationRoundTripTab/OutStationRoundTripTab";
import RoundTripTab from "./Pages/SubCategories/Settings/Driver/RoundTripTab/RoundTripTab";
import OneWayTripTab from "./Pages/SubCategories/Settings/Driver/OneWayTripTab/OneWayTripTab";
import MonthlySubscriptionTab from "./Pages/SubCategories/Settings/Gardener/MonthlySubscriptionTab/MonthlySubscriptionTab";
import GardnerDayVisitTab from "./Pages/SubCategories/Settings/Gardener/GardnerDayVisitTab/GardnerDayVisitTab";
import HelpCentre from "./Pages/HelpCentre/HelpCentre";
import ContactUs from "./Pages/ContactUs/ContactUs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check session storage for login status
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
    sessionStorage.setItem("isSuperAdminLoggedInOfServiceProvider", "true");
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

const PrivateRoute = ({ loggedIn, children }) => {
  // Check session storage for login status
  const isLoggedIn = sessionStorage.getItem("isSuperAdminLoggedInOfServiceProvider") === "true";
  return isLoggedIn ? children : <Navigate to="/" />;
};

function AppContent({ isOffline, loggedIn }) {
  const location = useLocation();

  const isLayoutRoute = ["/dashboard", "/partners"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!isLayoutRoute && <Navbar />}
      {isOffline && <InternetChecker />}

      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Login />} />
        <Route path="/email-modal" element={<EmailModal />} />
        <Route path="/OTPmodal" element={<OtpModal />} />

        <Route
          element={
            <PrivateRoute loggedIn={loggedIn}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/partners" element={<NewSignUps />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/support" element={<Support />} />
          <Route path="/reviews-&-ratings" element={<ReviewsAndRating />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sub-categories" element={<SubCategories />} />
          <Route path="/commission-due" element={<CommissionDue />} />
          <Route path="/verify-partner" element={<VerifyChef />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pricing-module" element={<Pricing />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/discount" element={<Discount />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/staff" element={<Staff/>} />
          <Route path="/banner" element={<Banner/>} />
          <Route path="/services" element={<Services/>}/>
          <Route path="/faq" element={<FAQs/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/terms-and-conditions" element={<TermsConditions/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/cancellation-policy" element={<CancellationPlicy/>}/>
          <Route path="/refund-policy" element={<RefundPolicy/>}/>
          <Route path="/help-centre" element={<HelpCentre/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>


          <Route path="/serverDown" element={<ServerDown/>}/>
          <Route path="/underconstruction" element={<UnderConstruction/>}/>

          <Route path="/sub-categories-cook-for-one-meal" element={<CookForOneMeal/>}/>
          <Route path="/sub-categories-cook-for-day" element={<CookForDayTab/>}/>
          <Route path="/sub-categories-chef-for-party" element={<ChefForPartyTab/>}/>

          <Route path="/sub-categories-outstaion-round-trip" element={<OutStationRoundTripTab/>}/>
          <Route path="/sub-categories-outstaion-trip" element={<OutStationTripTab/>}/>
          <Route path="/sub-categories-round-trip" element={<RoundTripTab/>}/>
          <Route path="/sub-categories-one-way-trip" element={<OneWayTripTab/>}/>

          <Route path="/sub-categories/monthly-subscription" element={<MonthlySubscriptionTab/>}/>
          <Route path="/sub-categories/gardner-visit" element={<GardnerDayVisitTab/>}/>

        </Route>
      </Routes>
    </>
  );
}

export default App;
