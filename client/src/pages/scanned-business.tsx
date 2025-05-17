import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { getBusinessById } from "@/lib/firebase";
import { CreateRecommendationForm } from "@/components/share/CreateRecommendationForm";
import { SocialSharePanel } from "@/components/share/SocialSharePanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

enum RecommendationStep {
  CREATE = "create",
  SHARE = "share",
  COMPLETE = "complete",
}

export default function ScannedBusiness() {
  const { businessId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<RecommendationStep>(RecommendationStep.CREATE);
  const [businessData, setBusinessData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<{
    id: string;
    text: string;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    async function loadBusinessData() {
      if (!businessId) {
        navigate("/");
        return;
      }

      try {
        const business = await getBusinessById(businessId);
        if (!business) {
          toast({
            title: "עסק לא נמצא",
            description: "לא ניתן למצוא את העסק המבוקש",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setBusinessData(business);
      } catch (error) {
        console.error("שגיאה בטעינת נתוני העסק:", error);
        toast({
          title: "שגיאה בטעינת נתוני העסק",
          description: "אנא נסה שוב מאוחר יותר",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthenticated) {
      // אם המשתמש לא מחובר, נשמור את המיקום הנוכחי ונעביר אותו למסך ההתחברות
      // אחרי ההתחברות נחזיר אותו לכאן
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר כדי לשתף המלצות",
      });
      navigate(`/auth?redirect=/business/${businessId}/scan`);
      return;
    }

    loadBusinessData();
  }, [businessId, navigate, toast, isAuthenticated]);

  // פונקציה לטיפול בסיום צעד יצירת ההמלצה
  const handleRecommendationCreate = (recommendationId: string, text: string, imageUrl: string) => {
    setRecommendation({
      id: recommendationId,
      text,
      imageUrl,
    });
    setCurrentStep(RecommendationStep.SHARE);
  };

  // פונקציה לטיפול בסיום צעד השיתוף
  const handleShareComplete = () => {
    setCurrentStep(RecommendationStep.COMPLETE);
  };

  // פונקציה לחזרה לצעד הקודם
  const handleBack = () => {
    if (currentStep === RecommendationStep.SHARE) {
      setCurrentStep(RecommendationStep.CREATE);
    } else {
      navigate("/");
    }
  };

  // פונקציה לחזרה לדף הבית
  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mb-8"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  // מסך השלמת התהליך
  if (currentStep === RecommendationStep.COMPLETE) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 max-w-md mx-auto">
          <div className="mb-4">
            <svg
              className="h-16 w-16 text-green-500 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">תודה על השיתוף!</h2>
            <p className="text-gray-600 mb-6">
              ההמלצה שלך פורסמה בהצלחה. אתה מוזמן לקרוא המלצות נוספות או לשתף המלצות על עסקים נוספים.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={handleGoHome} className="w-full">
              חזרה לדף הבית
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/recommendations")}
              className="w-full"
            >
              צפייה בהמלצות
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="ghost" onClick={handleBack} className="p-0">
          <ArrowLeft className="h-4 w-4 ml-1" />
          חזרה
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 max-w-md mx-auto">
        {/* לוגו האתר */}
        <div className="flex justify-center mb-4">
          <img 
            src="/images/Logo3.png" 
            alt="ShareIt" 
            className="h-12 mb-4" 
          />
        </div>

        {/* תצוגת שלב נוכחי */}
        {currentStep === RecommendationStep.CREATE && businessData && (
          <CreateRecommendationForm
            businessId={businessId || ""}
            businessName={businessData.name}
            onComplete={handleRecommendationCreate}
            onBack={handleBack}
          />
        )}

        {currentStep === RecommendationStep.SHARE && recommendation && businessData && (
          <SocialSharePanel
            businessName={businessData.name}
            recommendationText={recommendation.text}
            imageUrl={recommendation.imageUrl}
            recommendationId={recommendation.id}
            onBack={handleBack}
            onComplete={handleShareComplete}
          />
        )}
      </div>
    </div>
  );
}