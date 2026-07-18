// עדכון מספר פריטים על אייקון הסל
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (total > 0) {
    badge.textContent = total > 9 ? "9+" : total;
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

// הצטרפות לניוזלטר
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const form = document.getElementById("newsletterForm");
  const input = document.getElementById("emailInput");
  const message = document.getElementById("successMessage");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value.trim() !== "") {
        message.classList.remove("hidden");
        message.classList.add("show");
        input.value = "";
        setTimeout(() => {
          message.classList.remove("show");
          message.classList.add("hidden");
        }, 2500);
      }
    });
  }
});

// הוספה לסל
const buttons = document.querySelectorAll(".add-to-cart");
const msg = document.getElementById("cart-message");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    const price = Number(button.dataset.price);
    const image = button.dataset.image;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();

    if (msg) {
      msg.innerText = `✅ ${name} נוסף לסל בהצלחה!`;
      msg.style.display = "block";
      setTimeout(() => { msg.style.display = "none"; }, 2000);
    }
  });
});

// שליחת הזמנה – מנקה את הסל ומאפשר לטופס לנווט לדף ההצלחה
function submitOrder(_event) {
  localStorage.removeItem("cart");
}

// סל קניות
if (window.location.pathname.includes("cart.html")) {
  const container = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const orderForm = document.getElementById("orderForm");

  function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      container.innerHTML = "<h3>הסל עדיין ריק... הוסיפו פריטים לסל כדי לבצע הזמנה 🌾</h3>";
      totalPriceElement.textContent = "";
      if (orderForm) orderForm.style.display = "none";
      return;
    }

    if (orderForm) {
      orderForm.style.display = "flex";
      orderForm.style.flexDirection = "column";
      orderForm.style.alignItems = "center";
    }

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-row");

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="90">
        <div class="cart-info">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">${item.price} ₪ × ${item.quantity}</p>
        </div>
        <div class="cart-buttons">
          <button class="increase">+</button>
          <button class="decrease">−</button>
          <button class="remove">🗑</button>
        </div>
      `;

      div.querySelector(".increase").addEventListener("click", () => {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
        renderCart();
      });

      div.querySelector(".decrease").addEventListener("click", () => {
        if (item.quantity > 1) item.quantity--;
        else cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
        renderCart();
      });

      div.querySelector(".remove").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
        renderCart();
      });

      container.appendChild(div);
    });

    totalPriceElement.textContent = `סה״כ לתשלום: ${total} ₪`;
  }

  renderCart();
}
