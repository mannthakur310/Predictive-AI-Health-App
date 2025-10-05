import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from '@/services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { generateDownloadPdf } from "@/lib/pdfGenerator";

const Result = () => {
  const { userId, reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const reportDoc = await getDoc(doc(db, 'diagnosisReports', reportId));
        if (!reportDoc.exists()) throw new Error('Report not found');
        setReport(reportDoc.data());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleDownloadClick = async () => {
    if (!report || !userId) {
      console.error("Report or user data is not available.");
      return;
    }
    setIsDownloading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userProfile = userDoc.exists() ? userDoc.data() : {};

      generateDownloadPdf(report, userProfile);

    } catch (e) {
      console.error('Error preparing for PDF download', e);
      alert('Failed to prepare data for PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Loading your health report...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-12 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#error" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Report</h3>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!report || !report.geminiResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-12 text-center">
          <div className="w-16 h-16 bg-muted dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#document-text" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Report Data</h3>
          <p className="text-muted-foreground">No report data available.</p>
        </div>
      </div>
    );
  }

  const gemini = report.geminiResponse;

  const renderSection = (title, items, icon, color = "primary") => {
    if (!items || items.length === 0) return null;

    return (
      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-8 animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-12 h-12 gradient-${color} rounded-2xl flex items-center justify-center`}>
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="space-y-4">
          {Array.isArray(items) ? items.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-4 bg-muted/30 dark:bg-gray-700/30 rounded-xl border border-border/100 dark:border-gray-600/20">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-foreground leading-relaxed">{item}</p>
            </div>
          )) : (
            <div className="p-4 bg-muted/30 dark:bg-gray-700/30 rounded-xl border border-border/100 dark:border-gray-600/20">
              <p className="text-foreground leading-relaxed">{items}</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#check-circle" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Health Report
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Your personalized health assessment and recommendations
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Generated on {report.createdAt?.toDate().toLocaleDateString()}
          </div>
        </div>

        <div className="space-y-8">
          {/* Diagnosis Results */}
          {renderSection(
            "Diagnosis Results",
            gemini.predictedDisease,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#bar-chart" />
            </svg>,
            "primary"
          )}

          {/* Personalized Guidance */}
          {renderSection(
            "Personalized Guidance",
            gemini.personalizedGuidance,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#lightbulb-sparkles" />
            </svg>,
            "secondary"
          )}

          {/* Prevention Strategies */}
          {renderSection(
            "Prevention Strategies",
            gemini.preventionStrategies,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#lock-closed" />
            </svg>,
            "primary"
          )}

          {/* Recommended Exercise */}
          {renderSection(
            "Recommended Exercise",
            gemini.recommendedExercise,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#bolt-trend" />
            </svg>,
            "secondary"
          )}

          {/* Nutrition Guidance */}
          {renderSection(
            "Nutrition Guidance",
            gemini.nutritionGuidance,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#shopping-cart" />
            </svg>,
            "primary"
          )}

          {/* Precautionary Measures */}
          {renderSection(
            "Precautionary Measures",
            gemini.precautionaryMeasures,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#shield-exclamation" />
            </svg>,
            "secondary"
          )}

          {/* Home Remedies */}
          {renderSection(
            "Home Remedies",
            gemini.homeRemedies,
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <use href="/icons/sprite.svg#beaker" />
            </svg>,
            "primary"
          )}

          <div className="pt-2 pb-6 flex justify-center">
            <Button onClick={handleDownloadClick} disabled={isDownloading} className="gradient-primary text-white text-base px-6 py-3 rounded-xl hover:shadow-glow transition-all duration-300">
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;