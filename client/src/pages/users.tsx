import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUsers, createConnection, getUserRating } from "@/lib/firebase-update";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, UserPlus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const usersData = await getUsers();
        
        // פילטור הרשימה כך שלא תכלול את המשתמש הנוכחי
        const filteredUsers = usersData.filter(u => u.id !== user?.uid);
        
        // העשרת נתוני המשתמשים עם מידע נוסף
        const enrichedUsers = await Promise.all(filteredUsers.map(async (u) => {
          const rating = await getUserRating(u.id);
          return {
            ...u,
            rating,
            isConnected: user?.connections?.includes(u.id) || false
          };
        }));
        
        setUsers(enrichedUsers);
      } catch (error) {
        console.error("שגיאה בטעינת רשימת המשתמשים:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleConnect = async (userId: string) => {
    if (!user) return;
    
    try {
      setConnectingTo(userId);
      await createConnection(user.uid, userId);
      
      // עדכון מקומי של רשימת המשתמשים
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === userId ? { ...u, isConnected: true } : u
      ));
      
      toast({
        title: "נוצר חיבור בהצלחה",
        description: "כעת תראה את ההמלצות של משתמש זה",
        variant: "default",
      });
    } catch (error) {
      console.error("שגיאה ביצירת חיבור:", error);
      toast({
        title: "שגיאה ביצירת חיבור",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setConnectingTo(null);
    }
  };

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">משתמשים</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="flex justify-end">
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">לא נמצאו משתמשים במערכת</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img 
                    src={user.photoURL || `https://avatars.dicebear.com/api/initials/${user.displayName}.svg`} 
                    alt={user.displayName} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold">{user.displayName}</h3>
                  <div className="mt-1">{renderRating(user.rating || 0)}</div>
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-600 mb-4">
                <p className="line-clamp-2">{user.bio || "חבר במערכת 💬"}</p>
              </div>
              
              <div className="flex justify-end">
                {user.isConnected ? (
                  <Button variant="outline" disabled className="text-green-600 text-right">
                    <Check className="ml-2 h-4 w-4" />
                    מחובר
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleConnect(user.id)} 
                    disabled={connectingTo === user.id}
                    className="text-right"
                  >
                    <UserPlus className="ml-2 h-4 w-4" />
                    {connectingTo === user.id ? "מתחבר..." : "התחבר"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}