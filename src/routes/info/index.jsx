import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Info = () => {
  const { userId } = useParams();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [error, setError] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      setError("");
      try {
        const q = query(
          collection(db, 'diagnosisReports'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedReports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(fetchedReports);
      } catch (err) {
        setError("Error fetching reports: " + err.message);
      } finally {
        setLoadingReports(false);
      }
    };
    if (userId) fetchReports();
  }, [userId]);

  const handleDiagnoseNow = async () => {
    setCheckingProfile(true);
    setError("");
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        navigate(`/${userId}/profile`);
      } else {
        navigate(`/${userId}/details`);
      }
    } catch (err) {
      setError("Error checking profile: " + err.message);
    } finally {
      setCheckingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Welcome Section */}
        <section className="mb-12 animate-fade-in-up">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome
              </span>
              <br />
              <span className="text-foreground">
                {!isLoaded ? '...' : (user?.fullName || user?.username || user?.emailAddress || 'User')}!
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to take control of your health? Let's start your personalized health journey.
            </p>
          </div>
        </section>

        {/* Diagnose Now Card */}
        <section className="mb-12 animate-slide-in-left">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-8 lg:p-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <use href="/icons/sprite.svg#check-circle" />
                </svg>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Start New Diagnosis</h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Begin a comprehensive health assessment with our advanced AI diagnostic system.
                </p>
              </div>
              <Button
                onClick={handleDiagnoseNow}
                disabled={checkingProfile}
                className="gradient-primary text-white text-lg px-8 py-4 rounded-xl hover:shadow-glow transition-all duration-300 font-semibold"
              >
                {checkingProfile ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Checking Profile...</span>
                  </div>
                ) : (
                  'Start Diagnosis'
                )}
              </Button>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Previous Reports */}
        <section className="animate-slide-in-right">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Previous Reports</h2>
              <p className="text-muted-foreground">Review your past health assessments</p>
            </div>
            
            {loadingReports ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-12">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-muted-foreground">Loading your reports...</span>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-12 text-center">
                <div className="w-16 h-16 bg-muted dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <use href="/icons/sprite.svg#document-text" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground">Start your first diagnosis to see your health reports here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-modern border border-white/20 dark:border-gray-700/20 p-6 cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => navigate(`/${userId}/${report.reportId}/result`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <use href="/icons/sprite.svg#document-text" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {report.createdAt
                              ? (report.createdAt.toDate
                                  ? report.createdAt.toDate().toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : new Date(report.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    }))
                              : '...'}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {report.createdAt
                              ? (report.createdAt.toDate
                                  ? report.createdAt.toDate().toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : new Date(report.createdAt).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }))
                              : '...'}
                          </div>

                        </div>
                      </div>
                      <div className="text-primary group-hover:translate-x-1 transition-transform duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <use href="/icons/sprite.svg#arrow-right" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {report.geminiResponse?.summaryReport || 'No summary available.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Info;