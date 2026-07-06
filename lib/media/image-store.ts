const DB_NAME = "guess-everything-images";
const DB_VERSION = 1;
const STORE = "blobs";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface StoredBlob {
  key: string;
  buffer: ArrayBuffer;
  contentType: string;
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
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGet(key: string): Promise<Blob | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => {
        const row = req.result as StoredBlob | undefined;
        if (!row || Date.now() - row.ts > TTL_MS) {
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

export async function idbPut(key: string, blob: Blob): Promise<void> {
  try {
    const buffer = await blob.arrayBuffer();
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({
        key,
        buffer,
        contentType: blob.type || "image/jpeg",
        ts: Date.now(),
      } satisfies StoredBlob);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* ignore */
  }
}
