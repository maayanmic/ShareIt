import { useState, useEffect } from "react";
import WelcomeBanner from "@/components/home/welcome-banner";
import RecommendationCard from "@/components/recommendation/recommendation-card";
import CreateRecommendation from "@/components/recommendation/create-recommendation";
import DigitalWallet from "@/components/wallet/digital-wallet";
import { getRecommendations, getBusinessById, getBusinesses } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');

  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations(10);
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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

  const filteredRecommendations = 
    filter === 'popular' 
      ? [...displayRecommendations].sort((a, b) => b.savedCount - a.savedCount)
      : displayRecommendations;

  return (
    <div className="flex flex-col space-y-6">
      <WelcomeBanner />
      

      
      {/* Your Feed Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">המלצות עבורך</h2>
          <div className="flex space-x-2">
            <Button
              variant={filter === 'recent' ? 'default' : 'outline'} 
              size="sm"
              className={filter === 'recent' ? 'bg-primary-500' : ''}
              onClick={() => setFilter('recent')}
            >
              חדשים
            </Button>
            <Button
              variant={filter === 'popular' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'popular' ? 'bg-primary-500' : ''}
              onClick={() => setFilter('popular')}
            >
              פופולריים
            </Button>
          </div>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((recommendation) => (
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
      
      <CreateRecommendation />
      
      <DigitalWallet />
    </div>
  );
}
