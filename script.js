// 🔥 Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBwQ-Oc7e_MVNiwPRBBEtaEL43f2yS2gyw",
  authDomain: "rice-shop-43a1d.firebaseapp.com",
  projectId: "rice-shop-43a1d",
  storageBucket: "rice-shop-43a1d.firebasestorage.app",
  messagingSenderId: "827517885866",
  appId: "1:827517885866:web:6d9ae1832d7f019a649fd3"
};

// 🔥 Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Get selected category
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");

// 🔹 Global variables
let allProducts = [];

// 🔹 Fetch products and display
onSnapshot(collection(db, "products"), (snapshot) => {
  allProducts = [];
  snapshot.forEach(doc => allProducts.push({ id: doc.id, ...doc.data() }));

  if (selectedCategory === "rice") showRice();
  else if (selectedCategory === "bellfresh") showBellFresh();
  else if (selectedCategory === "rava") showRava();
  else if (selectedCategory === "kirana") showkirana();
  else displayProducts(allProducts);
});

// 🔹 Display products function
function displayProducts(products) {
  const div = document.getElementById("products");

  if (!div) return;

  div.innerHTML = "";

  products.forEach(p => {

    let firstLabel = (p.category === "bellfresh") ? "Packets" : "Bags";
    let secondLabel = (p.category === "bellfresh") ? "Pieces" : "Quintal";
    let secondClass = (p.category === "bellfresh") ? "pieces" : "quintal";

    let unitText;

if (p.category === "bellfresh") {
  unitText = `${p.weight} pieces`;
} else {
  if (p.weight < 1) {
    unitText = `${p.weight * 1000} gm`;  // 🔥 convert
  } else {
    unitText = `${p.weight} kg`;
  }
}
    div.innerHTML += `
      <div class="product-card">
        <img src="images/${p.image}" class="icon">

        <div class="details">
          <h3>
            ${p.teluguName || ""} <br>
            <small>${p.name} (${unitText})</small>
          </h3>

          <div class="price">
  ${
    p.category === "kirana"
    ? `
      <div>
        <span style="color: gray;">MRP:</span>
        <span style="text-decoration:  color: gray;"> ₹${p.mrp || 0}</span>
      </div>
      <div>
        <span style="color: green;">SP:</span>
        <span style="color: green; font-weight: bold;"> ₹${p.price || 0}</span>
      </div>
    `
    : `₹${p.price || 0}`
  }
</div>
          <div class="labels">
            <span>${firstLabel}</span>
            <span>${secondLabel}</span>
          </div>

          <div class="inputs">
            <input type="number" value="0" id="qty-${p.id}"
  oninput="calculate(this, ${p.weight}, '${p.category}')">



<input type="text" class="${secondClass}" value="0.00" readonly>
          </div>

          <!-- 🔥 ADD TO CART BUTTON -->
          <button onclick="addToCart('${p.id}', '${p.name}', 'qty-${p.id}', ${p.price}, '${p.image}')">
  Add to Cart
</button>
        </div>
      </div>
    `;
  });
}// 🔹 Filter functions
function showRice() {
  const rice = allProducts.filter(p => p.category === "rice");
  displayProducts(rice);
}

function showBellFresh() {
  const bell = allProducts.filter(p => p.category === "bellfresh");
  displayProducts(bell);
}

function showRava() {
  displayProducts(allProducts.filter(p => p.category === "rava"));
}

function showkirana() {
  displayProducts(allProducts.filter(p => p.category === "kirana"));
}
// 🔹 Navigation
window.goToProducts = (category) => window.location.href = "product.html?category=" + category;
window.goBack = () => window.history.back();
window.goToCategory = (category) => window.location.href = "product.html?category=" + category;

// 🔹 Calculate function
window.calculate = function(input, kg, category) {

  let qty = parseFloat(input.value) || 0;
  kg = parseFloat(kg) || 0;

  let card = input.closest(".product-card");

  if (!card) return; // 🔥 safety

  if (category === "bellfresh") {
    let p = card.querySelector(".pieces");
    if (p) {
      let pieces = qty * kg;
      p.value = isNaN(pieces) ? 0 : pieces;
    }
  } else {
    let q = card.querySelector(".quintal");
    if (q) {
      let quintal = (qty * kg) / 100;
      q.value = isNaN(quintal) ? 0 : quintal.toFixed(2);
    }
  }
};

// 🔥 Go to Cart Page
window.goToCart = function () {
  window.location.href = "cart.html";
};

// 🔹 Add to Cart
window.addToCart = function (id, name, inputId, price, image) {

  let qty = parseFloat(document.getElementById(inputId).value) || 0;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (qty > 0) {
    cart[id] = {
      name: name,
      price: price,
      bags: qty,
      image: image
    };

    showMessage("✔ Added to Cart"); // 🔥 MESSAGE
  } else {
    delete cart[id];
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateTotal();
};// 🔹 Update total
function updateTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let total = 0;

  for (let key in cart) {
    let item = cart[key];
    let qty = parseFloat(item.bags) || 0;
    let price = parseFloat(item.price) || 0;

    total += qty * price;
  }

  // 🔥 delivery logic
  let delivery = 0;
  if (total > 0 && total < 300) {
    delivery = 20;
  }

  let finalTotal = total + delivery;

  // 🔥 show subtotal
  let subEl = document.getElementById("subTotal");
  if (subEl) subEl.innerText = total;

  // 🔥 show delivery
  let delEl = document.getElementById("deliveryCharge");
  if (delEl) delEl.innerText = delivery;

  // 🔥 show final total
  let finalEl = document.getElementById("finalTotal");
  if (finalEl) finalEl.innerText = finalTotal;

  // 🔥 store
  localStorage.setItem("total", finalTotal);
}
window.addEventListener("load", function () {

  let orderDiv = document.getElementById("orderList");

  if (!orderDiv) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let total = 0;

  orderDiv.innerHTML = "";

  for (let key in cart) {
    let item = cart[key];
    let itemTotal = item.bags * item.price;
    total += itemTotal;

    orderDiv.innerHTML += `
      <div style="border-bottom:1px solid #ccc; padding:8px;">
        <p><b>${item.name}</b></p>
        <p>Qty: ${item.bags}</p>
        <p>Price: ₹${item.price}</p>
        <p>Total: ₹${itemTotal}</p>
        <p>image:  ₹${p.image}</p>
      </div>
    `;
  }

  // 🔥 total display
  let totalEl = document.getElementById("totalAmount");
  if (totalEl) totalEl.innerText = "Total: ₹" + total;
});

window.onload = function() {
  displayCart();
}

function displayCart() {
  const cartDiv = document.getElementById("cartItems");
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  let total = 0;

  if (!cartDiv) return;

  cartDiv.innerHTML = "";

  // 🔹 ITEMS LOOP
  for (let key in cart) {
    const item = cart[key];
    const itemTotal = item.bags * item.price;
    total += itemTotal;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <img src="images/${item.image}" style="width:100px; height:100px;">

        <div class="cart-details">
          <strong>${item.name}</strong><br>
          Qty: ${item.bags} × ₹${item.price}<br>
          Total: ₹${itemTotal}
        </div>

        <button onclick="removeItem('${key}')">❌</button>
      </div>
    `;
  }

  // 🔥 DELIVERY LOGIC
  let delivery = 0;
  if (total > 0 && total < 300) {
    delivery = 20;
  }

  let finalTotal = total + delivery;

  // 🔹 DELIVERY ROW
cartDiv.innerHTML += `
  <hr>
  <div style="display:flex; justify-content:space-between;">
    <span>Delivery Charge</span>
    <span>₹${delivery}</span>
  </div>
`;

// 🔥 FREE DELIVERY MESSAGE
if (total >= 300) {
  cartDiv.innerHTML += `
    <div style="color:green; font-weight:bold; margin-top:5px;">
      ✅ Free Delivery on orders above ₹300
    </div>
  `;
}

  // 🔹 TOTAL ROW
  cartDiv.innerHTML += `
    <div style="display:flex; justify-content:space-between; font-weight:bold;">
      <span>Total</span>
      <span>₹${finalTotal}</span>
    </div>
  `;

  // 🔥 SAVE TOTAL
  localStorage.setItem("total", finalTotal);
}

// Example placeOrder function
window.placeOrder = function() {
  alert("Order placed! Total: ₹" + document.getElementById("finalTotal").innerText);
}  
window.submitOrder = async function () {
  let phone = document.getElementById("phone").value;
  let cartData = JSON.parse(localStorage.getItem("cart")) || {};
  let total = localStorage.getItem("total") || 0;

  if (!phone) {
    alert("Enter phone number");
    return;
  }

  if (Object.keys(cartData).length === 0) {
    alert("Cart is empty!");
    return;
  }

  try {
    // 🔹 Save order to Firebase
    await addDoc(collection(db, "orders"), {
      phone: phone,
      items: Object.values(cartData).map(item => ({
        name: item.name,
        price: item.price,
        bags: item.bags,
        total: item.bags * item.price
      })),
      totalAmount: total,
      status: "new",
      createdAt: new Date()
    });

    // 🔥 ORDER PAGE NOTE (only if element exists)
let noteEl = document.getElementById("deliveryNote");

if (noteEl) {
  if (total >= 300) {
    noteEl.innerText = "✅ Free Delivery on orders above ₹300";
    noteEl.style.color = "green";
  } else if (total > 0) {
    noteEl.innerText = "🚚 Delivery charge ₹20 for orders below ₹300";
    noteEl.style.color = "red";
  } else {
    noteEl.innerText = "";
  }
}
     
    // 🔹 Show order details on same page
    const orderDiv = document.getElementById("orderDetails");
    orderDiv.innerHTML = `<h3>Order Details for: ${phone}</h3>`;
    
    Object.values(cartData).forEach(item => {
      orderDiv.innerHTML += `
        <div>
          <strong>${item.name}</strong> - ${item.bags} ${item.category === 'bellfresh' ? 'packets' : 'bags'} × ₹${item.price} = ₹${item.bags * item.price}
        </div>
      `;
    });

    orderDiv.innerHTML += `<h3>Total: ₹${total}</h3>`;

    // 🔹 Clear cart from localStorage (optional)
    localStorage.removeItem("cart");
    localStorage.removeItem("total");
    
 // 🔥 ONLY THIS ADD
  document.getElementById("successMsg").style.display = "block";
  } catch (e) {
    console.error(e);
    alert("Error saving order ❌");
  }
};

window.placeOrder = function () {
  window.location.href = "order.html";
};

window.toggleCart = function () {
  let box = document.getElementById("cartBox");

  if (box.style.display === "none") {
    box.style.display = "block";
    loadCart();   // 🔥 ADD THIS
  } else {
    box.style.display = "none";
  }
};



function showMessage(text) {
  let msg = document.createElement("div");

  msg.innerText = text;

  msg.style.position = "fixed";
  msg.style.top = "140px"; 
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "black";
  msg.style.color = "#fff";
  msg.style.padding = "10px 20px";
  msg.style.borderRadius = "5px";
  msg.style.zIndex = "1000";

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 1500); // 1.5 sec lo disappear
}

window.addEventListener("load", function () {
  updateTotal(); // 🔥 every page load lo run
});

window.removeItem = function (id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  delete cart[id];   // 🔥 item remove

  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();   // 🔥 reload cart
};