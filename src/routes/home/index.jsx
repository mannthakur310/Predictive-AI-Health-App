import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PanToolIcon from '@mui/icons-material/PanTool';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';

const Home = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingChatNavigate, setPendingChatNavigate] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80';

  const blogPosts = [
    {
      id: 'precision-nutrition',
      type: 'article',
      title: 'Precision Nutrition: Tailoring Diets with AI Insights',
      excerpt:
        'Discover how predictive analytics personalizes your nutrition plan, ensuring every meal supports your wellness goals and medical profile.',
      thumbnail: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
      tags: ['Nutrition', 'AI Insights'],
      updatedAt: '2025-11-01T08:30:00.000Z',
    },
    {
      id: 'cardio-fitness',
      type: 'video',
      title: 'AI Coach: Smarter Cardio Routines for Every Age',
      excerpt:
        'Our clinical fitness expert walks through adaptive workout plans that change with your vitals and wearable data.',
      thumbnail: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=900&q=80',
      mediaUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      tags: ['Exercise', 'Wearables'],
      updatedAt: '2025-11-06T10:15:00.000Z',
    },
    {
      id: 'mental-wellbeing',
      type: 'article',
      title: 'Balancing Stress with Predictive Mental Health Support',
      excerpt:
        'See how Predictive keeps tabs on stress signals, flags burnout risks early, and connects you with guided coping strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=900&q=80',
      tags: ['Mental Health', 'Lifestyle'],
      updatedAt: '2025-10-28T12:45:00.000Z',
    },
    {
      id: 'telehealth-evolution',
      type: 'article',
      title: 'Telehealth 2.0: How Predictive Tools Transform Remote Care',
      excerpt:
        'Explore the latest advancements in remote patient monitoring, virtual triage, and AI-assisted consultations for reliable at-home care.',
      thumbnail: 'https://images.unsplash.com/photo-1587502536263-929f6d27661a?auto=format&fit=crop&w=900&q=80',
      tags: ['Telehealth', 'Innovation'],
      updatedAt: '2025-11-05T07:20:00.000Z',
    },
    {
      id: 'sleep-lab',
      type: 'video',
      title: 'Sleep Lab: Decoding Rest Patterns with Predictive AI',
      excerpt:
        'Sleep researcher Dr. Meera Singh walks through case studies where AI spotted apnea risks days before wearables did.',
      thumbnail: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=900&q=80',
      mediaUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
      tags: ['Sleep', 'Chronic Care'],
      updatedAt: '2025-11-03T22:05:00.000Z',
    },
    {
      id: 'genomics-basics',
      type: 'article',
      title: 'Genomics 101: Making Sense of Predictive DNA Insights',
      excerpt:
        'Understand how Predictive translates raw genomic data into actionable health guidance and risk assessments that are easy to follow.',
      thumbnail: 'https://images.unsplash.com/photo-1581091870622-4a44384f5584?auto=format&fit=crop&w=900&q=80',
      tags: ['Genomics', 'Education'],
      updatedAt: '2025-10-30T09:40:00.000Z',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (timestamp) => {
    const updatedTime = new Date(timestamp).getTime();
    const diffMs = currentTime - updatedTime;

    if (Number.isNaN(updatedTime) || diffMs < 0) {
      return 'Just now';
    }

    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  };

  const handleThumbnailError = (event) => {
    if (event?.currentTarget) {
      event.currentTarget.onerror = null;
      event.currentTarget.src = FALLBACK_THUMBNAIL;
    }
  };

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
              
              {/* Improved Button Layout */}
              <div className="flex flex-col gap-4 max-w-2xl mx-auto lg:mx-0">
                {/* Primary Button - Full Width */}
                <Button 
                  onClick={handleDiagnoseNow}
                  className="gradient-primary text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-glow transition-all duration-300 font-semibold w-full"
                >
                  Start Diagnosis Now
                </Button>
                
                {/* Secondary Buttons - Side by Side on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <Button
                    onClick={() => {
                      if (!isSignedIn || !user) { setPendingChatNavigate(true); setShowLoginPopup(true); return; }
                      navigate('/chat/categories');
                    }}
                    variant="outline"
                    className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl w-full"
                  >
                    Chat with Doctor
                  </Button>
                  <Button
                    onClick={() => navigate('/hospitals')}
                    variant="outline"
                    className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl w-full"
                  >
                    Find Nearby Hospital
                  </Button>
                </div>
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

      {/* Blogs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 dark:bg-gray-900/40 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Fresh from the Predictive Health Desk
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Stay ahead with curated stories, clinical insights, and multimedia explainers that refresh as our experts publish new findings.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-modern border border-border/40 hover:border-primary/40 hover:shadow-glow transition-all duration-300"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {post.type === 'video' && activeVideoId === post.id ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      autoPlay
                      className="h-full w-full object-cover bg-black"
                    />
                  ) : (
                    <>
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={handleThumbnailError}
                      />
                      {post.type === 'video' && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoId((prev) => (prev === post.id ? null : post.id))}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity"
                          aria-label={activeVideoId === post.id ? 'Close video player' : 'Play health insights video'}
                        >
                          <PlayCircleOutlineIcon className="text-5xl drop-shadow-lg" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7 space-y-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary/80">
                    {post.tags.map((tag) => (
                      <span
                        key={`${post.id}-${tag}`}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{post.type === 'video' ? 'Video' : 'Article'}</span>
                    <span>Updated {getRelativeTime(post.updatedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;