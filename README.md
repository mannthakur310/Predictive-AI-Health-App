# 🏥 Predictive - AI-Powered Health Care Platform

<div align="center">

**A comprehensive AI-powered healthcare platform offering intelligent diagnostics, real-time doctor consultations, hospital finder, and curated health education.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Core Functionalities](#-core-functionalities)
- [API Integration](#-api-integration)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Predictive** is a cutting-edge healthcare platform that revolutionizes the way people access medical care. By combining advanced AI diagnostics, location-based services, and educational content, Predictive provides a comprehensive healthcare ecosystem in one seamless application.

### Mission

To democratize healthcare by making advanced AI diagnostics, professional medical consultations, emergency healthcare services, and trusted health education accessible to everyone, anywhere, anytime.

---

## ✨ Key Features

### 🤖 AI-Powered Health Diagnostics
- **Multi-Disease Detection**: Intelligent analysis of symptoms with likelihood assessment
- **Personalized Health Reports**: Comprehensive reports considering medical history, current symptoms, and lifestyle
- **Prevention Strategies**: Proactive recommendations to prevent health issues
- **Treatment Recommendations**: Evidence-based treatment suggestions
- **Nutrition & Exercise Plans**: Custom fitness and diet plans based on health profile
- **PDF Report Generation**: Download detailed health reports for offline access

### 💬 Real-Time Doctor Consultations
- **Category-Based Specialization**: Connect with doctors in 5 specialties:
  - General Medicine
  - Cardiology (Heart)
  - Orthopedics (Joint)
  - Dermatology
  - Neurology
- **Live Chat Interface**: Real-time messaging with healthcare professionals
- **File Sharing**: Share medical documents (PDF) during consultations
- **Doctor Lobby System**: Smart queue management for patient-doctor matching
- **Profile Auto-Sharing**: Automatic transmission of health profile to doctors
- **Medical History Access**: Doctors receive last 3 diagnosis summaries automatically

### 🏥 Hospital Finder
- **Interactive Map Interface**: Powered by Mapbox for accurate location services
- **GPS Location Detection**: Automatic user location detection
- **Location Search**: Search for any location worldwide
- **Nearby Hospital Discovery**: Automatic identification of medical facilities
- **Google Maps Integration**: One-click navigation to selected hospitals
- **Real-time Directions**: Turn-by-turn navigation support

### 📚 Health Education Hub
- **Curated Medical Videos**: Content from trusted healthcare institutions
- **YouTube Integration**: Embedded educational videos from verified sources
- **Category Tags**: Easy navigation through health topics
- **Video Thumbnails**: Quick preview of content
- **Responsive Player**: Optimized viewing experience on all devices

### 🔐 User Management & Security
- **Clerk Authentication**: Secure user authentication and authorization
- **User Profiles**: Comprehensive health profiles including:
  - Personal Information (Name, Age, Gender)
  - Medical History (Conditions, Illnesses, Allergies)
  - Family Medical History
  - Current Medications
  - Lifestyle Factors (Activity Level, Diet)
- **Firebase Integration**: Secure cloud storage for health data
- **Report History**: Access to all previous diagnosis reports
- **Privacy First**: Encrypted data storage and transmission

---

## 🛠 Tech Stack

### Frontend
- **React 19.1.0**: Modern UI framework with latest features
- **React Router DOM 7.7.0**: Client-side routing
- **Vite 7.0.4**: Next-generation build tool
- **TailwindCSS 4.1.11**: Utility-first CSS framework
- **Material-UI 7.2.0**: Component library for consistent design
- **Lucide React**: Modern icon library
- **Clerk React 5.39.0**: Authentication UI components

### Backend & Real-Time Communication
- **Express 5.1.0**: Web application framework
- **Socket.io 4.8.1**: Real-time bidirectional communication
- **Node.js**: JavaScript runtime environment

### AI & Data Services
- **Google Generative AI 1.11.0**: Gemini AI integration for health diagnostics
- **Firebase 12.0.0**: Cloud database and authentication
- **Firestore**: NoSQL database for user profiles and reports

### Mapping & Location
- **Mapbox GL 3.15.0**: Interactive maps and geocoding
- **Mapbox Geocoder 5.1.2**: Location search functionality

### Utilities & Libraries
- **jsPDF 2.5.2**: PDF generation for health reports
- **UUID**: Unique identifier generation
- **Clerk Themes**: Pre-built authentication themes
- **Vercel Analytics**: Performance monitoring

### Development Tools
- **ESLint**: Code quality and consistency
- **Concurrently**: Run multiple commands simultaneously
- **PostCSS**: CSS processing
- **Vite Plugin React**: Fast refresh and JSX support

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google AI (Gemini) API key
- Mapbox API key
- Clerk account

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prayanshu97/Predictive-AI-Health-App.git
   cd "Predictive - AI Health App"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # Google Generative AI (Gemini)
   VITE_GEMINI_API=your_gemini_api_key

   # Mapbox
   VITE_MAPBOX_API_KEY=your_mapbox_api_key

   # Socket Server (optional, defaults to localhost:3001)
   VITE_SOCKET_URL=http://localhost:3001
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   This will start both the client (Vite) and server (Express) concurrently.

   - Client: http://localhost:5157
   - Server: http://localhost:3001

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📖 Usage

### For Patients

1. **Sign Up / Sign In**
   - Create an account using Clerk authentication
   - Choose from email, Google, or other OAuth providers

2. **Complete Health Profile**
   - Fill in personal information
   - Add medical history and current medications
   - Specify lifestyle factors

3. **Get AI Diagnosis**
   - Navigate to "Start Diagnosis"
   - Enter current symptoms and severity
   - Receive comprehensive health report in seconds
   - Download PDF report for records

4. **Consult with Doctors**
   - Select specialty category
   - Connect with available doctors
   - Share medical history automatically
   - Chat in real-time

5. **Find Hospitals**
   - Use GPS or search location
   - View nearby hospitals on map
   - Get directions via Google Maps

6. **Learn from Videos**
   - Browse health education content
   - Watch curated medical videos
   - Stay informed about health topics

### For Doctors

1. **Access Doctor Panel**
   - Navigate to `/doctor` route
   - Protected route for healthcare professionals

2. **View Patient Requests**
   - Monitor incoming consultation requests by specialty
   - See patient basic information
   - View real-time request counts

3. **Accept Consultations**
   - Accept patient requests
   - Receive patient health profile automatically
   - Access last 3 diagnosis summaries

4. **Conduct Consultations**
   - Real-time messaging
   - Receive and review medical documents
   - Provide professional medical advice

---

## 🔧 Core Functionalities

### 1. AI Diagnostic System

**Flow:**
```
User Profile + Symptoms → Gemini AI → Comprehensive Health Report
```

**Features:**
- Multi-disease prediction with likelihood assessment
- Personalized guidance based on medical history
- Prevention strategies tailored to user profile
- Exercise recommendations
- Nutrition guidance
- Precautionary measures
- Home remedies
- Summary report generation

**Technology:**
- Google Gemini 2.0 Flash model
- JSON-structured responses
- Streaming API for fast responses
- Context-aware analysis using patient history

### 2. Real-Time Chat System

**Architecture:**
```
Client ←→ Socket.io ←→ Express Server ←→ Client
```

**Features:**
- Category-based room management
- Ephemeral in-memory chat storage
- Automatic profile sharing
- File upload (PDF) support
- Connection status indicators
- 60-second doctor wait timer
- Graceful disconnection handling

**Server Events:**
- `register`: User/Doctor registration
- `user:start_chat`: Initiate consultation
- `doctor:accept_chat`: Accept patient request
- `chat:message`: Send text messages
- `chat:file`: Share documents
- `chat:profile`: Share health data
- `chat:end`: End consultation

### 3. Hospital Finder

**Technology Stack:**
- Mapbox GL JS for rendering
- Mapbox Geocoding API for search
- Browser Geolocation API
- Google Maps API for directions

**Features:**
- Interactive map with zoom controls
- POI (Point of Interest) detection
- Healthcare facility filtering
- Custom markers and popups
- Responsive design
- Search suggestions with autocomplete

### 4. User Profile Management

**Data Structure:**
```javascript
{
  name: string,
  age: number,
  gender: string,
  medicalConditions: string,
  chronicIllnesses: string,
  allergies: string,
  familyHistory: string,
  medications: string,
  activityLevel: string,
  dietaryPreferences: string
}
```

**Features:**
- Profile creation and editing
- Form validation
- Automatic profile checking
- Update mode for existing profiles
- Firestore integration for persistence

### 5. Report Management

**Storage:**
```
Firebase Firestore → diagnosisReports collection
```

**Report Structure:**
```javascript
{
  userId: string,
  reportId: string (UUID),
  symptoms: object,
  geminiResponse: object,
  createdAt: timestamp
}
```

**Features:**
- Chronological report history
- Quick access to past diagnoses
- PDF export functionality
- Detailed view with all recommendations
---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

---

## 📝 License

This project is **private** and proprietary. All rights reserved.

---

<div align="center">

**Made with ❤️ for better healthcare access**

⭐ Star this repo if you find it helpful!

</div>
