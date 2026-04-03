// cart.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔥 Firebase config
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

const cartDiv = document.getElementById("cartItems");
let total = 0;

// Real-time fetch cart items
onSnapshot(collection(db, "cartItems"), (snapshot) => {
  cartDiv.innerHTML = "";
  total = 0;

  snapshot.forEach((docItem) => {
    const item = docItem.data();
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" width="80" />
      <div>
        <h4>${item.name}</h4>
        <p>Price: ₹${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `;
    cartDiv.appendChild(div);
  });

  document.getElementById("finalTotal").textContent = total;
});

// Place Order - clears cart
window.placeOrder = async () => {
  const snapshot = await onSnapshot(collection(db, "cartItems"), (snap) => snap);
  snapshot.forEach(async (docItem) => {
    await deleteDoc(doc(db, "cartItems", docItem.id));
  });
  alert("Order placed successfully!");
};