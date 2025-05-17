import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

interface PhotoUploadFormProps {
  businessId: string;
  businessName: string;
  onComplete: (recommendationText: string, imageUrl: string) => void;
  onBack: () => void;
}

export default function PhotoUploadForm({
  businessId,
  businessName,
  onComplete,
  onBack
}: PhotoUploadFormProps) {
  const [recommendationText, setRecommendationText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // טיפול בבחירת תמונה
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // בדיקה שזה קובץ תמונה תקין
    if (!file.type.match("image.*")) {
      toast({
        title: "קובץ לא תקין",
        description: "אנא בחר קובץ תמונה בלבד (jpg, png, gif)",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    
    // יצירת URL לתצוגה מקדימה של התמונה
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // פתיחת חלון בחירת תמונה
  const handleChooseImageClick = () => {
    fileInputRef.current?.click();
  };

  // שליחת הטופס
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר למערכת כדי לשתף המלצות",
        variant: "destructive",
      });
      return;
    }

    if (!recommendationText.trim()) {
      toast({
        title: "שדה חובה",
        description: "אנא כתוב את ההמלצה שלך",
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "תמונה חסרה",
        description: "אנא בחר תמונה להמלצה",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // העלאת התמונה לשרת
      const imagePath = `recommendations/${user.uid}_${Date.now()}`;
      const imageUrl = await uploadImage(selectedImage, imagePath);

      // קריאה לפונקציה להמשך התהליך
      onComplete(recommendationText, imageUrl);
      
    } catch (error) {
      console.error("שגיאה בהעלאת התמונה:", error);
      toast({
        title: "שגיאה בהעלאת התמונה",
        description: "אירעה שגיאה בהעלאת התמונה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-4">
        <Camera className="h-10 w-10 text-primary-500 mx-auto" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">צילום והמלצה</h2>
      <p className="text-gray-600 mb-6">צלם תמונה והוסף המלצה על החוויה שלך</p>
      
      <div className="w-full mb-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        
        {imagePreviewUrl ? (
          <div className="relative mb-4">
            <img 
              src={imagePreviewUrl} 
              alt="תצוגה מקדימה" 
              className="w-full h-52 object-cover rounded-md border border-gray-200"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2 bg-white shadow-md"
              onClick={handleChooseImageClick}
            >
              <Camera className="h-4 w-4 ml-1" />
              החלף תמונה
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleChooseImageClick}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Camera className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-500">לחץ להעלאת תמונה</p>
          </div>
        )}
      </div>
      
      <div className="w-full mb-6">
        <Textarea
          placeholder="כתוב את ההמלצה שלך כאן..."
          className="resize-none h-32 text-right"
          value={recommendationText}
          onChange={(e) => setRecommendationText(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between w-full mt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          חזור
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !recommendationText.trim() || !selectedImage}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          {isSubmitting ? "שומר..." : "המשך"}
        </Button>
      </div>
    </div>
  );
}