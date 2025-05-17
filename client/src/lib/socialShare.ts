// פונקציות לשיתוף תוכן ברשתות חברתיות

// שיתוף בפייסבוק
export function shareToFacebook(recommendationUrl: string, description?: string, imageUrl?: string) {
  // נבנה את הקישור לשיתוף בפייסבוק עם פרמטרים
  // זה ישתמש ב-Facebook Share Dialog בלי צורך ב-SDK מלא
  return new Promise((resolve, reject) => {
    try {
      // יוצרים URL לדיאלוג השיתוף
      const facebookShareUrl = new URL('https://www.facebook.com/dialog/share');
      
      // אם Facebook SDK זמין, נשתמש בו
      if (typeof window.FB !== 'undefined') {
        const shareObject: any = {
          method: 'share',
          href: recommendationUrl,
        };

        // הוסף תיאור אם קיים
        if (description) {
          shareObject.quote = description;
        }

        // פתח את דיאלוג השיתוף של פייסבוק
        window.FB.ui(shareObject, (response: any) => {
          if (response && !response.error_message) {
            console.log('שיתוף בפייסבוק הושלם בהצלחה!', response);
            resolve(response);
          } else if (response === undefined) {
            // המשתמש סגר את חלון השיתוף
            resolve({ shared: false, platform: 'facebook', reason: 'user_cancelled' });
          } else {
            console.error('שגיאה בשיתוף:', response?.error_message || 'לא ידוע');
            reject(new Error(response?.error_message || 'שגיאה בשיתוף לפייסבוק'));
          }
        });
        return;
      }
      
      // אם Facebook SDK לא זמין, נשתמש בקישור ישיר לדיאלוג השיתוף
      facebookShareUrl.searchParams.append('app_id', '1408603290182678');
      facebookShareUrl.searchParams.append('href', recommendationUrl);
      facebookShareUrl.searchParams.append('display', 'popup');
      
      if (description) {
        facebookShareUrl.searchParams.append('quote', description);
      }
      
      // פתח חלון חדש עם קישור השיתוף
      const shareWindow = window.open(
        facebookShareUrl.toString(),
        'facebook-share-dialog',
        'width=626,height=436'
      );
      
      // נחכה קצת ונבדוק אם החלון נסגר
      const checkWindowClosed = setInterval(() => {
        if (shareWindow?.closed) {
          clearInterval(checkWindowClosed);
          resolve({ shared: true, platform: 'facebook' });
        }
      }, 1000);
      
      // נגדיר timeout למקרה שמשהו השתבש
      setTimeout(() => {
        clearInterval(checkWindowClosed);
        if (!shareWindow?.closed) {
          resolve({ shared: true, platform: 'facebook' });
        }
      }, 60000); // דקה אחת
    } catch (error) {
      console.error('שגיאה בפתיחת דיאלוג השיתוף:', error);
      reject(error);
    }
  });
}

// שיתוף באינסטגרם
export function shareToInstagram(imageUrl: string, caption?: string) {
  // כרגע אינסטגרם לא מאפשר שיתוף ישיר מדפדפן דרך API
  // נוביל לאפליקציית האינסטגרם עם התמונה אם אפשרי
  const errorMessage = 'שיתוף ישיר לאינסטגרם אינו נתמך ישירות דרך דפדפן.';
  console.log(errorMessage);
  
  // אפשרות עתידית: פתיחת אינסטגרם עם deep link (במובייל בלבד)
  // window.location.href = `instagram://camera`;
  
  // מחזיר הבטחה שנדחית במקרה זה
  return Promise.reject(new Error(errorMessage));
}

// שיתוף בטוויטר
export function shareToTwitter(text: string, url: string, hashtags?: string[]) {
  const twitterUrl = new URL('https://twitter.com/intent/tweet');
  twitterUrl.searchParams.append('text', text);
  twitterUrl.searchParams.append('url', url);
  
  if (hashtags && hashtags.length > 0) {
    twitterUrl.searchParams.append('hashtags', hashtags.join(','));
  }
  
  // פתח חלון חדש עם URL השיתוף של טוויטר
  window.open(twitterUrl.toString(), '_blank', 'width=550,height=420');
  
  return Promise.resolve({ shared: true, platform: 'twitter' });
}

// הוסף את הטיפוס לחלון גלובלי עבור Facebook SDK
declare global {
  interface Window {
    FB: {
      init: (options: any) => void;
      ui: (options: any, callback: (response: any) => void) => void;
    };
  }
}