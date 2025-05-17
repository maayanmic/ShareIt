import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBusinesses, Business } from "@/hooks/use-businesses";
import RecommendationCard from "@/components/recommendation/recommendation-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter } from "lucide-react";

export default function Businesses() {
  const { user } = useAuth();
  const { businesses, isLoading } = useBusinesses();
  const [searchTerm, setSearchTerm] = useState("");

  // כאן נשתמש בבתי העסק האמיתיים אם קיימים, אחרת בנתוני הדוגמה
  const displayBusinesses = businesses && businesses.length > 0 ? businesses : [];

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
              placeholder="חפש עסקים לפי שם או קטגוריה..."
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
          {filteredBusinesses.map((business: Business) => (
            <RecommendationCard
              key={business.id}
              id={business.id}
              businessName={business.name}
              businessImage={business.image}
              description={business.description}
              discount={business.discount}
              rating={business.rating || 4}
              recommenderName={business.recommendedBy || "משתמש"}
              recommenderPhoto={business.recommendedByPhoto || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&auto=format&fit=crop"}
              recommenderId={business.recommendedById || "user1"}
              validUntil={business.validUntil || "30 ביוני"}
              savedCount={business.savedCount || 0}
            />
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