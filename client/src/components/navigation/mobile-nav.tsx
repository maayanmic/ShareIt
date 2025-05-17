import { Link, useLocation } from "wouter";
import { useQRScanner } from "@/components/qr/qr-scanner-modal";
import { Home, Search, Bookmark, Briefcase } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const { openScanner } = useQRScanner();

  // פונקציה להפעלת סורק ה-QR
  const handleScanClick = () => {
    // פותח את סורק ה-QR ללא קולבק ספציפי
    // הסורק יטפל אוטומטית בניתוב לאחר סריקה מוצלחת
    openScanner();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30 p-2">
      <div className="grid grid-cols-5 gap-1">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center py-1 ${location === "/" ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">בית</span>
          </div>
        </Link>
        
        <Link href="/businesses">
          <div className={`flex flex-col items-center justify-center py-1 ${location === "/businesses" ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}`}>
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">בתי עסק</span>
          </div>
        </Link>
        
        <button 
          className="flex flex-col items-center justify-center bg-primary-500 rounded-full h-14 w-14 mx-auto -mt-5 text-white shadow-lg"
          onClick={handleScanClick}
          type="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
            />
          </svg>
          <span className="text-xs mt-1">סריקה</span>
        </button>
        
        <Link href="/saved-offers">
          <div className={`flex flex-col items-center justify-center py-1 ${location === "/saved-offers" ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}`}>
            <Bookmark className="h-6 w-6" />
            <span className="text-xs mt-1">שמורים</span>
          </div>
        </Link>

        <Link href="/profile">
          <div className={`flex flex-col items-center justify-center py-1 ${location === "/profile" ? "text-primary-500" : "text-gray-500 dark:text-gray-400"}`}>
            <Briefcase className="h-6 w-6" />
            <span className="text-xs mt-1">הפרופיל שלי</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
