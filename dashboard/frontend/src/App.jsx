import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import QuizPage from "./pages/QuizPage"; // ✅ Import QuizPage
import AIBotPage from "./pages/AIBotPage";
// import TimeTablePlannerPage from "./pages/TimeTablePlannerPage";
import NotesGradePage from "./pages/NotesGradePage";
import TimetablePage from './pages/TimetablePage';
import NotesPage from "./pages/NotesPage";

import VideoMeetingPage from './pages/VideoMeetingPage';

// Inside your Routes
<Route path="/video-meeting" element={<VideoMeetingPage />} />


import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={authUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/quiz" element={authUser ? <QuizPage /> : <Navigate to="/login" />} /> {/* ✅ Add QuizPage Route */}
        <Route path="/ai-bot" element={authUser ? <AIBotPage /> : <Navigate to="/login" />} />
        {/* <Route path="/timetable" element={authUser ? <TimeTablePlannerPage /> : <Navigate to="/login" />} /> */}
        <Route path="/timetable" element={authUser ? <TimetablePage /> : <Navigate to="/login" />} />
        <Route path="/notes" element={authUser ? <NotesGradePage /> : <Navigate to="/login" />} />
        <Route path="/notes/:grade" element={authUser ? <NotesPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
