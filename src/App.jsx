import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './routes/home';
import Info from './routes/info';
import Result from './routes/result';
import Details from './routes/details';
import Profile from './routes/profile';
import About from './routes/about';
import HospitalFinder from './routes/hospital';
import UserCategories from './routes/chat/UserCategories';
import UserChat from './routes/chat/UserChat';
import DoctorLobby from './routes/doctor/DoctorLobby';
import DoctorChat from './routes/doctor/DoctorChat';
import ProtectedDoctorRoute from './routes/doctor/ProtectedDoctorRoute';
import SignInPage from './auth/SignInPage';
import SignUpPage from './auth/SignUpPage';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import ScrollToTop from './components/ScrollToTop';
import DoctorHeader from './components/DoctorHeader';
import { useEnsureUserProfile } from './lib/useEnsureUserProfile';

function AppRoutes() {
  const location = useLocation();
  useEnsureUserProfile();
  
  // Check if current route is a doctor route
  const isDoctorRoute = location.pathname.startsWith('/doctor');
  
  return (
    <>
      <ScrollToTop />
      {!isDoctorRoute ? <Header /> : <DoctorHeader />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/hospitals' element={<HospitalFinder />} />
        <Route path='/chat/categories' element={<UserCategories />} />
        <Route path='/chat/start/:category' element={<><SignedIn><UserChat /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>} />
        <Route path='/doctor' element={<ProtectedDoctorRoute><DoctorLobby /></ProtectedDoctorRoute>} />
        <Route path='/doctor/chat/:category/:chatId' element={<ProtectedDoctorRoute><DoctorChat /></ProtectedDoctorRoute>} />
        <Route path='/:userId/info' element={<Info />} />
        <Route path='/:userId/details' element={<Details />} />
        <Route path='/:userId/:reportId/result' element={<Result />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path=":userId/profile" element={<><SignedIn><Profile /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
