import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { getGeminiResponse } from "@/services/AIModel";
import { AI_PROMPT } from "@/constants/prompt";
import { db } from "@/services/firebaseConfig";
import {doc,getDoc,setDoc,collection,query,where,orderBy,limit,getDocs,serverTimestamp} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

const Details = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    primarySymptoms: "",
    secondarySymptoms: "",
    severity: "Mild", // Set a default value
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Fetch user profile
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) throw new Error("User profile not found");
      const profile = userDoc.data();

      // 2. LOGIC TO FETCH THE MOST RECENT DIAGNOSIS SUMMARY
      let recentDiagnosisSummary = "No recent diagnosis available.";
      const reportsQuery = query(
        collection(db, "diagnosisReports"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"), // Order by date, newest first
        limit(1) // Get only the most recent one
      );

      const querySnapshot = await getDocs(reportsQuery);
      if (!querySnapshot.empty) {
        const lastReport = querySnapshot.docs[0].data();
        // Extract the summary from the last report's Gemini response
        recentDiagnosisSummary = lastReport.geminiResponse?.summaryReport || "Summary not available in the last report.";
      }

      // 3. Fill the prompt with all the data
      const prompt = AI_PROMPT.replace("{name}", profile.name || "N/A")
        .replace("{age}", profile.age || "N/A")
        .replace("{gender}", profile.gender || "N/A")
        .replace("{medicalConditions}", profile.medicalConditions || "None")
        .replace("{chronicIllnesses}", profile.chronicIllnesses || "None")
        .replace("{allergies}", profile.allergies || "None")
        .replace("{familyHistory}", profile.familyHistory || "None")
        .replace("{medications}", profile.medications || "None")
        .replace("{activityLevel}", profile.activityLevel || "N/A")
        .replace("{dietaryPreferences}", profile.dietaryPreferences || "N/A")
        .replace("{primarySymptoms}", form.primarySymptoms)
        .replace("{secondarySymptoms}", form.secondarySymptoms)
        .replace("{severity}", form.severity)
        .replace("{duration}", form.duration)
        .replace("{recentDiagnosisSummary}", recentDiagnosisSummary);

      // 4. Get Gemini response
      const geminiRaw = await getGeminiResponse(prompt);
      let gemini;
      try {
        gemini = JSON.parse(geminiRaw);
      } catch (err) {
        console.error("Raw AI Response:", geminiRaw); // Log the raw response for debugging
        throw new Error("AI response was not in a valid JSON format.");
      }

      // 5. Create and save the new diagnosis report
      const reportId = uuidv4();
      const report = {
        userId,
        reportId,
        symptoms: form, // Store form data neatly
        geminiResponse: gemini,
        createdAt: serverTimestamp(), // Use serverTimestamp for consistency
      };
      await setDoc(doc(db, "diagnosisReports", reportId), report);
      
      // 6. Redirect to the result page
      navigate(`/${userId}/${reportId}/result`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
      {error && <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{error}</div>}
      <section>
        <h2 className="text-lg font-semibold mb-4">Primary Symptoms</h2>
        <Input
          type="text"
          name="primarySymptoms"
          value={form.primarySymptoms}
          onChange={handleChange}
          placeholder="e.g. Fever, Cough, Headache"
          required
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Secondary Symptoms</h2>
        <Input
          type="text"
          name="secondarySymptoms"
          value={form.secondarySymptoms}
          onChange={handleChange}
          placeholder="e.g. Fatigue, Body Ache, or None"
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Symptoms Severity</h2>
        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 bg-transparent"
          required
        >
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Duration of Symptoms</h2>
        <Input
          type="text"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="e.g. 3 days, 1 week"
          required
        />
      </section>
      
      <Button
        type="submit"
        className="w-full my-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold disabled:bg-blue-300 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Generating Report...</span>
          </div>
        ) : (
          "Generate Diagnosis Report"
        )}
      </Button>
    </form>
  );
};

export default Details;
