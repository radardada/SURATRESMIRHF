// firebase-config.js
// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALIhKFz4bpOPmES6t2fAdx8VMPP0ye1wc",
  authDomain: "rhf-resmi.firebaseapp.com",
  projectId: "rhf-resmi",
  storageBucket: "rhf-resmi.firebasestorage.app",
  messagingSenderId: "313439235544",
  appId: "1:313439235544:web:b19a2ad538e34c1fe516ad",
  measurementId: "G-LNCVH73P3X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();
