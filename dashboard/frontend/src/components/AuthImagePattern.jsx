const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center relative bg-gradient-to-br from-primary/90 to-primary-focus overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-white/10 transform -skew-y-6"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-white/10 transform skew-y-6"></div>
        <div className="grid grid-cols-6 gap-4 h-full w-full p-10">
          {Array(24).fill(0).map((_, i) => (
            <div key={i} className="rounded-full bg-white/20 h-12 w-12 transform translate-y-1/2"></div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 max-w-md text-center px-8 py-12 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="flex flex-col items-center gap-8">
          {/* Abstract illustration */}
          <div className="w-48 h-48 relative">
            <div className="absolute w-32 h-32 rounded-full bg-white/20 top-0 left-0"></div>
            <div className="absolute w-24 h-24 rounded-full bg-white/30 bottom-0 right-0"></div>
            <div className="absolute w-16 h-16 rounded-full bg-white/40 top-8 right-8"></div>
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full"
            >
              <path
                fill="rgba(255, 255, 255, 0.6)"
                d="M47.7,-57.2C59.5,-45.9,65.8,-28.9,67.2,-12.2C68.7,4.5,65.2,20.9,56.4,33.8C47.6,46.7,33.5,56.2,17.7,61.6C1.9,67,-15.6,68.2,-32.5,63.3C-49.4,58.3,-65.6,47.1,-73.6,31.2C-81.6,15.3,-81.3,-5.3,-74.2,-22.9C-67.1,-40.5,-53.2,-55.2,-37.6,-65.2C-21.9,-75.3,-4.6,-80.7,10.9,-77.8C26.5,-74.9,35.9,-68.5,47.7,-57.2Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="text-white/80 text-lg">{subtitle}</p>
          </div>
          
          {/* Additional decorative elements */}
          <div className="flex space-x-3 mt-6">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-white/70 animate-pulse delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-white/50 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-white/70 text-sm">
        Secure login • Privacy protected
      </div>
    </div>
  );
};

export default AuthImagePattern;
