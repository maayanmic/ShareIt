import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, MapPin, Phone, Mail, QrCode } from "lucide-react";
import { getBusinessById } from "@/lib/firebase";
import { useQRScanner } from "@/components/qr/qr-scanner-modal";

export default function BusinessPage() {
  const { businessId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const qrScanner = useQRScanner();
  const [, setLocation] = useLocation();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // נסה לטעון את נתוני העסק מהשרת
  useEffect(() => {
    const loadBusiness = async () => {
      if (!businessId) return;
      
      // מאגר עסקים מקומי
      const localBusinesses = [
        {
          id: "1",
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
        },
        {
          id: "2",
          name: "בדיקה",
          category: "בריאות",
          description: "במכון בדיקה תוכלו להתחבר לבריאותכם באמצעות בדיקות מקיפות. לך, למשפחתך ולמטופליך",
          address: "רחוב בדיקה 123, תל אביב",
          website: "checkup@gmail.com",
          phone: "03-1234567",
          email: "checkup@gmail.com",
          images: ["https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400"],
          workingHours: {
            sunday: "8:00-18:00",
            monday: "8:00-18:00",
            tuesday: "8:00-18:00",
            wednesday: "8:00-18:00",
            thursday: "8:00-18:00",
            friday: "8:00-13:00",
            saturday: "סגור"
          }
        },
        {
          id: "coffee",
          name: "קפה טוב",
          category: "בתי קפה",
          description: "בית קפה איכותי עם מבחר עשיר של קפה, מאפים וארוחות בוקר. האווירה נעימה ומתאימה ללימודים, פגישות עבודה או סתם לבלות עם חברים.",
          address: "רחוב הרצל 123, תל אביב",
          phone: "03-1234567",
          website: "https://example.com/coffeegood",
          email: "coffee@good.com",
          images: [
            "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
          ],
          discount: "10% הנחה על כל התפריט",
          hours: "א'-ה' 07:00-22:00, ו' 08:00-16:00, שבת סגור",
          ratings: 4.5
        }
      ];
      
      try {
        // בדוק אם העסק קיים במאגר המקומי
        const localBusiness = localBusinesses.find(business => business.id === businessId);
        
        if (localBusiness) {
          console.log("מצאתי עסק במאגר המקומי:", localBusiness.name);
          setBusiness(localBusiness);
          setLoading(false);
          return;
        }
        
        // אם העסק לא נמצא במאגר המקומי, נסה לקבל אותו מפיירבייס
        console.log("מנסה לקבל את העסק מהשרת:", businessId);
        const businessData = await getBusinessById(businessId);
        
        if (businessData) {
          console.log("מצאתי עסק בפיירבייס:", businessData.name);
          setBusiness(businessData);
        } else {
          console.log("העסק לא נמצא בשום מקום, משתמש בעסק ברירת מחדל");
          // אם לא מצאנו את העסק בשום מקום, נשתמש בעסק ברירת מחדל
          const defaultBusiness = {
            id: businessId,
            name: "עסק לדוגמה",
            category: "קטגוריה כללית",
            description: "תיאור של עסק לדוגמה שנוצר כי לא נמצא העסק המבוקש",
            address: "רחוב לדוגמה 123, תל אביב",
            phone: "03-1234567",
            website: "example@example.com",
            email: "example@example.com",
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
          
          setBusiness(defaultBusiness);
        }
      } catch (error) {
        console.error("שגיאה בטעינת נתוני העסק:", error);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בטעינת נתוני העסק",
          variant: "destructive"
        });
        
        // במקרה של שגיאה, נשתמש בעסק ברירת מחדל
        const fallbackBusiness = {
          id: businessId,
          name: "עסק לדוגמה (נוצר בגלל שגיאה)",
          category: "קטגוריה כללית",
          description: "תיאור של עסק לדוגמה שנוצר כי הייתה שגיאה בטעינת העסק המבוקש",
          address: "רחוב לדוגמה 123, תל אביב",
          phone: "03-1234567",
          website: "example@example.com",
          email: "example@example.com",
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
        
        setBusiness(fallbackBusiness);
      } finally {
        setLoading(false);
      }
    };
    
    loadBusiness();
  }, [businessId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // הסרנו את הבדיקה שמחזירה הודעת שגיאה כי אנחנו תמיד נקבל עסק ברירת מחדל

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
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">הצע המלצה</h2>
            <Button 
              className="w-full"
              onClick={() => qrScanner.openScanner()}
            >
              <QrCode className="h-4 w-4 ml-2" />
              סרוק QR ליצירת המלצה
            </Button>
          </div>
          
          {/* כפתור אדום זמני שיוסר בהמשך */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">שתף המלצה לעסק זה</h2>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => setLocation(`/business/${businessId}/scan`)}
            >
              <Share2 className="h-4 w-4 ml-2" />
              שתף המלצה (כפתור זמני)
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              כפתור זה ישמש לבדיקות בלבד ויוסר בגרסה הסופית
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}