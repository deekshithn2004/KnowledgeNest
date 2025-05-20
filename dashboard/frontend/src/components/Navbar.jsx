import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, LayoutDashboard, Home } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  // Pages where only Settings should be shown
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Pages where Dashboard should replace Logout
  const isOtherPage = ["/", "/quiz", "/ai-bot","/timetable","/profile","/notes","/settings"].includes(location.pathname);

  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-lg bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 shadow-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              
              <img 
        src="/logo.png" 
        alt="KnowledgeNest Logo" 
        className="h-10 object-contain"
      />
              
              <h1 className="text-xl font-extrabold text-white tracking-tight">KnowledgeNest</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Home Button - Always visible, redirects to dashboard */}
            <Link 
              to="/dashboard" 
              className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none shadow-md transition-all duration-300 gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {/* Settings Option Always Available */}
            <Link 
              to="/settings" 
              className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none shadow-md transition-all duration-300 gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* If User is Logged In */}
            {authUser && (
              <>
                {/* Show Profile on All Pages Except Login/Signup */}
                {!isAuthPage && (
                  <Link 
                    to="/profile" 
                    className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none shadow-md transition-all duration-300 gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                )}

                {/* Show Logout only on Dashboard */}
                {!isAuthPage && !isOtherPage && (
                  <button 
                    className="btn btn-sm bg-white/10 hover:bg-white/30 text-white border-none shadow-md transition-all duration-300 gap-2" 
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}

                {/* Show Dashboard Button instead of Logout on Chat, Quiz, AI Bot */}
                {isOtherPage && (
                  <Link 
                    to="/dashboard" 
                    className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none shadow-md transition-all duration-300 gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;