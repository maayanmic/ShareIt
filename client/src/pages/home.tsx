import { useState, useEffect } from "react";
import WelcomeBanner from "@/components/home/welcome-banner";
import RecommendationCard from "@/components/recommendation/recommendation-card";
import CreateRecommendation from "@/components/recommendation/create-recommendation";
import DigitalWallet from "@/components/wallet/digital-wallet";
import { getRecommendations, getBusinessById, getBusinesses } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { UserPlus } from "lucide-react";

export default function Home() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasConnections, setHasConnections] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // בדוק אם יש למשתמש חיבורים
        const userConnections = user.connections || [];
        setHasConnections(userConnections.length > 0);
        
        // טען את ההמלצות מהמערכת
        const data = await getRecommendations(10);
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  // Sample data for when no actual data is available yet
  const sampleRecommendations = [
    {
      id: "rec1",
      businessName: "Coffee Workshop",
      businessImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
      description: "Best specialty coffee in town, friendly staff and amazing pastries! Must try their cold brew.",
      discount: "10% OFF",
      rating: 4,
      recommenderName: "Alex Miller",
      recommenderPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40",
      recommenderId: "user1",
      validUntil: "Jun 30",
      savedCount: 23,
    },
    {
      id: "rec2",
      businessName: "Urban Attire",
      businessImage: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
      description: "Amazing selection of sustainable fashion. The staff helped me find the perfect outfit for my interview!",
      discount: "15% OFF",
      rating: 5,
      recommenderName: "Jessica Lee",
      recommenderPhoto: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40",
      recommenderId: "user2",
      validUntil: "Jul 15",
      savedCount: 42,
    },
    {
      id: "rec3",
      businessName: "Fresh & Local",
      businessImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400",
      description: "Farm-to-table restaurant with seasonal menu. Their honey glazed salmon is a must-try. Great for date nights!",
      discount: "20% OFF",
      rating: 5,
      recommenderName: "Michael Chen",
      recommenderPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40",
      recommenderId: "user3",
      validUntil: "Aug 1",
      savedCount: 17,
    },
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : sampleRecommendations;

  return (
    <div className="flex flex-col space-y-6">
      <WelcomeBanner />
      

      
      {/* Your Feed Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-right">המלצות של חבריך</h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        ) : !hasConnections ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">צור חיבורים חדשים</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              עדיין אין לך חיבורים עם משתמשים אחרים. צור חיבורים על מנת לראות המלצות של אחרים ולדרג אותם!
            </p>
            <Button asChild>
              <Link href="/users">
                <UserPlus className="ml-2 h-5 w-5" />
                חיפוש משתמשים
              </Link>
            </Button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">אין המלצות להצגה</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              נראה שהחברים שלך עדיין לא פרסמו המלצות. רוצה להיות הראשון?
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <Button asChild>
                <Link href="/businesses">
                  צפייה בעסקים
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                id={recommendation.id}
                businessName={recommendation.businessName}
                businessImage={recommendation.businessImage}
                description={recommendation.description}
                discount={recommendation.discount}
                rating={recommendation.rating}
                recommenderName={recommendation.recommenderName}
                recommenderPhoto={recommendation.recommenderPhoto || "https://avatars.dicebear.com/api/initials/" + recommendation.recommenderName + ".svg"}
                recommenderId={recommendation.recommenderId || recommendation.userId}
                validUntil={recommendation.validUntil}
                savedCount={recommendation.savedCount}
              />
            ))}
          </div>
        )}
      </div>
      

      
      <DigitalWallet />
    </div>
  );
}
