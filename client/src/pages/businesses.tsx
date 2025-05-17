import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBusinesses, Business } from "@/hooks/use-businesses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, MapPinIcon, PhoneIcon, Mail } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

// דוגמאות עסקים עם פרטים מורחבים לפי הדוגמה
const sampleBusinesses = [
  {
    id: "1",
    name: "מכון היופי של לילך",
    category: "יופי וטיפוח",
    description: "במכון היופי של לילך תוכלי להתפנק בטיפולי יופי מתקדמים. לק ג'ל, טיפולי פנים, מניקור פדיקור וכל הטיפולים המובילים",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    address: "רחוב דיזנגוף 32, תל אביב",
    website: "lilachbeauty@gmail.com",
    phone: "08-9237561",
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
    image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
    address: "רחוב בדיקה 123, תל אביב",
    website: "checkup@gmail.com",
    phone: "03-1234567",
    workingHours: {
      sunday: "8:00-18:00",
      monday: "8:00-18:00",
      tuesday: "8:00-18:00",
      wednesday: "8:00-18:00",
      thursday: "8:00-18:00",
      friday: "8:00-13:00",
      saturday: "סגור"
    }
  }
];

// רכיב תצוגת בית עסק
function BusinessCard({ business }: { business: any }) {
  // אם יש תמונות במערך, ניקח את הראשונה, אחרת ניקח את שדה image אם קיים
  const imageUrl = business.images?.[0] || business.image || "https://via.placeholder.com/400x200?text=No+Image";
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold">{business.name}</h3>
            <p className="text-sm text-gray-500">{business.category}</p>
          </div>
          <Link href={`/business/${business.id}`}>
            <Button variant="outline" size="sm">אהבתי</Button>
          </Link>
        </div>
        
        <p className="text-sm mb-4 line-clamp-3">{business.description}</p>
        
        <div className="space-y-2 text-sm">
          {business.address && (
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 ml-2 text-gray-500" />
              <span>{business.address}</span>
            </div>
          )}
          
          {business.phone && (
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 ml-2 text-gray-500" />
              <span>{business.phone}</span>
            </div>
          )}
          
          {business.website && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 ml-2 text-gray-500" />
              <span>{business.website}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <Link href={`/business/${business.id}`}>
            <Button variant="default">
              צפייה בפרטים
            </Button>
          </Link>
          <Link href={`/business/${business.id}`}>
            <Button variant="outline">
              שיתוף
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Businesses() {
  const { user } = useAuth();
  const { businesses, isLoading } = useBusinesses();
  const [searchTerm, setSearchTerm] = useState("");

  // כאן נשתמש בבתי העסק האמיתיים אם קיימים, אחרת בנתוני הדוגמה
  const displayBusinesses = businesses && businesses.length > 0 ? businesses : sampleBusinesses;

  const filteredBusinesses = searchTerm 
    ? displayBusinesses.filter(business => 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (business.category && business.category.toLowerCase().includes(searchTerm.toLowerCase()))
      ) 
    : displayBusinesses;

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4">בתי עסק</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="חפש עסק לפי שם, תיאור, כתובת או קטגוריה..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="md:w-auto">
            <MapPin className="h-4 w-4 ml-2" />
            <span>קרוב אלי</span>
          </Button>
          <Button variant="outline" className="md:w-auto">
            <Filter className="h-4 w-4 ml-2" />
            <span>סינון</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-96 animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="w-2/3 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex justify-between mb-4">
                <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-1/4 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business: any) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">לא נמצאו בתי עסק</h2>
          <p className="text-gray-500 dark:text-gray-400">
            נסה לשנות את מונחי החיפוש או בדוק שוב מאוחר יותר לקבלת עסקים נוספים.
          </p>
        </div>
      )}
    </div>
  );
}