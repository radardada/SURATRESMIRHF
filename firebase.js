// firebase.js — RHF AppStore (Full, fokus, modular, siap pakai)

// =======================
// Import Firebase SDK v9 (modular)
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// =======================
// Konfigurasi Firebase RHF AppStore
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyAyHSaALeuwibcF22VNL_6WDlcZepcDB3A",
  authDomain: "rhf-gamestore.firebaseapp.com",
  databaseURL: "https://rhf-gamestore-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rhf-gamestore",
  storageBucket: "rhf-gamestore.appspot.com", // gunakan .appspot.com
  messagingSenderId: "52065906934",
  appId: "1:52065906934:web:c15f0eff91cc937f787cd7",
  measurementId: "G-RYFR9D5R5H"
};

// =======================
// Init Firebase
// =======================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

// =======================
// Fungsi untuk Aplikasi
// =======================

// Tambah aplikasi baru (satu file APK)
export async function addApp({ name, developer, category, file }) {
  if (!name || !developer || !category || !file) {
    throw new Error("Data tidak lengkap untuk upload APK.");
  }
  const filePath = `apk/${Date.now()}_${file.name}`;
  const fRef = storageRef(storage, filePath);
  await uploadBytes(fRef, file);
  const apkUrl = await getDownloadURL(fRef);

  const newRef = push(ref(db, "apps"));
  await set(newRef, {
    name,
    developer,
    category,
    apk_url: apkUrl,
    storage_path: filePath,
    rating: 0,
    downloads: 0,
    created_at: Date.now()
  });
  return newRef.key;
}

// Tambah banyak aplikasi sekaligus (multiple files)
export async function addMultipleApps({ name, developer, category, files }) {
  const ids = [];
  for (const file of files) {
    const id = await addApp({ name, developer, category, file });
    ids.push(id);
  }
  return ids;
}

// Update aplikasi
export async function updateApp(appId, payload) {
  await update(ref(db, `apps/${appId}`), payload);
}

// Hapus aplikasi
export async function deleteApp(appId) {
  const snap = await get(ref(db, `apps/${appId}`));
  if (!snap.exists()) return;
  const data = snap.val();
  if (data.storage_path) {
    try {
      await deleteObject(storageRef(storage, data.storage_path));
    } catch (e) {
      console.warn("Gagal hapus file storage:", e.message);
    }
  }
  await remove(ref(db, `apps/${appId}`));
}

// Tambah download count
export async function incrementDownloads(appId) {
  const snap = await get(ref(db, `apps/${appId}`));
  if (!snap.exists()) return;
  const d = snap.val();
  const next = (d.downloads || 0) + 1;
  await update(ref(db, `apps/${appId}`), { downloads: next });
}

// Subscribe aplikasi real-time
export function subscribeApps(callback) {
  onValue(ref(db, "apps"), (snapshot) => {
    const val = snapshot.val() || {};
    callback(val);
  });
}

// =======================
// Fungsi untuk User & Saldo
// =======================

// Update saldo user
export async function updateSaldo(userId, newSaldo) {
  await update(ref(db, `users/${userId}`), { saldo: newSaldo });
}

// Tambah user baru
export async function addUser({ name, email, saldo }) {
  const newRef = push(ref(db, "users"));
  await set(newRef, {
    name,
    email,
    saldo: saldo || 0,
    created_at: Date.now()
  });
  return newRef.key;
}

// Hapus user
export async function deleteUser(userId) {
  await remove(ref(db, `users/${userId}`));
}

// Subscribe user real-time
export function subscribeUsers(callback) {
  onValue(ref(db, "users"), (snapshot) => {
    const val = snapshot.val() || {};
    callback(val);
  });
}

// =======================
// Export default
// =======================
export default {
  app,
  analytics,
  db,
  storage,
  addApp,
  addMultipleApps,
  updateApp,
  deleteApp,
  incrementDownloads,
  subscribeApps,
  updateSaldo,
  addUser,
  deleteUser,
  subscribeUsers
};
