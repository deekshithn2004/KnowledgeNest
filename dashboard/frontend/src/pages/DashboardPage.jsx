import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, Users, Award, Calendar, User, Video, Settings, FileText, Brain } from "lucide-react";

const DashboardPage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
    // Animation trigger after component mounts
    setMounted(true);
  }, [authUser, navigate]);

  if (!authUser) return null;

  const menuItems = [
    { name: "Chat with Students", icon: <Users size={24} />, color: "bg-blue-500 hover:bg-blue-600", path: "/" },
    { name: "Quiz & Assessment", icon: <Award size={24} />, color: "bg-green-500 hover:bg-green-600", path: "/quiz" },
    { name: "AI Study Assistant", icon: <Brain size={24} />, color: "bg-purple-500 hover:bg-purple-600", path: "/ai-bot" },
    { name: "Time Table Planner", icon: <Calendar size={24} />, color: "bg-indigo-500 hover:bg-indigo-600", path: "/timetable" },
    { name: "View Profile", icon: <User size={24} />, color: "bg-yellow-500 hover:bg-yellow-600", path: "/profile" },
    // { name: "Video Meeting", icon: <Video size={24} />, color: "bg-orange-500 hover:bg-orange-600", path: "/video-meeting" },
    { 
      name: "Video Meeting", 
      icon: <Video size={24} />, 
      color: "bg-orange-500 hover:bg-orange-600", 
      path: "external",
      externalUrl: "http://localhost:3000/react-rtc-demo"
    },
    
    { name: "Notes & Resources", icon: <FileText size={24} />, color: "bg-teal-500 hover:bg-teal-600", path: "/notes" },
    { name: "Settings", icon: <Settings size={24} />, color: "bg-red-500 hover:bg-red-600", path: "/settings" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-2xl animate-float"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              background: `radial-gradient(circle, rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 200 + 55)}, 0.2), rgba(${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 200 + 155)}, 0.1))`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          />
        ))}
        
        {/* Animated lines/waves */}
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <svg className="wave-animation w-full h-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path className="wave wave1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path className="wave wave2" d="M0,128L48,138.7C96,149,192,171,288,186.7C384,203,480,213,576,192C672,171,768,117,864,106.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path className="wave wave3" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,272C960,277,1056,267,1152,240C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Animated particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white animate-particle"
            style={{
              width: `${Math.random() * 5 + 1}px`,
              height: `${Math.random() * 5 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDuration: `${Math.random() * 30 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl">
          <div className={`transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
              <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                Welcome, {authUser.fullName}!
              </h1>
              <p className="text-gray-200 text-center mb-1">
                Your learning journey continues today
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {menuItems.map((item, index) => (
              <div
                key={item.name}
                className={`transform transition-all duration-700 ease-out ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${150 * index}ms` }}
              >
                {/* <button
                  className={`w-full p-5 ${item.color} text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 h-32`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="bg-white/30 rounded-full p-2">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </button> */}
                <button
  className={`w-full p-5 ${item.color} text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-300 h-32`}
  onClick={() => item.path === "external" ? window.location.href = item.externalUrl : navigate(item.path)}
>
  <div className="bg-white/30 rounded-full p-2">
    {item.icon}
  </div>
  <span className="font-medium">{item.name}</span>
</button>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your global stylesheet
const styleTag = `
@keyframes float {
  0% {
    transform: translateY(0) translateX(0) rotate(0);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-20px) translateX(10px) rotate(10deg);
    opacity: 0.2;
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0);
    opacity: 0.1;
  }
}

@keyframes particle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-50px) translateX(20px);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-100px) translateX(-20px);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-150px) translateX(20px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(-200px) translateX(0);
    opacity: 0;
  }
}

@keyframes wave1 {
  0% {
    transform: translateX(-50%) scaleY(1);
  }
  50% {
    transform: translateX(0%) scaleY(0.8);
  }
  100% {
    transform: translateX(50%) scaleY(1);
  }
}

@keyframes wave2 {
  0% {
    transform: translateX(50%) scaleY(0.8);
  }
  50% {
    transform: translateX(0%) scaleY(1.2);
  }
  100% {
    transform: translateX(-50%) scaleY(0.8);
  }
}

@keyframes wave3 {
  0% {
    transform: translateX(-30%) scaleY(0.9);
  }
  50% {
    transform: translateX(10%) scaleY(1.1);
  }
  100% {
    transform: translateX(30%) scaleY(0.9);
  }
}

.animate-float {
  animation: float 15s infinite ease-in-out;
}

.animate-particle {
  animation: particle 20s infinite linear;
}

.wave-animation {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wave {
  fill: rgba(100, 120, 255, 0.2);
  transform-origin: center bottom;
}

.wave1 {
  animation: wave1 25s infinite linear;
}

.wave2 {
  fill: rgba(120, 100, 255, 0.15);
  animation: wave2 20s infinite linear;
}

.wave3 {
  fill: rgba(80, 150, 255, 0.1);
  animation: wave3 15s infinite linear;
}
`;

export default DashboardPage;