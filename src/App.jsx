import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LodingSipnner";
import { useAuthStore } from "../store/authStore";
import EmailVerification from "././AuthPages/EmailVerification.jsx";
import ForgetPassword from "././AuthPages/ForgetPassword.jsx";
import LoginPage from "././AuthPages/LoginPage.jsx";
import ResetPassword from "././AuthPages/ResetPassword.jsx";
import SignUpPage from "././AuthPages/SignUpPage.jsx";
import ProfilePage from "./HomePage/Components/ProfilePage";
import Home from "./HomePage/Home";
import SingleSnippet from "./HomePage/Snippents/SnippetId/SingleSnippet";
import Page from "./HomePage/Snippents/page";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/snippets"
            element={
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/snippets-Id/:snippetId"
            element={
              <ProtectedRoute>
                <SingleSnippet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route
            path="/forget-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgetPassword />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPassword />
              </RedirectAuthenticatedUser>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
