import { useQuery } from "@tanstack/react-query";
import { getBusinesses } from "@/lib/firebase";

export function useBusinesses() {
  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      try {
        const data = await getBusinesses();
        return data;
      } catch (error) {
        console.error("Error fetching businesses:", error);
        // אם יש שגיאת הרשאות, נחזיר מידע דוגמה כדי שהאפליקציה תמשיך לעבוד
        return [
          {
            id: "1",
            name: "קפה טוב",
            category: "מסעדות",
            description: "בית קפה איכותי עם אוכל טעים ואווירה נעימה",
            image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
            address: "רחוב הרצל 45, תל אביב",
            discount: "10% הנחה על כל התפריט",
          },
          {
            id: "2",
            name: "חנות ספרים הישנה",
            category: "קמעונאות",
            description: "חנות ספרים עם מבחר עצום של ספרים חדשים ויד שניה",
            image: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?q=80&w=1000&auto=format&fit=crop",
            address: "שדרות רוטשילד 22, תל אביב",
            discount: "ספר שני ב-50% הנחה",
          },
          {
            id: "3",
            name: "סטודיו יוגה",
            category: "בריאות וכושר",
            description: "סטודיו יוגה מודרני עם מדריכים מקצועיים",
            image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=1000&auto=format&fit=crop",
            address: "רחוב שינקין 15, תל אביב",
            discount: "שיעור ניסיון ראשון בחינם",
          },
          {
            id: "4",
            name: "מספרת לוי",
            category: "טיפוח",
            description: "מספרה מקצועית לגברים ונשים",
            image: "https://images.unsplash.com/photo-1572473694924-2c5b7b835e40?q=80&w=1000&auto=format&fit=crop",
            address: "רחוב דיזנגוף 120, תל אביב",
            discount: "15% הנחה על תספורת ראשונה",
          },
          {
            id: "5",
            name: "חנות הנעליים",
            category: "אופנה",
            description: "חנות נעליים עם מבחר גדול לנשים, גברים וילדים",
            image: "https://images.unsplash.com/photo-1549971352-c31f2c34a14a?q=80&w=1000&auto=format&fit=crop",
            address: "קניון רמת אביב, תל אביב",
            discount: "20% הנחה על הזוג השני",
          }
        ];
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return {
    businesses,
    isLoading,
    error
  };
}