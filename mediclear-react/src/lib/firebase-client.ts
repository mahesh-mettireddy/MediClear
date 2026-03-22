import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp,
  getCountFromServer,
  where,
  Timestamp
} from "firebase/firestore";
import { COLLECTIONS } from "./constants";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_GOOGLE_CLOUD_PROJECT || "promptwars-basic",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
};

// Initialize Firebase Client
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Analytics (Client-side only)
let analytics: any = null;
isSupported().then(yes => {
    if (yes) analytics = getAnalytics(app);
});

/**
 * Logs a custom event to Firebase Analytics
 */
export const trackEvent = (name: string, params?: any) => {
    if (analytics) {
        logEvent(analytics, name, params);
    }
};

/**
 * Fetches emergency cases from Firestore with fallback to localStorage
 */
export const getEmergencyHistory = async (): Promise<any[]> => {
  const timeoutPromise = new Promise<any[]>((_, reject) => {
    setTimeout(() => reject(new Error("Firebase Timeout")), 5000);
  });

  const fetchPromise = (async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.EMERGENCY_CASES),
        orderBy("timestamp", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  })();

  try {
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.warn("Retreiving history from localStorage", error);
    const local = localStorage.getItem("mediclear_cases");
    return local ? JSON.parse(local) : [];
  }
};

/**
 * Persists an emergency case to Firestore (Cloud) and localStorage (Local).
 */
export const saveCaseToHistory = async (data: any): Promise<void> => {
    const caseRecord = {
        timestamp: Date.now(),
        chief_complaint: data?.patient_context?.chief_complaint || "Unknown",
        esi_level: data?.clinical_assessment?.esi_triage_level || "Unknown",
        action_directive: data?.hospital_orchestration?.primary_action_directive || "Unknown",
        confidence_score: data?.administrative_routing?.confidence_score_overall || 0,
        full_response: data,
        document_urls: data?._document_urls || []
    };

    // Save to Local Storage first
    try {
        const existing = JSON.parse(localStorage.getItem("mediclear_cases") || "[]");
        existing.unshift(caseRecord);
        localStorage.setItem("mediclear_cases", JSON.stringify(existing.slice(0, 50)));
    } catch (lcError) { /* ignore */ }

    // Save to Cloud Persistence
    try {
        await addDoc(collection(db, COLLECTIONS.EMERGENCY_CASES), {
            ...caseRecord,
            timestamp: serverTimestamp(),
        });
    } catch (dbError: any) {
        console.error("Firestore sync error:", dbError.message);
        throw new Error("Cloud synchronization is currently unavailable. Your case has been saved locally.");
    }
}

/**
 * Gets the total count of emergencies processed today.
 */
export const getTodayEmergencyCount = async (): Promise<number> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const q = query(
            collection(db, COLLECTIONS.EMERGENCY_CASES),
            where("timestamp", ">=", Timestamp.fromDate(today))
        );
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.warn("Firestore count failed:", error);
        return 0;
    }
}

export { db, app };
