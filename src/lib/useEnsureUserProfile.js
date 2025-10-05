import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export function useEnsureUserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run if Clerk is loaded and user is signed in
    if (!isLoaded || !isSignedIn || !user) return;

    const checkUserProfile = async () => {
      const userId = user.id;
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      const onAuth = ["/sign-in", "/sign-up"].some(path => location.pathname === path || location.pathname.startsWith(path + "/"));
      if (userDocSnap.exists()) {
        // No redirect from Home page
        if (onAuth) {
          navigate(`/`, { replace: true });
        }
      } else {
        if (!location.pathname.includes('/profile')) {
          navigate(`/${userId}/profile`, { replace: true });
        }
      }
    };
    checkUserProfile();
  }, [user, isLoaded, isSignedIn, navigate, location]);
} 