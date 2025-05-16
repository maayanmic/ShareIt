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
import DesktopNav from "@/components/navigation/desktop-nav";
import MobileNav from "@/components/navigation/mobile-nav";
import { AuthProvider } from "@/hooks/use-auth";
import { QRScannerProvider } from "@/components/qr/qr-scanner-modal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/saved-offers" component={SavedOffers} />
      <Route path="/profile" component={Profile} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio/:id" component={PortfolioDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
