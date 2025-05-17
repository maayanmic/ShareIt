import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { shareToFacebook, shareToTwitter, shareToInstagram } from "@/lib/socialShare";

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
  
  // יצירת URL לשיתוף עם מזהה ייחודי של היוצר
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    // הוספת מזהה המשתמש היוצר כפרמטר לקישור
    return `${baseUrl}/recommendation/${recommendationId}?referrer=${user?.uid || ""}`;
  };
  
  // פונקציה לטיפול בשיתוף בפייסבוק
  const handleFacebookShare = async () => {
    setIsSharing(true);
    
    try {
      const shareText = `המלצה על ${businessName}: ${recommendationText}`;
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
  
  // פונקציה לטיפול בשיתוף באינסטגרם
  const handleInstagramShare = async () => {
    setIsSharing(true);
    
    try {
      if (!imageUrl) {
        throw new Error("נדרשת תמונה לשיתוף באינסטגרם");
      }
      
      await shareToInstagram(imageUrl, `המלצה על ${businessName}: ${recommendationText}`);
      
      toast({
        title: "הועבר לאינסטגרם",
        description: "הועברת לאפליקציית אינסטגרם",
      });
    } catch (error) {
      console.error("שגיאה בשיתוף לאינסטגרם:", error);
      toast({
        title: "שגיאה בשיתוף",
        description: "לא ניתן לשתף ישירות לאינסטגרם דרך הדפדפן. נסה להעתיק את הקישור ולשתף ידנית.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  // פונקציה לטיפול בשיתוף בטוויטר
  const handleTwitterShare = async () => {
    setIsSharing(true);
    
    try {
      const shareText = `המלצה על ${businessName}: ${recommendationText}`;
      await shareToTwitter(shareText, getShareUrl(), ["ShareIt", "המלצה"]);
      
      toast({
        title: "נפתח בטוויטר",
        description: "הקישור להמלצה נפתח בטוויטר",
      });
    } catch (error) {
      console.error("שגיאה בשיתוף לטוויטר:", error);
      toast({
        title: "שגיאה בשיתוף",
        description: "לא הצלחנו לשתף את ההמלצה בטוויטר. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="mb-2">
        <Share2 className="h-12 w-12 text-primary-500 mx-auto" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">שיתוף ברשתות</h2>
      <p className="text-gray-600 mb-6">שתף את ההמלצה ברשתות החברתיות</p>
      
      <div className="w-full space-y-3 mb-6">
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
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          &larr; המשך
        </Button>
        <Button
          onClick={onComplete}
          disabled={isSharing}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          חזור &rarr;
        </Button>
      </div>
    </div>
  );
}