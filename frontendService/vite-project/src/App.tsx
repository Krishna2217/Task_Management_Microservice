// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Import your components and pages
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import FeatureUnderDevelopmentPage from "./pages/FeatureUnderDevelopmentPage";
import Footer from "./components/Footer";
import UserProfilePage from "./pages/UserProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import DashboardLayout from "./layouts/DashboardLayout";
import TaskListPage from "./pages/TaskListPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import DonePage from "./pages/DonePage";
import AssignedPage from "./pages/Assigned";
import NotAssignedPage from "./pages/NotAssigned";

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* --- 1. Public Routes --- */}
          {/* All routes nested here will share the PublicLayout (Navbar + Footer). */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HeroSection />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact-sales" element={<FeatureUnderDevelopmentPage featureName="Contact Sales" />} />
          </Route>

          {/* --- 2. Standalone Auth Routes --- */}
          {/* These routes do not have the main Navbar or Footer. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* --- 3. Protected Dashboard Routes --- */}
          {/* The parent route is protected. This protects all its children. */}
          {/* It renders the DashboardLayout (with the Sidebar). */}
          <Route path="/dashboard" element={ <DashboardLayout />}
          >
            {/* The 'index' route is the default page shown at "/dashboard" */}
            <Route index element={<TaskListPage />} />
            
            {/* These child routes render inside the DashboardLayout's <Outlet> */}
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="tasks/done" element={<DonePage/>} />
            <Route path="tasks/assigned" element={<AssignedPage />} />
            <Route path="tasks/unassigned" element={<NotAssignedPage />} />
            <Route path="tasks/new" element={<CreateTaskPage/>} />
            <Route path="tasks/:id" element={<FeatureUnderDevelopmentPage featureName="Task Details" />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;