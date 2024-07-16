// Get all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Add event listener to each button
addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});

function addToCart(event) {
    try {
      const productContainer = event.target.closest(".product");
      if (!productContainer) {
        throw new Error("Product container not found!");
      }
  
      const productName = productContainer.querySelector(".product-info h2").textContent;
      const productPrice = parseFloat(productContainer.querySelector(".product-pricing p").textContent.replace("$", ""));
      const productSize = productContainer.querySelector(".product-options select#size").value;
      const productQuantity = parseInt(productContainer.querySelector(".product-options input#quantity").value);
  
      if (!productSize || productQuantity <= 0) {
        throw new Error("Invalid product size or quantity!");
      }
  
      const cartItem = {
        id: Math.random().toString(36).substr(2, 9), // generate a unique ID for each item
        name: productName,
        price: productPrice, // ensure the price is set correctly
        size: productSize,
        quantity: productQuantity,
      };
  
      // Check if the product is already in the cart
      const existingItem = cart.items.find((item) => item.name === cartItem.name && item.size === cartItem.size);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        cart.items.push(cartItem);
      }
  
      cart.totalCount += cartItem.quantity;
      cart.totalCost += cartItem.price * cartItem.quantity;
  
      updateCartDisplay();
  
      // Save the cart to local storage
      localStorage.setItem("cart", JSON.stringify(cart));
  
      console.log(`Product added to cart: ${productName} (${productSize}) x ${productQuantity}`);
    } catch (error) {
      console.error(`Error adding product to cart: ${error.message}`);
    }
  }

// Define the cart object
let cart = {
  items: [],
  totalCount: 0,
  totalCost: 0.0,
};

// Load the cart from local storage
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  cart.totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalCost = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0.0);
}

// Define the updateCartDisplay function
function updateCartDisplay() {
  const cartCountElement = document.getElementById("cart-count");
  const totalCostElement = document.getElementById("total-cost");
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");

  cartCountElement.textContent = `${cart.totalCount}`;
  totalCostElement.textContent = `$${cart.totalCost.toFixed(2)}`;

  let subtotal = 0;
  cartItemsContainer.innerHTML = "";

  cart.items.forEach((item) => {
    const cartItemHtml = `
      <tr>
        <td>${item.name} (${item.size})</td>
        <td>${item.quantity}</td>
        <td>$${item.price}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button class="remove-item-btn" data-item-id="${item.id}">X</button>
        </td>
      </tr>
    `;

    const newRow = document.createElement("tr");
    newRow.innerHTML = cartItemHtml;
    cartItemsContainer.appendChild(newRow);

    subtotal += item.price * item.quantity;
  });

  subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

  // Add event listener to remove buttons
  cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item-btn")) {
      const itemId = event.target.getAttribute("data-item-id");
      const itemIndex = cart.items.findIndex((item) => item.id === itemId);
      if (itemIndex!== -1) {
        cart.items.splice(itemIndex, 1);
        updateCartDisplay(); // Update the cart display after removing the item
        localStorage.setItem("cart", JSON.stringify(cart)); // Update local storage
      }
    }
  });
}