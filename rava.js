// 🔥 Firebase import
// 🔥 Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔥 Config
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

const productsDiv = document.getElementById("products");

// 🔥 LOAD RAVA PRODUCTS
async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  productsDiv.innerHTML = "";

  snapshot.forEach(doc => {
    let p = doc.data();

    if (p.category && p.category.toLowerCase() === "rava") {

      productsDiv.innerHTML += `
        <div class="product-card">
          <img src="images/${p.image}" class="icon">

          <div class="details">
            <h3>${p.name} (${p.weight}kg)</h3>
            <div class="price">₹${p.price}</div>

            <div class="labels">
              <span>Bags</span>
              <span>Quintal</span>
            </div>

            <div class="inputs">
              <input type="number" value="0"
                oninput="calculate(this, ${p.weight}); addToCart('${doc.id}', '${p.name}', this, ${p.price})">

              <input type="text" class="quintal" value="0.00" readonly>
            </div>
          </div>
        </div>
      `;
    }
  });
}

// 🔥 CALCULATE (same rice logic)
window.calculate = function(input, kg) {
  let bags = parseFloat(input.value) || 0;
  let card = input.closest(".product-card");

  let q = card.querySelector(".quintal");
  let quintal = (bags * kg) / 100;

  q.value = quintal.toFixed(2);
};

// 🔥 CART (same as main)
window.addToCart = function (id, name, input, price) {
  let qty = parseInt(input.value) || 0;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (qty > 0) {
    cart[id] = { name, price, bags: qty };
  } else {
    delete cart[id];
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

loadProducts();