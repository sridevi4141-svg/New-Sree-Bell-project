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


// 🔥 ADD PRODUCT
window.addProduct = async function () {
  let name = document.getElementById("newName").value;
  let price = document.getElementById("newPrice").value;
  let image = document.getElementById("newImage").value;
  let weight = document.getElementById("newWeight").value;
  let category = document.getElementById("category").value;
  let stock = document.getElementById("stock").value;

  if (!name || !price || !image || !weight) {
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db, "products"), {
    name: name,
    price: Number(price),
    image: image,
    weight: Number(weight),
    category: category,   // 🔥 MOST IMPORTANT
    stock: stock 
  });

  alert("Product Added ✅");
  loadProducts();
};


// 🔥 LOAD PRODUCTS
async function loadProducts() {
  let data = await getDocs(collection(db, "products"));
  let container = document.getElementById("productList");

  container.innerHTML = "";

  data.forEach((docSnap) => {
    let p = docSnap.data();
    let id = docSnap.id;

    container.innerHTML += `
      <div style="border:1px solid black; margin:10px; padding:10px;">
        <p><b>${p.name}</b></p>
        <p>Price: ₹${p.price}</p>
        <p>Category: ${p.category}</p>

        <input id="price-${id}" type="number" placeholder="New Price">

        <button onclick="updatePrice('${id}','price-${id}')">Update</button>

        <button onclick="deleteProduct('${id}')">Delete</button>
      </div>
    `;
  });
}


// 🔥 UPDATE PRICE
window.updatePrice = async function (id, inputId) {
  let price = document.getElementById(inputId).value;

  if (!price) {
    alert("Enter price");
    return;
  }

  await updateDoc(doc(db, "products", id), {
    price: Number(price)
  });

  alert("Updated ✅");
  loadProducts();
};


// 🔥 DELETE PRODUCT
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  alert("Deleted ❌");
  loadProducts();
};


// 🔥 LOAD ON START
loadProducts();