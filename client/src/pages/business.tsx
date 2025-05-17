import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Camera, Share2, Facebook, Instagram } from "lucide-react";
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
          // אם לא נמצא עסק, מציג נתוני דמו לצורכי פיתוח
          // במערכת אמיתית, זה יציג הודעת שגיאה
          const mockBusiness = {
            id: businessId,
            name: businessId === "coffee" ? "קפה טוב" : 
                 businessId === "attire" ? "חנות בגדים" : 
                 businessId === "restaurant" ? "מסעדה טעימה" : "עסק כלשהו",
            description: "תיאור העסק יופיע כאן. זה המקום בו העסק יכול לספר על עצמו, על השירותים שהוא מציע, ועוד מידע רלוונטי.",
            address: "רחוב הרצל 123, תל אביב",
            category: businessId === "coffee" ? "בתי קפה" : 
                      businessId === "attire" ? "אופנה" : 
                      businessId === "restaurant" ? "מסעדות" : "עסקים",
            phone: "03-1234567",
            website: "https://example.com",
            images: [
              "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1573706518886-fed668711750?q=80&w=1000&auto=format&fit=crop"
            ],
            discount: "10% הנחה על הקנייה הראשונה",
            reviews: [
              {
                id: "1",
                userId: "user123",
                userName: "ישראל ישראלי",
                rating: 5,
                text: "שירות מעולה! ממליץ בחום.",
                date: "2023-11-15",
                recommended: true
              }
            ]
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
      const uniqueShareableLink = generateUniqueLink(businessId as string, user.uid);
      
      // שמירת ההמלצה במערכת (Firestore)
      // במימוש אמיתי, יש לשמור את נתוני ההמלצה בפיירבייס
      
      // הודעת הצלחה
      toast({
        title: "המלצה נוצרה בהצלחה",
        description: `ההמלצה שלך ל${business?.name} נוצרה ונשמרה בהצלחה!`
      });
      
      // פתיחת החלונית המתאימה לשיתוף ברשת החברתית שנבחרה
      shareToSocialMedia(sharingMode, {
        businessName: business?.name,
        text: recommendationText,
        image: uploadedImage,
        link: uniqueShareableLink
      });
      
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
  
  // פונקציה ליצירת קישור ייחודי להמלצה
  const generateUniqueLink = (businessId: string, userId: string) => {
    // במימוש אמיתי, יש ליצור מזהה ייחודי עבור ההמלצה
    const uniqueId = Math.random().toString(36).substring(2, 10);
    return `https://${window.location.host}/recommendation/${businessId}/${uniqueId}?ref=${userId}`;
  };
  
  // פונקציה לשיתוף ברשת חברתית
  const shareToSocialMedia = (
    platform: 'facebook' | 'instagram' | 'tiktok' | null,
    data: { businessName: string, text: string, image: string, link: string }
  ) => {
    if (!platform) return;
    
    const { businessName, text, link } = data;
    
    switch (platform) {
      case 'facebook':
        // שיתוף בפייסבוק
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(`${text} - המלצה על ${businessName}`)}`;
        window.open(fbShareUrl, '_blank', 'width=600,height=400');
        break;
        
      case 'instagram':
        // עבור אינסטגרם, שיטת השיתוף שונה ולרוב דורשת אפליקציית לקוח
        toast({
          title: "שיתוף באינסטגרם",
          description: "המלצה נוצרה. שמור את התמונה ופתח את אפליקציית אינסטגרם כדי לשתף אותה עם הקישור."
        });
        
        // פתח חלון להורדת התמונה
        const instagramImage = document.createElement('a');
        instagramImage.href = data.image;
        instagramImage.download = `המלצה ל${businessName}.jpg`;
        instagramImage.click();
        break;
        
      case 'tiktok':
        // TikTok בדרך כלל דורש את האפליקציה עצמה
        toast({
          title: "שיתוף בטיקטוק",
          description: "המלצה נוצרה. שמור את התמונה ופתח את אפליקציית טיקטוק כדי לשתף אותה עם הקישור."
        });
        
        // פתח חלון להורדת התמונה
        const tiktokImage = document.createElement('a');
        tiktokImage.href = data.image;
        tiktokImage.download = `המלצה ל${businessName}.jpg`;
        tiktokImage.click();
        break;
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
      <Card>
        <CardContent className="p-0">
          {/* תמונת כותרת של העסק */}
          <div className="relative h-64 w-full">
            <img 
              src={business.images?.[0] || "https://placehold.co/600x400?text=No+Image"} 
              alt={business.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <p className="text-sm opacity-80">{business.category}</p>
              </div>
            </div>
          </div>
          
          {/* כפתור שיתוף המלצה */}
          <div className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">פרטי העסק</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{business.address}</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500">
                  <Share2 className="h-4 w-4 ml-2" />
                  שתף המלצה
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rtl">
                <DialogHeader>
                  <DialogTitle>שתף המלצה על {business.name}</DialogTitle>
                  <DialogDescription>
                    צור המלצה אישית ושתף אותה ברשתות החברתיות.
                    לאחר סריקת קוד ה-QR במקום, באפשרותך ליצור המלצה אישית.
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
          
          {/* מידע על העסק */}
          <div className="px-6 pb-6">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">פרטים</TabsTrigger>
                <TabsTrigger value="reviews">המלצות</TabsTrigger>
                <TabsTrigger value="deals">הטבות</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                <div className="space-y-4">
                  <p>{business.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {business.phone && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">טלפון</h3>
                        <p>{business.phone}</p>
                      </div>
                    )}
                    
                    {business.website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">אתר</h3>
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:underline"
                        >
                          {business.website}
                        </a>
                      </div>
                    )}
                    
                    {business.hours && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">שעות פתיחה</h3>
                        <p>{business.hours}</p>
                      </div>
                    )}
                  </div>
                  
                  {business.images && business.images.length > 1 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">גלריית תמונות</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {business.images.map((image: string, index: number) => (
                          <img 
                            key={index} 
                            src={image} 
                            alt={`${business.name} - תמונה ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                {business.reviews && business.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {business.reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{review.userName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.date).toLocaleDateString('he-IL')}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2">{review.text}</p>
                        {review.recommended && (
                          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            מומלץ!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">אין המלצות כרגע</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      היה ראשון להמליץ
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="deals" className="mt-4">
                {business.discount ? (
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
                    <h3 className="text-lg font-medium text-primary-700 dark:text-primary-300">הטבה מיוחדת</h3>
                    <p className="text-primary-600 dark:text-primary-400 text-2xl font-bold my-2">{business.discount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      שתף המלצה כדי לקבל את ההטבה
                    </p>
                    <Button 
                      className="mt-4 w-full"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      שתף כדי לקבל הטבה
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">אין הטבות זמינות כרגע</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}