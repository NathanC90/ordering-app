import menuArray from "./data.js";

// DOM Elements
const modalEl = document.querySelector(".modal-section");
const orderSection = document.querySelector(".order-section");
const orderItemsContainer = document.createElement("div");
const containerSection = document.querySelector(".container");
const form = document.querySelector("#form");
const purchaseBtn = document.querySelector("#purchase-btn");
const purchaseSection = document.querySelector(".purchase-section");
const purchasedMsg = document.querySelector(".purchased");
const cardNumberInput = document.querySelector("#card-number");

// Initialize order items container
orderSection.insertBefore(
  orderItemsContainer,
  orderSection.querySelector("hr")
);

// State Variables
let orderList = [];
let totalPrice = 0;

// Event Listeners
purchaseBtn.addEventListener("click", showModal);
form.addEventListener("submit", completePurchase);
cardNumberInput.addEventListener("input", (e) => {
  const value = e.target.value.replace(/\D/g, "");
  const formattedValue = value.match(/.{1,4}/g)?.join("-") || "";
  e.target.value = formattedValue;
});

// Functions
function showModal() {
  if (orderList.length === 0) return;
  modalEl.classList.remove("hidden");
}

function completePurchase(e) {
  e.preventDefault();
  modalEl.classList.add("hidden");
  purchaseSection.classList.add("hidden");
  orderSection.classList.add("hidden");
  purchasedMsg.classList.remove("hidden");
}

function renderMenu() {
  const menuItemsHTML = menuArray.map(createMenuItemHTML).join("");
  containerSection.innerHTML = menuItemsHTML;
  attachMenuItemEventListeners();
}

function createMenuItemHTML(item) {
  return `
        <div class="item">
            <p class="emoji">${item.emoji}</p>
            <div class="item-container">
                <h2 class="item-name">${item.name}</h2>
                <p class="ingredients">${item.ingredients.join(", ")}</p>
                <p class="price">$${item.price}</p>
            </div>
            <button type="button" class="add" id="add-${item.name}">+</button>
        </div>
    `;
}

function attachMenuItemEventListeners() {
  menuArray.forEach((item) => {
    const addButton = document.getElementById(`add-${item.name}`);
    addButton.addEventListener("click", () => addToOrder(item));
  });
}

function addToOrder(item) {
  orderSection.classList.remove("hidden");

  const existingItem = orderList.find(
    (orderItem) => orderItem.name === item.name
  );
  if (existingItem) {
    existingItem.quantity++;
  } else {
    orderList.push({ ...item, quantity: 1 });
  }

  updateOrderSection();
}

function updateOrderSection() {
  orderItemsContainer.innerHTML = "";
  totalPrice = 0;

  orderList.forEach(renderOrderItem);
  updateTotalPrice();

  if (orderList.length === 0) {
    orderSection.classList.add("hidden");
  }
}

function renderOrderItem(orderItem) {
  totalPrice += orderItem.price * orderItem.quantity;

  const orderItemElement = document.createElement("div");
  orderItemElement.classList.add("order-item");
  orderItemElement.innerHTML = `
        <h3>${orderItem.name} x${orderItem.quantity}</h3>
        <p class="remove" id="remove-${orderItem.name}">remove</p>
        <p class="price">$${orderItem.price * orderItem.quantity}</p>
    `;

  const removeButton = orderItemElement.querySelector(
    `#remove-${orderItem.name}`
  );
  removeButton.addEventListener("click", () => removeFromOrder(orderItem.name));
  orderItemsContainer.appendChild(orderItemElement);
}

function updateTotalPrice() {
  const totalPriceElement = orderSection.querySelector(".total-price .price");
  totalPriceElement.textContent = `$${totalPrice}`;
}

function removeFromOrder(itemName) {
  orderList = orderList.filter((orderItem) => orderItem.name !== itemName);
  updateOrderSection();
}

// Initial Render
renderMenu();
