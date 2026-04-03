import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc   // 🔥 ADD THIS
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBwQ-Oc7e_MVNiwPRBBEtaEL43f2yS2gyw",
  authDomain: "rice-shop-43a1d.firebaseapp.com",
  projectId: "rice-shop-43a1d",
  storageBucket: "rice-shop-43a1d.firebasestorage.app",
  messagingSenderId: "827517885866",
  appId: "1:827517885866:web:6d9ae1832d7f019a649fd3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 📦 Fetch products
const productsDiv = document.getElementById("products");

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach((doc) => {
    const product = doc.data();

    // ✅ Only Bell Fresh products
    if (product.category === "bell_fresh") {

  let priceText = product.unit === "piece"
    ? "₹" + product.price + " / piece"
    : "₹" + product.price + " / kg";

  div.innerHTML = `
    <img src="${product.image}">
    <h3>${product.name}</h3>
    <p>${priceText}</p>
  `;
}
  });
}

loadProducts();