import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Recommendations from "@/pages/recommendations";
import SavedOffers from "@/pages/saved-offers";
import Profile from "@/pages/profile";
import Portfolio from "@/pages/portfolio";
import PortfolioDetail from "@/pages/portfolio-detail";
import BusinessPage from "@/pages/business";
import DesktopNav from "@/components/navigation/desktop-nav";
import MobileNav from "@/components/navigation/mobile-nav";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { QRScannerProvider } from "@/components/qr/qr-scanner-modal";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { handleAuthRedirect } from "@/lib/firebase";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={AuthenticatedRoutes} />
      <Route component={Login} /> {/* משתמשים לא מחוברים מופנים לדף התחברות */}
    </Switch>
  );
}

// רכיב ניתוב עבור משתמשים מחוברים בלבד
function AuthenticatedRoutes() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  // שימוש ב-useEffect להפניית משתמש לא מחובר לדף התחברות
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);
  
  // אם עדיין טוען את מצב המשתמש, נציג מסך טעינה
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // אם המשתמש לא מחובר, הצג תוכן ריק עד להפניה
  if (!user) {
    return null;
  }
  
  // אם המשתמש מחובר, הצג את הנתיבים המאובטחים
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/saved-offers" component={SavedOffers} />
      <Route path="/profile" component={Profile} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio/:id" component={PortfolioDetail} />
      <Route path="/business/:businessId" component={BusinessPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Handle authentication redirects
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        await handleAuthRedirect();
      } catch (error) {
        console.error("Error handling redirect: ", error);
      }
    };
    
    checkRedirectResult();
  }, []);

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
          <DesktopNav />
          <div className="container mx-auto pt-4 md:pt-20 pb-24 md:pb-8 px-4">
            <QRScannerProvider>
              <Router />
            </QRScannerProvider>
          </div>
          <MobileNav />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
