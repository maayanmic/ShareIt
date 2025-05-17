import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { shareToFacebook } from "@/lib/socialShare";

interface SocialSharePanelProps {
  businessName: string;
  recommendationText: string;
  imageUrl?: string;
  recommendationId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function SocialSharePanel({
  businessName,
  recommendationText,
  imageUrl,
  recommendationId,
  onBack,
  onComplete
}: SocialSharePanelProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  
  // יצירת URL לשיתוף עם מזהה ייחודי של ההמלצה
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    // יצירת קישור ישיר להמלצה
    return `${baseUrl}/recommendation/${recommendationId}`;
  };
  
  // פונקציה לטיפול בשיתוף בפייסבוק - זה כפתור שעובד באמת
  const handleFacebookShare = async () => {
    setIsSharing(true);
    
    try {
      const shareText = `המלצה על ${businessName}: ${recommendationText}`;
      
      console.log("מנסה לשתף בפייסבוק עם התמונה:", imageUrl);
      
      // קריאה אמיתית לפייסבוק - זה צריך לעבוד באמת
      await shareToFacebook(getShareUrl(), shareText, imageUrl);
      
      toast({
        title: "נשלח בהצלחה",
        description: "ההמלצה שותפה בפייסבוק בהצלחה!",
      });
      
      // קריאה לפונקציה להמשך התהליך
      onComplete();
    } catch (error) {
      console.error("שגיאה בשיתוף:", error);
      toast({
        title: "שגיאה בשיתוף",
        description: "לא הצלחנו לשתף את ההמלצה בפייסבוק. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  // הערה: כפתורי אינסטגרם וטיקטוק הם ויזואליים בלבד בגרסה זו
  
  return (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="mb-2">
        <Share2 className="h-12 w-12 text-primary-500 mx-auto" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">שיתוף ברשתות</h2>
      <p className="text-gray-600 mb-6">שתף את ההמלצה ברשתות החברתיות</p>
      
      <div className="w-full space-y-3 mb-6">
        {/* הצגת הקישור הייחודי להמלצה */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <p className="text-sm font-semibold mb-2">הקישור הייחודי להמלצה שלך:</p>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md p-2">
            <div className="truncate text-sm text-gray-600 text-left" dir="ltr">
              {getShareUrl()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => {
                navigator.clipboard.writeText(getShareUrl());
                toast({
                  title: "הקישור הועתק",
                  description: "הקישור הועתק ללוח. כעת תוכל להדביק אותו בכל מקום.",
                });
              }}
            >
              העתק
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            הקישור הזה ייחודי להמלצה שהעלית לפלטפורמה ויוביל ישירות אליה
          </p>
        </div>

        {/* כפתורי השיתוף */}
        <Button 
          className="w-full bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center py-6 text-lg" 
          onClick={handleFacebookShare}
          disabled={isSharing}
        >
          <svg className="h-5 w-5 ml-2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
          </svg>
          שתף בפייסבוק
        </Button>
        
        <div className="group relative">
          <Button 
            className="w-full bg-gray-400 hover:bg-gray-400 flex items-center justify-center py-6 text-lg cursor-not-allowed opacity-70" 
            disabled={true}
          >
            <svg className="h-5 w-5 ml-2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
            שתף באינסטגרם
          </Button>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            יהיה זמין בגרסה הבאה
          </div>
        </div>
        
        <div className="group relative">
          <Button 
            className="w-full bg-gray-400 hover:bg-gray-400 flex items-center justify-center py-6 text-lg cursor-not-allowed opacity-70" 
            disabled={true}
          >
            <svg className="h-5 w-5 ml-2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
            שתף בטיקטוק
          </Button>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            יהיה זמין בגרסה הבאה
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          השיתוף יכלול את התמונה והטקסט שהעלית, וכן קישור ייחודי להמלצה שלך.
          כל מי שילחץ על הקישור יוכל לראות את ההמלצה ולשמור אותה.
        </div>
      </div>
      
      <div className="flex justify-between w-full mt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSharing}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          חזור
        </Button>
        <Button
          onClick={onComplete}
          disabled={isSharing}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          סיום
        </Button>
      </div>
    </div>
  );
}