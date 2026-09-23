import { useUser } from '@clerk/react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protects a route by checking Clerk authentication.
 * Unauthenticated users are redirected to "/" with state so
 * the landing page can open the sign-in modal automatically.
 */
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { pathname } = useLocation();

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />;
  }

  return children;
};

export default ProtectedRoute;
