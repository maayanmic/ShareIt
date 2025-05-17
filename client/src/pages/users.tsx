import { useState, useEffect } from "react";
import { getUsers, createConnection, getUserRating } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, UserPlus, Check } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userConnections, setUserConnections] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        // פונקציה שתביא את כל המשתמשים מהמערכת
        const allUsers = await getUsers();
        // סנן את המשתמש הנוכחי מהרשימה
        const filteredUsers = allUsers.filter((u: any) => u.id !== user.uid);
        setUsers(filteredUsers);

        // טען את החיבורים של המשתמש הנוכחי
        const connections = user.connections || [];
        setUserConnections(connections);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "שגיאה",
          description: "לא ניתן היה לטעון את רשימת המשתמשים",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, toast]);

  const handleConnect = async (userId: string) => {
    if (!user) return;

    try {
      // בדוק אם כבר יש חיבור
      const isConnected = userConnections.includes(userId);
      
      if (isConnected) {
        // במקרה שכבר מחובר, הודע למשתמש
        toast({
          title: "כבר מחובר",
          description: "אתה כבר מחובר למשתמש זה",
        });
        return;
      }

      // יצירת חיבור חדש
      await createConnection(user.uid, userId);
      
      // עדכון המצב המקומי
      setUserConnections([...userConnections, userId]);
      
      toast({
        title: "חיבור נוצר בהצלחה",
        description: "עכשיו תוכל לראות את ההמלצות של משתמש זה בדף הבית שלך",
      });
    } catch (error) {
      console.error("Error connecting with user:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן היה ליצור חיבור עם המשתמש",
        variant: "destructive",
      });
    }
  };

  // פונקציה להצגת דירוג המשתמש בכוכבים
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "text-amber-500 fill-amber-500"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-right">משתמשים</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 h-40 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((userData) => {
            const isConnected = userConnections.includes(userData.id);
            const userRating = userData.avgRating || Math.floor(Math.random() * 5) + 1; // לצורך הדגמה - יש להחליף עם נתונים אמיתיים
            
            return (
              <Card key={userData.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData.photoURL || ""} />
                        <AvatarFallback>
                          {userData.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mr-4 flex flex-col">
                        <h3 className="font-medium text-right">{userData.displayName}</h3>
                        {/* דירוג כוכבים */}
                        <div className="flex justify-end mt-1">
                          {renderRating(userRating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-right">
                    <p>{userData.recommendations?.length || 0} המלצות פעילות</p>
                  </div>
                  
                  <Button
                    onClick={() => handleConnect(userData.id)}
                    variant={isConnected ? "secondary" : "default"}
                    className="w-full"
                    disabled={isConnected}
                  >
                    {isConnected ? (
                      <>
                        <Check className="ml-2 h-4 w-4" />
                        מחובר
                      </>
                    ) : (
                      <>
                        <UserPlus className="ml-2 h-4 w-4" />
                        צור חיבור
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
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
          <h3 className="text-lg font-medium mb-2">אין משתמשים זמינים</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            לא נמצאו משתמשים אחרים שניתן ליצור איתם חיבור.
          </p>
        </div>
      )}
    </div>
  );
}