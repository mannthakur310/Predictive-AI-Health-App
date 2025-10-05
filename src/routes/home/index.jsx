import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PanToolIcon from '@mui/icons-material/PanTool';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';

const Home = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingChatNavigate, setPendingChatNavigate] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLoginPopup && event.target.classList.contains('popup-overlay')) {
        setShowLoginPopup(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (showLoginPopup && event.key === 'Escape') {
        setShowLoginPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showLoginPopup]);

  const handleDiagnoseNow = async () => {
    if (!isSignedIn || !user) {
      setShowLoginPopup(true);
      return;
    }
    
    try {
      // Check Firestore for user profile
      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // First time user - redirect to profile page
        navigate(`/${user.id}/profile`);
      } else {
        // Existing user - redirect to predictor page
        navigate(`/${user.id}/info`);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      // If there's an error, redirect to profile page as fallback
      navigate(`/${user.id}/profile`);
    }
  };

  const features = [
    {
      icon: <PanToolIcon className="text-4xl text-primary" />,
      title: "Prevention",
      description: "Advanced AI-powered prevention strategies"
    },
    {
      icon: <VaccinesIcon className="text-4xl text-secondary" />,
      title: "Remedies",
      description: "Personalized treatment recommendations"
    },
    {
      icon: <DirectionsRunIcon className="text-4xl text-primary" />,
      title: "Exercise",
      description: "Custom fitness plans for optimal health"
    },
    {
      icon: <RestaurantMenuIcon className="text-4xl text-secondary" />,
      title: "Nutrition",
      description: "AI-curated diet plans and meal suggestions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Main Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12+ sm:py-16 lg:py-20 xl:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in-up text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Predictive
                  </span>
                  <br />
                  <span className="text-foreground">AI-Powered Health Care</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Revolutionizing healthcare with comprehensive, rapid AI diagnostic capabilities. 
                  Get accurate multi-disease detection, prevention strategies, and personalized health support.
                </p>
              </div>
              
              {/* 2x2 Button Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
                {/* First Row */}
                <Button 
                  onClick={handleDiagnoseNow}
                  className="gradient-primary text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-glow transition-all duration-300 font-semibold"
                >
                  Start Diagnosis
                </Button>
                <Button
                  onClick={() => {
                    if (!isSignedIn || !user) { setPendingChatNavigate(true); setShowLoginPopup(true); return; }
                    navigate('/chat/categories');
                  }}
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl"
                >
                  Chat with Doctor
                </Button>
                
                {/* Second Row */}
                <Button
                  onClick={() => navigate('/hospitals')}
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl"
                >
                  Find Nearby Hospital
                </Button>
                {/* Second column empty for future use */}
                <div></div>
              </div>
              
              {showLoginPopup && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fade-in popup-overlay p-4"
                    onClick={e => {
                      if (e.target.classList.contains('popup-overlay')) setShowLoginPopup(false);
                    }}
                  >
                    <div
                      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center w-full max-w-sm"
                      onClick={e => e.stopPropagation()}
                    >
                      <h2 className="text-lg sm:text-xl font-bold mb-4 text-primary">Please login first</h2>
                      <Button onClick={() => { setShowLoginPopup(false); navigate('/sign-in'); }} className="gradient-primary text-white px-6 py-2 rounded-md mb-2 w-full">Login</Button>
                      <Button variant="outline" onClick={() => setShowLoginPopup(false)} className="px-6 py-2 rounded-md w-full">Cancel</Button>
                      {pendingChatNavigate && isSignedIn && (
                        <Button onClick={() => { setShowLoginPopup(false); setPendingChatNavigate(false); navigate('/chat/categories'); }} className="mt-3 w-full">Continue to Chat</Button>
                      )}
                    </div>
                  </div>
                )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">99%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-secondary">24*7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">&lt;30s</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Analysis Time</div>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative animate-slide-in-right order-first lg:order-last">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl dark:from-primary/10 dark:to-secondary/10"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-modern border border-white/20 dark:border-gray-700/20">
                  <img
                    className="w-full h-auto rounded-2xl shadow-lg"
                    src="image.jpg"
                    alt="AI Health Technology"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Health Solutions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need for optimal health management
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-modern hover:shadow-glow transition-all duration-300 border border-border/50 hover:border-primary/20 dark:border-gray-700/50 dark:hover:border-primary/30"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-muted to-background dark:from-gray-700 dark:to-gray-600 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose Predictive?
            </h2>
            <div className="prose prose-sm sm:prose-base lg:prose-lg mx-auto text-muted-foreground leading-relaxed dark:prose-invert">
              <p>
                Our platform is designed to help you gain clear and personalized insights about your health. Whether you want to stay proactive, understand common symptoms, or improve your daily wellness routine, we provide easy-to-use tools and reliable guidance to support your health journey.
              </p>
              <p>
                With 24*7 availability and instant analysis, Predictive ensures you always have access to helpful health information and recommendations. Your privacy and security are our top priorities, so your health data remains protected while you receive the care and support you need.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;