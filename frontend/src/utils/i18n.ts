// Multilingual Engine for L.C.C. Learning Platform
// Supports: English (en), Hinglish (hinglish), Hindi (hi), Marathi (mr)

export type AppLanguage = 'en' | 'hinglish' | 'hi' | 'mr';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  home: string;
  batches: string;
  vault: string;
  notices: string;
  myLearning: string;
  offlineVault: string;
  doubts: string;
  portalLogin: string;
  hiLearner: string;
  changeGoal: string;
  activeGoal: string;
  recommendedForYou: string;
  freeNotes: string;
  videoClasses: string;
  exploreAllCourses: string;
  downloadOffline: string;
  downloaded: string;
  readNow: string;
  enrollNow: string;
  admissionOpen: string;
  viewDetails: string;
  selectLanguage: string;
  selectClass: string;
  selectSubjects: string;
  selectAvatar: string;
  saveAndContinue: string;
  searchPlaceholder: string;
  noOfflineNotes: string;
  noOfflineNotesSub: string;
  offlineReady: string;
  logout: string;
  adminDesk: string;
  staffPortal: string;
  navHome: string;
  myBatches: string;
  askDoubt: string;
  seeAll: string;
  freeNotesDpp: string;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: 'L.C.C. Learning App',
    appSubtitle: 'Academic, Tests & Counseling',
    home: 'Home',
    batches: 'Batches',
    vault: 'Study Vault',
    notices: 'Notices',
    myLearning: 'My Learning',
    offlineVault: 'Offline Vault',
    doubts: 'Doubts',
    portalLogin: 'Portal Login',
    hiLearner: 'Hello, Learner!',
    changeGoal: 'Change',
    activeGoal: 'Target Goal',
    recommendedForYou: 'Recommended for Your Class',
    freeNotes: 'Chapter Notes & DPPs',
    videoClasses: 'Video Lectures & Shorts',
    exploreAllCourses: 'All Batches & Courses',
    downloadOffline: 'Download Offline',
    downloaded: 'Downloaded',
    readNow: 'Read Now',
    enrollNow: 'Enroll Now',
    admissionOpen: 'Admissions Open 2026-27',
    viewDetails: 'View Details',
    selectLanguage: 'Choose App Language',
    selectClass: 'Choose Your Class / Target Exam',
    selectSubjects: 'Select Your Favorite Subjects',
    selectAvatar: 'Pick Your Student Avatar',
    saveAndContinue: 'Save & Enter Learning App',
    searchPlaceholder: 'Search batches, notes, lectures...',
    noOfflineNotes: 'No Offline Notes Saved Yet',
    noOfflineNotesSub: 'Tap "Download Offline" on any chapter note to read without internet.',
    offlineReady: 'Available Without Internet',
    logout: 'Log Out',
    adminDesk: 'Director Admin Desk',
    staffPortal: 'Staff & Faculty Portal',
    navHome: 'Home',
    myBatches: 'My Batches',
    askDoubt: 'Ask Doubt',
    seeAll: 'See All',
    freeNotesDpp: 'Free Notes & DPPs'
  },
  hinglish: {
    appName: 'L.C.C. Learning App',
    appSubtitle: 'Padhai, Tests aur Counseling',
    home: 'Home',
    batches: 'Batches',
    vault: 'Study Vault',
    notices: 'Notices',
    myLearning: 'Meri Padhai',
    offlineVault: 'Offline Notes',
    doubts: 'Doubt Pucho',
    portalLogin: 'Login / Register',
    hiLearner: 'Namaste, Padhaaku Dost!',
    changeGoal: 'Badlo',
    activeGoal: 'Aapka Target',
    recommendedForYou: 'Aapki Class ke Top Batches',
    freeNotes: 'Free Notes aur DPPs',
    videoClasses: 'Video Lectures aur Shorts',
    exploreAllCourses: 'Saare Batches aur Courses',
    downloadOffline: 'Offline Save Karein',
    downloaded: 'Downloaded',
    readNow: 'Abhi Padhein',
    enrollNow: 'Abhi Join Karein',
    admissionOpen: 'Admission Chalu Hai 2026-27',
    viewDetails: 'Details Dekhein',
    selectLanguage: 'App ki Bhasha Chunein',
    selectClass: 'Apni Class ya Target Exam Chunein',
    selectSubjects: 'Apne Manpasand Subjects Chunein',
    selectAvatar: 'Apna Avatar Chunein',
    saveAndContinue: 'Save Karke Aage Badhein',
    searchPlaceholder: 'Batches, notes, video khojein...',
    noOfflineNotes: 'Koi Offline Note Save Nahi Hai',
    noOfflineNotesSub: 'Kisi bhi note pe "Offline Save Karein" dabayein bina internet padhne ke liye.',
    offlineReady: 'Bina Internet Chalega',
    logout: 'Log Out',
    adminDesk: 'Director Admin Desk',
    staffPortal: 'Staff aur Teacher Portal',
    navHome: 'Home',
    myBatches: 'Mere Batches',
    askDoubt: 'Doubt Pucho',
    seeAll: 'Sabhi Dekho',
    freeNotesDpp: 'Free Notes aur DPPs'
  },
  hi: {
    appName: 'एल.सी.सी. लर्निंग ऐप',
    appSubtitle: 'शिक्षा, टेस्ट और मार्गदर्शन',
    home: 'होम',
    batches: 'बैचेस',
    vault: 'स्टडी वॉल्ट',
    notices: 'नोटिस',
    myLearning: 'मेरी पढ़ाई',
    offlineVault: 'ऑफलाइन नोट्स',
    doubts: 'संदेह पूछें',
    portalLogin: 'लॉगिन / प्रवेश',
    hiLearner: 'नमस्ते, शिक्षार्थी!',
    changeGoal: 'बदलें',
    activeGoal: 'लक्ष्य कक्षा',
    recommendedForYou: 'आपकी कक्षा के लिए अनुशंसित',
    freeNotes: 'अध्याय नोट्स और डीपीपी',
    videoClasses: 'वीडियो कक्षाएं और रील्स',
    exploreAllCourses: 'सभी बैचेस और कोर्सेज',
    downloadOffline: 'ऑफलाइन डाउनलोड करें',
    downloaded: 'डाउनलोड हुआ',
    readNow: 'अभी पढ़ें',
    enrollNow: 'अभी प्रवेश लें',
    admissionOpen: 'प्रवेश प्रारंभ 2026-27',
    viewDetails: 'विवरण देखें',
    selectLanguage: 'ऐप की भाषा चुनें',
    selectClass: 'अपनी कक्षा या लक्ष्य परीक्षा चुनें',
    selectSubjects: 'अपने मुख्य विषय चुनें',
    selectAvatar: 'अपना अवतार चुनें',
    saveAndContinue: 'सहेजें और आगे बढ़ें',
    searchPlaceholder: 'बैच, नोट्स, वीडियो खोजें...',
    noOfflineNotes: 'अभी कोई ऑफलाइन नोट्स सहेजे नहीं हैं',
    noOfflineNotesSub: 'बिना इंटरनेट पढ़ने के लिए किसी भी नोट पर "ऑफलाइन डाउनलोड करें" पर टैप करें।',
    offlineReady: 'बिना इंटरनेट उपलब्ध',
    logout: 'लॉग आउट',
    adminDesk: 'निदेशक एडमिन डेस्क',
    staffPortal: 'शिक्षक एवं स्टाफ पोर्टल',
    navHome: 'होम',
    myBatches: 'मेरे बैचेस',
    askDoubt: 'संदेह पूछें',
    seeAll: 'सभी देखें',
    freeNotesDpp: 'अध्याय नोट्स और डीपीपी'
  },
  mr: {
    appName: 'एल.सी.सी. लर्निंग अॅप',
    appSubtitle: 'शिक्षण, चाचण्या आणि मार्गदर्शन',
    home: 'मुख्यपृष्ठ',
    batches: 'बॅचेस',
    vault: 'अभ्यास साहित्य',
    notices: 'सूचना',
    myLearning: 'माझा अभ्यास',
    offlineVault: 'ऑफलाइन नोट्स',
    doubts: 'शंका विचारा',
    portalLogin: 'लॉगिन / नोंदणी',
    hiLearner: 'नमस्कार, विद्यार्थी मित्रा!',
    changeGoal: 'बदला',
    activeGoal: 'लक्ष्य वर्ग',
    recommendedForYou: 'तुमच्या वर्गासाठी विशेष बॅचेस',
    freeNotes: 'धडा नोट्स आणि डीपीपी',
    videoClasses: 'व्हिडिओ लेक्चर्स आणि रील्स',
    exploreAllCourses: 'सर्व बॅचेस आणि कोर्सेस',
    downloadOffline: 'ऑफलाइन डाउनलोड करा',
    downloaded: 'डाउनलोड झाले',
    readNow: 'आता वाचा',
    enrollNow: 'प्रवेश घ्या',
    admissionOpen: 'प्रवेश सुरू 2026-27',
    viewDetails: 'तपशील पहा',
    selectLanguage: 'अॅपची भाषा निवडा',
    selectClass: 'तुमचा वर्ग किंवा लक्ष्य परीक्षा निवडा',
    selectSubjects: 'तुमचे आवडते विषय निवडा',
    selectAvatar: 'तुमचा अवतार निवडा',
    saveAndContinue: 'जतन करा आणि पुढे चला',
    searchPlaceholder: 'बॅचेस, नोट्स, व्हिडिओ शोधा...',
    noOfflineNotes: 'अद्याप कोणतेही ऑफलाइन नोट्स जतन केलेले नाहीत',
    noOfflineNotesSub: 'इंटरनेटशिवाय वाचण्यासाठी कोणत्याही नोटवर "ऑफलाइन डाउनलोड करा" वर टॅप करा.',
    offlineReady: 'इंटरनेटशिवाय उपलब्ध',
    logout: 'लॉग आउट',
    adminDesk: 'डायरेक्टर अॅडमिन डेस्क',
    staffPortal: 'स्टाफ आणि शिक्षक पोर्टल',
    navHome: 'मुख्यपृष्ठ',
    myBatches: 'माझे बॅचेस',
    askDoubt: 'शंका विचारा',
    seeAll: 'सर्व पहा',
    freeNotesDpp: 'धडा नोट्स आणि डीपीपी'
  }
};

export const getTranslation = (lang: AppLanguage = 'en'): TranslationDictionary => {
  return translations[lang] || translations.en;
};
