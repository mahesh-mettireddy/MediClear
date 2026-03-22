/**
 * Formats a Date object or Firestore timestamp to a readable string
 * @param {any} timestamp - Date or Firebase Timestamp
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp: any): string => {
  if (!timestamp) return 'Just now';
  // Use a type guard or check for toDate method (Firestore signature)
  const date = (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof (timestamp as any).toDate === 'function') 
    ? (timestamp as any).toDate() 
    : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Determines a CSS color class based on ESI triage level
 * @param {string} level - ESI Level (1-5)
 * @returns {string} Tailwind class for text/background color
 */
export const getESIColor = (level: string): string => {
  const num = parseInt(level?.replace(/\D/g, '') || "5");
  if (num === 1) return "text-red-500 bg-red-950/20 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse";
  if (num === 2) return "text-orange-500 bg-orange-950/20 border-orange-500/30";
  if (num === 3) return "text-yellow-600 bg-yellow-950/20 border-yellow-500/30";
  if (num === 4) return "text-blue-500 bg-blue-950/20 border-blue-500/30";
  return "text-green-500 bg-green-950/20 border-green-500/30";
};

/**
 * Safely parses input as JSON
 * @param {string} text - JSON string
 * @returns {Record<string, any>|null} Parsed object or null
 */
export const safeParseJSON = (text: string): Record<string, any> | null => {
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (_e) {
    return null;
  }
};

/**
 * Compresses an image file before upload for efficiency.
 * @param {File} file - Original image file
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
    };
  });
};
