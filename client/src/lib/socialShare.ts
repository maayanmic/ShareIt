// פונקציות לשיתוף תוכן ברשתות חברתיות

// שיתוף בפייסבוק
export function shareToFacebook(recommendationUrl: string, description?: string, imageUrl?: string) {
  // וודא שפונקציית FB קיימת (Facebook SDK נטען)
  if (typeof window.FB === 'undefined') {
    console.error('Facebook SDK לא נטען. לא ניתן לשתף.');
    return Promise.reject(new Error('Facebook SDK לא נטען.'));
  }

  return new Promise((resolve, reject) => {
    // הכן את האובייקט לשיתוף
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
      } else {
        console.error('שגיאה בשיתוף:', response?.error_message || 'לא ידוע');
        reject(new Error(response?.error_message || 'שגיאה בשיתוף לפייסבוק'));
      }
    });
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