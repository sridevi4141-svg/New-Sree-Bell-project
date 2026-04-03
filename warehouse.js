import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc,
  onSnapshot   // ✅ add this
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
// warehouse.js


// 🔥 IMPORTANT: Page open ఉండాలి
console.log("Warehouse listening...");

// 🔥 Listen orders
onSnapshot(collection(db, "orders"), (snapshot) => {

  snapshot.docChanges().forEach((change) => {

    console.log("Change type:", change.type); // debug

    if (change.type === "added") {

      const data = change.doc.data();

      printOrder(data);
    }

  });

});

// 🔥 Print function
function printOrder(data) {

  let items = "";

  let list = data.items || data.cart || [];

  list.forEach(item => {
    items += `<li>${item.name} - ${item.bags} bags - ₹${item.total}</li>`;
  });

  let html = `
    <div style="font-family:Arial;">
      <h2>SREE BELL RICE</h2>
      <hr>
      <p><b>Phone:</b> ${data.phone}</p>
      <ul>${items}</ul>
      <hr>
      <h3>Total: ₹${data.total || data.totalAmount}</h3>
      <p>Thank You 🙏</p>
    </div>
  `;

  let div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);

  window.print();

  document.body.removeChild(div);
}
