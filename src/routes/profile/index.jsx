import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    medicalConditions: "",
    chronicIllnesses: "",
    allergies: "",
    familyHistory: "",
    medications: "",
    activityLevel: "",
    dietaryPreferences: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      setCheckingProfile(true);
      setError("");
      try {
        const uid = userId || user?.id;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setProfileExists(true);
          setForm({
            ...form,
            ...userDoc.data(),
            age: userDoc.data().age?.toString() || "",
          });
        }
      } catch (err) {
        setError("Error checking profile: " + err.message);
      } finally {
        setCheckingProfile(false);
      }
    };
    if (userId || user?.id) checkProfile();
    
  }, [userId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uid = userId || user?.id;
      await setDoc(doc(db, "users", uid), {
        ...form,
        age: form.age ? Number(form.age) : null,
      });
      setProfileExists(true);
      navigate(`/${uid}/info`);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Checking profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Health Profile
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us provide personalized health insights by sharing your
              medical information
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive animate-fade-in-up">
              {error}
            </div>
          )}

          {profileExists && !editing && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 flex items-center justify-between animate-fade-in-up">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <use href="/icons/sprite.svg#check-circle" />
                  </svg>
                </div>
                <span className="text-foreground font-medium">
                  Profile Complete
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(true)}
                className="hover:bg-secondary hover:text-white transition-all duration-300"
              >
                Update Profile
              </Button>
            </div>
          )}

          {/* Basic User Information */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-8 animate-slide-in-left">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <use href="/icons/sprite.svg#user" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Basic Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Age
                  </label>
                  <Input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Age in years"
                    min={0}
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full h-11 shadow-modern transition-all duration-300 disabled:opacity-50"
                    disabled={profileExists && !editing}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Medical History & Risk Factors */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-8 animate-slide-in-right">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <use href="/icons/sprite.svg#document-text" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Medical History
                </h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Pre-existing Medical Conditions
                  </label>
                  <Input
                    type="text"
                    name="medicalConditions"
                    value={form.medicalConditions}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes, Asthma, None"
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Chronic Illnesses
                  </label>
                  <Input
                    type="text"
                    name="chronicIllnesses"
                    value={form.chronicIllnesses}
                    onChange={handleChange}
                    placeholder="e.g. Arthritis, Thyroid, None"
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Allergies
                  </label>
                  <Input
                    type="text"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="e.g. Food, Medication, None"
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Family Medical History
                  </label>
                  <Input
                    type="text"
                    name="familyHistory"
                    value={form.familyHistory}
                    onChange={handleChange}
                    placeholder="e.g. Baldness, Diabetes, None"
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Current Medications
                  </label>
                  <Input
                    type="text"
                    name="medications"
                    value={form.medications}
                    onChange={handleChange}
                    placeholder="e.g. Supplements, None"
                    disabled={profileExists && !editing}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Lifestyle & Daily Habits */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 dark:border-gray-700/20 p-8 animate-fade-in-up">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <use href="/icons/sprite.svg#bolt-trend" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Lifestyle & Habits
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Physical Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={form.activityLevel}
                    onChange={handleChange}
                    className="w-full h-11 shadow-modern transition-all duration-300 disabled:opacity-50"
                    disabled={profileExists && !editing}
                    required
                  >
                    <option value="Sedentary">Sedentary</option>
                    <option value="Lightly Active">Lightly Active</option>
                    <option value="Moderately Active">Moderately Active</option>
                    <option value="Very Active">Very Active</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Dietary Preferences
                  </label>
                  <select
                    name="dietaryPreferences"
                    value={form.dietaryPreferences}
                    onChange={handleChange}
                    className="w-full h-11 shadow-modern transition-all duration-300 disabled:opacity-50"
                    disabled={profileExists && !editing}
                    required
                  >
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          {(!profileExists || editing) && (
            <div className="text-center animate-fade-in-up">
              <Button
                type="submit"
                disabled={loading}
                className="gradient-primary text-white text-lg px-8 py-4 rounded-xl hover:shadow-glow transition-all duration-300 font-semibold"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
