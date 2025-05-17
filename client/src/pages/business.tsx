import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Camera, Share2, Facebook, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getBusinessById } from "@/lib/firebase";

// פונקציית עזר לקיצור טקסט
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function BusinessPage() {
  const { businessId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sharingMode, setSharingMode] = useState<'facebook' | 'instagram' | 'tiktok' | null>(null);
  const [recommendationText, setRecommendationText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // נסה לטעון את נתוני העסק מהשרת
  useEffect(() => {
    const loadBusiness = async () => {
      if (!businessId) return;
      
      try {
        // נסה לקבל את נתוני העסק מפיירבייס
        const businessData = await getBusinessById(businessId);
        
        if (businessData) {
          setBusiness(businessData);
        } else {
          // מוק לצורך פיתוח
          const mockBusiness = {
            id: businessId,
            name: "מכון היופי של לילך",
            category: "יופי וטיפוח",
            description: "במכון היופי של לילך תוכלי להתפנק בטיפולי יופי מתקדמים. לק ג'ל, טיפולי פנים, מניקור פדיקור וכל הטיפולים המובילים",
            address: "רחוב דיזנגוף 32, תל אביב",
            phone: "08-9237561",
            website: "lilachbeauty@gmail.com",
            email: "lilachbeauty@gmail.com",
            images: [
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400"
            ],
            workingHours: {
              sunday: "9:00-19:00",
              monday: "9:00-19:00",
              tuesday: "9:00-19:00",
              wednesday: "9:00-19:00",
              thursday: "9:00-19:00",
              friday: "9:00-14:00",
              saturday: "סגור"
            }
          };
          
          setBusiness(mockBusiness);
        }
      } catch (error) {
        console.error("Error loading business data:", error);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בטעינת נתוני העסק",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBusiness();
  }, [businessId, toast]);

  // פונקציה לטיפול בהעלאת תמונה
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // קריאת הקובץ והמרתו ל-Data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // פונקציה ליצירת המלצה חדשה ושיתופה ברשת חברתית
  const handleShareRecommendation = async () => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "עליך להתחבר כדי לשתף המלצה",
      });
      setLocation("/login");
      return;
    }
    
    if (!recommendationText.trim() || !uploadedImage) {
      toast({
        title: "חסרים נתונים",
        description: "יש לכתוב המלצה ולהעלות תמונה לפני השיתוף",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // יצירת קישור ייחודי להמלצה זו
      const uniqueShareableLink = `https://${window.location.host}/business/${businessId}?ref=${user.uid}`;
      
      // הודעת הצלחה
      toast({
        title: "המלצה נוצרה בהצלחה",
        description: `ההמלצה שלך ל${business?.name} נוצרה ונשמרה בהצלחה!`
      });
      
      // פתיחת החלונית המתאימה לשיתוף ברשת החברתית שנבחרה
      if (sharingMode === 'facebook') {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(uniqueShareableLink)}&quote=${encodeURIComponent(`${recommendationText} - המלצה על ${business?.name}`)}`;
        window.open(fbShareUrl, '_blank', 'width=600,height=400');
      } else if (sharingMode === 'instagram' || sharingMode === 'tiktok') {
        toast({
          title: `שיתוף ב${sharingMode === 'instagram' ? 'אינסטגרם' : 'טיקטוק'}`,
          description: "המלצה נוצרה. שמור את התמונה ופתח את האפליקציה כדי לשתף אותה עם הקישור."
        });
      }
      
      // סגירת החלונית
      setIsDialogOpen(false);
      
      // איפוס הטופס
      setRecommendationText("");
      setUploadedImage(null);
      setSharingMode(null);
    } catch (error) {
      console.error("שגיאה בשיתוף ההמלצה:", error);
      toast({
        title: "שגיאה בשיתוף",
        description: "אירעה שגיאה בעת שיתוף ההמלצה. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">העסק לא נמצא</h1>
        <p className="mb-6">לא הצלחנו למצוא את העסק המבוקש. ייתכן שהוא אינו קיים או שאין לך גישה אליו.</p>
        <Button onClick={() => setLocation("/")}>חזרה לדף הבית</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 rtl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/5">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <Button variant="outline" size="sm">
                אהבתי
              </Button>
            </div>
            
            <div className="relative h-64 w-full mb-6">
              <img 
                src={business.images?.[0] || "https://placehold.co/600x400?text=No+Image"} 
                alt={business.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">תיאור</h2>
              <p className="text-gray-700 dark:text-gray-300">{business.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
                שיתוף
              </Button>
              <Button variant="outline" className="bg-green-50 text-green-600 border-green-100">
                עריכה
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">פרטי קשר</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 ml-3 text-gray-500" />
                <div>
                  <p className="font-medium">{business.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 ml-3 text-gray-500" />
                <div>
                  <p className="font-medium">{business.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 ml-3 text-gray-500" />
                <div>
                  <p className="font-medium">{business.website || business.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/5">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">שעות פעילות</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">ראשון:</span>
                <span>{business.workingHours?.sunday || "9:00-19:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">שני:</span>
                <span>{business.workingHours?.monday || "9:00-19:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">שלישי:</span>
                <span>{business.workingHours?.tuesday || "9:00-19:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">רביעי:</span>
                <span>{business.workingHours?.wednesday || "9:00-19:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">חמישי:</span>
                <span>{business.workingHours?.thursday || "9:00-19:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">שישי:</span>
                <span>{business.workingHours?.friday || "9:00-14:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">שבת:</span>
                <span>{business.workingHours?.saturday || "סגור"}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">הצע המלצה</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Share2 className="h-4 w-4 ml-2" />
                  צור המלצה חדשה
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rtl">
                <DialogHeader>
                  <DialogTitle>שתף המלצה על {business.name}</DialogTitle>
                  <DialogDescription>
                    צור המלצה אישית ושתף אותה ברשתות החברתיות.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      כתוב את ההמלצה שלך:
                    </label>
                    <Textarea
                      value={recommendationText}
                      onChange={(e) => setRecommendationText(e.target.value)}
                      placeholder="שתף את החוויה שלך ב-140 תווים..."
                      maxLength={140}
                      rows={3}
                    />
                    <p className="text-xs text-right mt-1">
                      {recommendationText.length}/140
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      העלה תמונה:
                    </label>
                    <div className="flex items-center space-x-4">
                      {uploadedImage ? (
                        <div className="relative w-24 h-24">
                          <img 
                            src={uploadedImage} 
                            alt="תמונה שהועלתה" 
                            className="w-full h-full object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => setUploadedImage(null)}
                          >
                            &times;
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className="w-24 h-24 flex flex-col items-center justify-center"
                        >
                          <Camera className="h-8 w-8 mb-1" />
                          <span className="text-xs">העלה תמונה</span>
                          <input 
                            type="file" 
                            id="photo-upload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      בחר רשת חברתית לשיתוף:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={sharingMode === 'facebook' ? 'default' : 'outline'}
                        className={sharingMode === 'facebook' ? 'bg-blue-600' : ''}
                        onClick={() => setSharingMode('facebook')}
                      >
                        <Facebook className="h-4 w-4 ml-2" />
                        פייסבוק
                      </Button>
                      <Button 
                        variant={sharingMode === 'instagram' ? 'default' : 'outline'}
                        className={sharingMode === 'instagram' ? 'bg-pink-600' : ''}
                        onClick={() => setSharingMode('instagram')}
                      >
                        <Instagram className="h-4 w-4 ml-2" />
                        אינסטגרם
                      </Button>
                      <Button 
                        variant={sharingMode === 'tiktok' ? 'default' : 'outline'}
                        className={sharingMode === 'tiktok' ? 'bg-black' : ''}
                        onClick={() => setSharingMode('tiktok')}
                      >
                        <FaTiktok className="h-4 w-4 ml-2" />
                        טיקטוק
                      </Button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    ביטול
                  </Button>
                  <Button
                    onClick={handleShareRecommendation}
                    disabled={!recommendationText.trim() || !uploadedImage || !sharingMode}
                  >
                    שתף המלצה
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}