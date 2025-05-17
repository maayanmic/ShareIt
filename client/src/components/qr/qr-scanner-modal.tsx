import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { X, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type QRScannerContextType = {
  isOpen: boolean;
  openScanner: (onScan: (result: string | null) => void) => void;
  closeScanner: () => void;
};

const QRScannerContext = createContext<QRScannerContextType>({
  isOpen: false,
  openScanner: () => {},
  closeScanner: () => {},
});

export const useQRScanner = () => useContext(QRScannerContext);

export const QRScannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onScanCallback, setOnScanCallback] = useState<(result: string | null) => void>(() => () => {});
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-reader";
  
  // ניקוי סורק ה-QR כשהמודל נסגר
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const openScanner = (onScan: (result: string | null) => void) => {
    setIsOpen(true);
    setOnScanCallback(() => onScan);
  };

  const closeScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop().catch(console.error);
    }
    setIsOpen(false);
  };
  
  // פונקציה שמתחילה את סריקת ה-QR כשהדיאלוג נפתח
  useEffect(() => {
    if (isOpen) {
      // ודא שהאלמנט קיים לפני שמנסים להתחיל את הסריקה
      setTimeout(() => {
        const scannerContainer = document.getElementById(scannerContainerId);
        if (!scannerContainer) return;
        
        // יצירת מופע חדש של סורק QR
        qrScannerRef.current = new Html5Qrcode(scannerContainerId);
        
        // התחלת סריקה עם מצלמה אחורית
        qrScannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // עיבוד ההתראה המוצלחת
            handleSuccessfulScan(decodedText);
          },
          (errorMessage) => {
            // שגיאות סריקה לא מוצגות למשתמש כי הן קורות כל הזמן בזמן סריקה
            console.log(errorMessage);
          }
        ).catch((err) => {
          console.error("Error starting QR scanner:", err);
          toast({
            title: "שגיאה בהפעלת המצלמה",
            description: "לא ניתן להפעיל את מצלמת המכשיר, נא לאשר גישה למצלמה.",
            variant: "destructive"
          });
        });
      }, 500);
    }
  }, [isOpen, toast]);
  
  // פונקציה לטיפול בסריקה מוצלחת של קוד QR
  const handleSuccessfulScan = (decodedText: string) => {
    // עצירת הסריקה לאחר שנמצא קוד
    if (qrScannerRef.current) {
      qrScannerRef.current.stop().catch(console.error);
    }
    
    console.log("קוד QR נסרק בהצלחה:", decodedText);
    
    try {
      // נסה לפרש את טקסט ה-QR כ-URL או מזהה של עסק
      let businessId;
      
      // בדוק אם התוצאה היא URL מלא
      if (decodedText.startsWith("http")) {
        // חלץ את מזהה העסק מה-URL
        const url = new URL(decodedText);
        businessId = url.searchParams.get("businessId") || url.pathname.split("/").pop();
      } else {
        // אם זה לא URL, הנח שזה מזהה העסק עצמו
        businessId = decodedText;
      }
      
      toast({
        title: "קוד QR נסרק בהצלחה",
        description: "מעבר לדף העסק...",
      });
      
      // בדוק אם המשתמש מחובר
      if (!user) {
        // שמור את מזהה העסק בלוקל סטורג' כדי להעביר את המשתמש לאחר התחברות
        localStorage.setItem("scannedBusinessId", businessId);
        toast({
          title: "נדרשת התחברות",
          description: "יש להתחבר תחילה לפני שניתן להמשיך",
        });
        setLocation("/login");
      } else {
        // קרא לפונקציית הקולבק והעבר את המשתמש לדף העסק
        onScanCallback(businessId);
        // ניווט לדף העסק
        setLocation(`/business/${businessId}`);
      }
      
      closeScanner();
    } catch (error) {
      console.error("שגיאה בעיבוד קוד QR:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעבד את קוד ה-QR. נא לנסות שוב.",
        variant: "destructive"
      });
    }
  };
  
  // פונקציה לטיפול בהעלאת קובץ עם קוד QR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    toast({
      title: "מעבד תמונה",
      description: "נא להמתין בזמן שהתמונה נסרקת...",
    });
    
    // עצירת סורק המצלמה החי אם הוא פעיל
    if (qrScannerRef.current) {
      qrScannerRef.current.stop().catch(console.error);
    }
    
    // יצירת מופע חדש של סורק QR לסריקת תמונה
    const html5QrCode = new Html5Qrcode(scannerContainerId);
    
    // סריקת קובץ התמונה
    html5QrCode.scanFile(file, /* showImage */ true)
      .then(decodedText => {
        handleSuccessfulScan(decodedText);
      })
      .catch(error => {
        console.error("שגיאה בסריקת קובץ:", error);
        toast({
          title: "לא נמצא קוד QR",
          description: "לא ניתן לזהות קוד QR בתמונה שהועלתה. נא לנסות שוב.",
          variant: "destructive"
        });
        
        // הפעלה מחדש של סורק המצלמה החי
        setTimeout(() => {
          if (isOpen && qrScannerRef.current) {
            qrScannerRef.current.start(
              { facingMode: "environment" },
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (text) => handleSuccessfulScan(text),
              (err) => console.log(err)
            ).catch(console.error);
          }
        }, 1000);
      });
  };

  return (
    <QRScannerContext.Provider value={{ isOpen, openScanner, closeScanner }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 rtl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">סרוק קוד QR</h3>
              <Button variant="ghost" size="icon" onClick={closeScanner}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-4">
              {/* אזור לסורק QR */}
              <div 
                id={scannerContainerId}
                className="bg-gray-100 dark:bg-gray-900 rounded-lg aspect-square w-full max-w-sm mx-auto flex items-center justify-center overflow-hidden"
              >
                <div className="relative w-4/5 h-4/5 border-2 border-primary-500">
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary-500 -mt-2 -mr-2"></div>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-500 -mt-2 -ml-2"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-500 -mb-2 -mr-2"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary-500 -mb-2 -ml-2"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">מקם את קוד ה-QR בתוך המסגרת</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                סרוק את קוד ה-QR בעסק כדי להתחיל את ההמלצה שלך
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end">
              <Button 
                variant="outline" 
                className="mx-2"
                onClick={closeScanner}
              >
                ביטול
              </Button>
              <Button
                className="flex items-center"
                onClick={() => document.getElementById('qr-file-input')?.click()}
              >
                <Upload className="h-4 w-4 ml-2" />
                העלה תמונה
                <input 
                  type="file" 
                  id="qr-file-input" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Button>
              <Button 
                variant="default" 
                className="mx-2"
                onClick={() => {
                  // מצלמה ידנית - לצורך בדיקות בסביבת פיתוח
                  toast({
                    title: "מדמה סריקת QR",
                    description: "בסביבת ייצור, זה יסרוק קוד QR אמיתי"
                  });
                  // החלק הבא ישמש רק לצורך בדיקות בסביבת פיתוח
                  // בסביבת ייצור, משתמשים יסרקו קודי QR אמיתיים
                  const testBusinessIds = ["coffee", "attire", "restaurant"];
                  const randomBusinessId = testBusinessIds[Math.floor(Math.random() * testBusinessIds.length)];
                  handleSuccessfulScan(randomBusinessId);
                }}
              >
                <Camera className="h-4 w-4 ml-2" />
                מצלמה
              </Button>
            </div>
          </div>
        </div>
      )}
    </QRScannerContext.Provider>
  );
};
