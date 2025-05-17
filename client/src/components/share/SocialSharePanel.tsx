import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const [isSharing, setIsSharing] = useState(false);
  
  // יצירת URL לשיתוף
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/recommendation/${recommendationId}`;
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
          className="w-full bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center" 
          onClick={handleFacebookShare}
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4 ml-2" />
          שתף בפייסבוק
        </Button>
        
        <Button 
          className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 flex items-center justify-center" 
          onClick={handleInstagramShare}
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4 ml-2" />
          שתף באינסטגרם
        </Button>
        
        <Button 
          className="w-full bg-[#1DA1F2] hover:bg-[#1A94DA] flex items-center justify-center" 
          onClick={handleTwitterShare}
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4 ml-2" />
          שתף בטוויטר
        </Button>
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