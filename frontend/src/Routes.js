// src/Routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ApplyForTour from "./pages/ApplyForTour";
import Login from "./pages/Login";
import Guide from "./pages/Guide";
import Admin from "./pages/Admin";
import About from "./pages/AboutPage"
import Advisor from "./pages/Advisor";
import CampusLife from "./pages/LifeInTheCampus";
import Coordinator from "./pages/Coordinator";
import VisualTour from "./pages/VisualTour";
import ApplicationsAndTours from "./pages/ApplicationsAndTours";
import WelcomePage from "./pages/WelcomePage.js";
import StaffAdjustments from "./pages/StaffAdjustments.js";
import AdvisorStaffAdjustments from "./pages/AdvisorStaffAdjustments.js";
import ResetPassword from "./pages/ResetPassword.js";
import UpdateAvailableSessions from "./pages/UpdateAvailableSessions";
import Proposals from "./pages/Proposal.js";
import ApprovedTours from "./pages/ApprovedTours.js";
import WelcomePageGuide from "./pages/WelcomePageGuide.js";
import TourSelectionPage from "./pages/TourSelectionPage.js";
import IndividualTourApplication from "./pages/IndividualTourApplication.js";
import DataPage from "./pages/DataPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apply" element={<TourSelectionPage />} /> {/* Yeni Sayfa */}
      <Route path="/apply/group-tour" element={<ApplyForTour />} />
      <Route path="/apply/individual-tour" element={<IndividualTourApplication />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Guide" element={<Guide />}>
        <Route index element={<WelcomePageGuide />} /> {/* Default route */}
        <Route path="update-available-sessions" element={<UpdateAvailableSessions />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="ApprovedTours" element={<ApprovedTours />} />
        {/* Add more nested routes here */}
      </Route>


      <Route path="/Admin" element={<Admin />}>
        <Route index element={<WelcomePage />} /> {/* Default route */}
        <Route path="staff-adjustments" element={<StaffAdjustments />} />
        <Route path="data-page" element={<DataPage />} />
        <Route path="applications-and-tours" element={<ApplicationsAndTours />} /></Route>
        

      <Route path="/Advisor" element={<Advisor />}>
        <Route index element={<WelcomePage />} /> {/* Default route */}
        <Route path="staff-adjustments1" element={<AdvisorStaffAdjustments />} />
        <Route path="applications-and-tours" element={<ApplicationsAndTours />} /></Route>

      <Route path="/Coordinator" element={<Coordinator />}></Route>
      <Route path="/visual-tour" element={<VisualTour />} />
      <Route path="/About" element={<About />} />
      <Route path="/CampusLife" element={<CampusLife />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
