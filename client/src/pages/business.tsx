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