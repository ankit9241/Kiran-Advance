import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./utils/api";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import MentorDashboard from "./pages/MentorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Homepage from "./components/Homepage";
import RegisterStudent from "./components/RegisterStudent";
import RegisterMentor from "./components/RegisterMentor";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";
import About from "./pages/about";
import Contact from "./pages/contact";
import Support from "./pages/support";
import Footer from "./components/Footer";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/privacy";
import TermsOfService from "./pages/terms";
import Error404 from "./pages/Error404";
import ContactSales from "./pages/contact-sales";
import Testimonials from "./pages/testimonials";
import Preferences from "./pages/preferences";

// Student Dashboard is imported where needed
import HelpSupport from "./pages/help-support";
import TestConnection from "./components/TestConnection";
import PublicNavbar from "./components/PublicNavbar";
import ScrollToTop from "./components/ScrollToTop";
import NotificationsPage from "./pages/notifications";

// Auth context with types
interface AuthContextType {
  isLoggedIn: boolean;
  userRole: "student" | "mentor" | "admin" | null;
  user: any;
  isApproved?: boolean;
  isInitialized: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserRole: (role: "student" | "mentor" | "admin" | null) => void;
  setUser: (user: any) => void;
  login: (role: "student" | "mentor" | "admin", userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface ProtectedRouteProps {
  children: (user: any) => React.ReactNode;
  role?: "student" | "mentor" | "admin";
  requireApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role,
  requireApproval = false,
}) => {
  const { isLoggedIn, userRole, user, isApproved, isInitialized } = useAuth();

  console.log("ProtectedRoute - Auth State:", {
    isLoggedIn,
    userRole,
    user,
    requiredRole: role,
    isInitialized,
  });

  // Show loading state while initializing
  if (!isInitialized) {
    console.log(
      "ProtectedRoute: Auth state initializing, showing loading state"
    );
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log("ProtectedRoute: User not logged in, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Check role-based access (case-insensitive comparison)
  if (role && userRole?.toLowerCase() !== role.toLowerCase()) {
    console.log(
      `ProtectedRoute: User role ${userRole} does not match required role ${role}, redirecting to home`
    );
    return <Navigate to="/" replace />;
  }

  // Check if approval is required and user is not approved
  if (requireApproval && userRole === "mentor" && !isApproved) {
    console.log(
      "ProtectedRoute: Mentor not approved, redirecting to pending approval"
    );
    return <Navigate to="/mentor/pending-approval" replace />;
  }

  console.log("ProtectedRoute: Access granted, rendering children");
  return <>{children(user)}</>;
};

function PublicLayout() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicNavbar user={isLoggedIn ? user : undefined} onLogout={logout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If user is not logged in, redirect to home
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Ensure user has the correct role (case-insensitive check)
  if (user.role?.toLowerCase() !== "student") {
    console.log(
      `StudentLayout: User role ${user.role} is not a student, redirecting to home`
    );
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicNavbar user={user} onLogout={logout} />
      <main className="flex-1">
        <Routes>
          <Route
            index
            element={<StudentDashboard user={user} onLogout={logout} />}
          />
          <Route
            path="dashboard"
            element={<StudentDashboard user={user} onLogout={logout} />}
          />
          <Route
            path="profile"
            element={<div>Profile Page - Coming Soon</div>}
          />
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const getDashboardRoute = (role: string | null) => {
  if (!role) return "/";
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "mentor") return "/mentor/dashboard";
  if (normalizedRole === "student") return "/student/dashboard";
  return "/";
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<
    "student" | "mentor" | "admin" | null
  >(null);
  const [user, setUser] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  // Initialize auth state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔄 Initializing authentication state...");
      
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("userRole");
      const storedLoggedIn = localStorage.getItem("isLoggedIn");

      console.log("📄 localStorage data:", {
        hasToken: !!token,
        hasUser: !!storedUser,
        role: storedRole,
        isLoggedIn: storedLoggedIn
      });

      if (!token || !storedUser || !storedRole || storedLoggedIn !== "true") {
        console.log("❌ Incomplete auth data in localStorage, clearing state");
        clearAuthState();
        setIsInitialized(true);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        
        // Set initial state from localStorage
        setIsLoggedIn(true);
        // Normalize role to lowercase for consistency
        const normalizedRole = storedRole.toLowerCase();
        setUserRole(normalizedRole as "student" | "mentor" | "admin");
        setUser(userData);
        
        console.log("✅ Auth state restored from localStorage:", {
          role: storedRole,
          userId: userData.id,
          userName: userData.name
        });
        
        setIsInitialized(true);
        
        // Optionally verify token with backend in the background
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Background verification (don't block UI)
        setTimeout(async () => {
          try {
            const response = await api.get("/auth/me");
            if (!response.data.success) {
              console.log("🔄 Token expired, clearing auth state");
              clearAuthState();
            }
          } catch (error) {
            console.log("⚠️ Background token verification failed:", error.message);
            // Don't clear state immediately on network errors
          }
        }, 1000);
        
      } catch (error) {
        console.error("❌ Error parsing stored user data:", error);
        clearAuthState();
        setIsInitialized(true);
      }
    };

    // Helper function to clear auth state
    const clearAuthState = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      setUser(null);
      setUserRole(null);
    };

    checkAuth();
  }, []);

  // Debug: Log initial authentication state
  useEffect(() => {
    console.log("Initial auth state from localStorage:", {
      isLoggedIn: localStorage.getItem("isLoggedIn"),
      userRole: localStorage.getItem("userRole"),
      user: localStorage.getItem("user"),
    });
  }, []);

  // Sync auth state with localStorage
  useEffect(() => {
    console.log("Syncing auth state to localStorage:", {
      isLoggedIn,
      userRole,
      user,
    });

    // Only update localStorage if we have a valid user and token
    const token = localStorage.getItem("token");
    if (isLoggedIn && user && token) {
      localStorage.setItem("isLoggedIn", "true");
      if (userRole) {
        localStorage.setItem("userRole", userRole);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      // Clear auth state if not logged in or missing required data
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [isLoggedIn, userRole, user]);

  // Enhanced logout function
  const enhancedLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Remove demo login/logout buttons as they're not used in the main flow

  const authContextValue = {
    isLoggedIn,
    userRole,
    user,
    isApproved: user?.isApproved || false,
    isInitialized,
    setIsLoggedIn,
    setUserRole,
    setUser,
    login: (role: "student" | "mentor" | "admin", userData: any) => {
      console.log("Login called with:", { role, userData });

      if (!userData || !userData.token) {
        console.error("Invalid user data or missing token");
        throw new Error("Invalid user data or missing authentication token");
      }

      // Ensure nested objects exist
      const userWithRole = {
        ...userData,
        role,
        isApproved: userData.isApproved || false,
        address: userData.address || {},
        emergencyContact: userData.emergencyContact || {},
        preferredSubjects: userData.preferredSubjects || [],
      };

      // Update state
      setIsLoggedIn(true);
      setUserRole(role);
      setUser(userWithRole);

      // Store in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("token", userData.token);

      // Set up axios defaults for future requests
      if (typeof window !== "undefined") {
        const axios = require("axios");
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData.token}`;
      }

      console.log("Login successful, user authenticated and token stored");
    },
    logout: () => {
      console.log("Logging out user");
      setIsLoggedIn(false);
      setUserRole(null);
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log("User logged out");
    },
  };

  const handleLoginClick = () => {
    // This will be called when the login button is clicked in the Homepage
    // The actual navigation is handled by the Homepage component
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes with PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to={getDashboardRoute(userRole)} replace />
                ) : (
                  <Homepage onLoginClick={handleLoginClick} />
                )
              }
            />
            <Route
              path="/register/student"
              element={
                isLoggedIn ? (
                  <Navigate to="/student" replace />
                ) : (
                  <RegisterStudent />
                )
              }
            />
            <Route
              path="/register/mentor"
              element={
                isLoggedIn ? (
                  <Navigate to="/mentor" replace />
                ) : (
                  <RegisterMentor />
                )
              }
            />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact-sales" element={<ContactSales />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/test-connection" element={<TestConnection />} />
            <Route
              path="/mentor/pending-approval"
              element={
                userRole === "mentor" && !user?.isApproved ? (
                  <PendingApproval />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Error404 />} />
          </Route>

          {/* Protected routes */}
          {/* Mentor Routes */}
          <Route
            path="/mentor/*"
            element={
              <ProtectedRoute role="mentor" requireApproval={true}>
                {(user) => <StudentLayout />}
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard/*"
              element={
                <ProtectedRoute role="mentor" requireApproval={true}>
                  {(user) => (
                    <MentorDashboard user={user} onLogout={enhancedLogout} />
                  )}
                </ProtectedRoute>
              }
            />
            {/* Profile route will be added later when the component is ready */}
          </Route>

          {/* Student Routes - Let StudentDashboard handle its own nested routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute role="student">
                {(user) => (
                  <StudentDashboard user={user} onLogout={enhancedLogout} />
                )}
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="admin">
                {(user) => (
                  <AdminDashboard user={user} onLogout={enhancedLogout} />
                )}
              </ProtectedRoute>
            }
          />

          {/* Other protected routes */}
          <Route
            path="/preferences"
            element={<ProtectedRoute>{() => <Preferences />}</ProtectedRoute>}
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>{() => <NotificationsPage />}</ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export { useAuth };
export default App;
