import React from 'react';
import ScienceIcon from '@mui/icons-material/Science';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const About = () => {
  const keyFeatures = [
    {
      icon: <ChatBubbleOutlineIcon className="text-4xl text-primary" />,
      title: "Chat with Doctor",
      description: "Connect with certified healthcare professionals in real-time for instant medical advice and consultations"
    },
    {
      icon: <LocalHospitalIcon className="text-4xl text-secondary" />,
      title: "Find Nearby Hospital",
      description: "Locate hospitals and medical facilities instantly with our integrated map-based search and directions"
    },
    {
      icon: <VideoLibraryIcon className="text-4xl text-primary" />,
      title: "Health Education Videos",
      description: "Access curated medical videos from trusted healthcare institutions and leading medical experts"
    }
  ];

  const features = [
    {
      icon: <ScienceIcon className="text-4xl text-primary" />,
      title: "Advanced AI Technology",
      description: "Powered by cutting-edge AI for accurate diagnostics"
    },
    {
      icon: <SpeedIcon className="text-4xl text-secondary" />,
      title: "Instant Analysis",
      description: "Get comprehensive health insights in seconds with our rapid diagnostic capabilities"
    },
    {
      icon: <SecurityIcon className="text-4xl text-primary" />,
      title: "Privacy First",
      description: "Your health data is encrypted and secure in our database"
    },
    {
      icon: <PsychologyIcon className="text-4xl text-secondary" />,
      title: "Personalized Health Support",
      description: "Comprehensive health assessment and personalized wellness recommendations"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10 dark:opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-32">
          <div className="text-center space-y-6 sm:space-y-8 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="text-foreground">Predictive</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
              Revolutionizing healthcare through the power of artificial intelligence. 
              We're committed to making advanced health diagnostics, real-time doctor consultations, 
              hospital finder, and health education accessible to everyone in one comprehensive platform.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Our Mission
            </h2>
            <div className="prose prose-sm sm:prose-base lg:prose-lg mx-auto text-muted-foreground leading-relaxed dark:prose-invert px-4">
              <p>
                At Predictive, we believe that everyone deserves access to advanced healthcare technology. 
                Our mission is to democratize healthcare by leveraging cutting-edge AI diagnostics, real-time telemedicine consultations, 
                hospital location services, and curated health education to provide comprehensive, personalized health solutions to individuals worldwide.
              </p>
              <p>
                We've built a comprehensive platform that combines AI-powered diagnostics with real-time doctor consultations, 
                hospital finder capabilities, and educational video content. Our platform helps identify potential health concerns, 
                connects users with certified healthcare professionals, locates nearby medical facilities, and provides trusted educational 
                resources—all while offering practical recommendations for prevention and overall wellness improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Key Features
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed to meet all your medical needs
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-white to-muted/30 dark:from-gray-800 dark:to-gray-700/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-modern hover:shadow-glow transition-all duration-300 border-2 border-border/50 hover:border-primary/40 dark:border-gray-700/50 dark:hover:border-primary/40"
              >
                <div className="flex flex-col space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 w-fit group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Our Technology
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Built on the latest advancements in artificial intelligence
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



      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <EmojiEventsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">99%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Accuracy Rate</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SpeedIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">&lt;30s</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SecurityIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-secondary">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Data Security</div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default About;
