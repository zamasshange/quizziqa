const DB_NAME = "quizzical-assets";
const DB_VERSION = 1;
const IMAGE_STORE = "images";
const QUESTION_STORE = "questions";
const IMAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const QUESTION_TTL_MS = 24 * 60 * 60 * 1000;

interface StoredImage {
  key: string;
  buffer: ArrayBuffer;
  contentType: string;
  ts: number;
}

interface StoredQuestions {
  key: string;
  data: string;
  ts: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no indexedDB"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(QUESTION_STORE)) {
        db.createObjectStore(QUESTION_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetImage(key: string): Promise<Blob | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, "readonly");
      const req = tx.objectStore(IMAGE_STORE).get(key);
      req.onsuccess = () => {
        const row = req.result as StoredImage | undefined;
        if (!row || Date.now() - row.ts > IMAGE_TTL_MS) {
          resolve(null);
          return;
        }
        resolve(new Blob([row.buffer], { type: row.contentType }));
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function idbPutImage(key: string, blob: Blob): Promise<void> {
  try {
    const buffer = await blob.arrayBuffer();
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, "readwrite");
      tx.objectStore(IMAGE_STORE).put({
        key,
        buffer,
        contentType: blob.type || "image/jpeg",
        ts: Date.now(),
      } satisfies StoredImage);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* ignore */
  }
}

export async function idbGetQuestions<T>(key: string): Promise<T | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(QUESTION_STORE, "readonly");
      const req = tx.objectStore(QUESTION_STORE).get(key);
      req.onsuccess = () => {
        const row = req.result as StoredQuestions | undefined;
        if (!row || Date.now() - row.ts > QUESTION_TTL_MS) {
          resolve(null);
          return;
        }
        try {
          resolve(JSON.parse(row.data) as T);
        } catch {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function idbPutQuestions<T>(key: string, data: T): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(QUESTION_STORE, "readwrite");
      tx.objectStore(QUESTION_STORE).put({
        key,
        data: JSON.stringify(data),
        ts: Date.now(),
      } satisfies StoredQuestions);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* ignore */
  }
}
