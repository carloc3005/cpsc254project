document.addEventListener("DOMContentLoaded", () => {
    // Select important UI elements for displaying cart items and totals
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const salesTaxElement = document.getElementById("sales-tax");
    const totalElement = document.getElementById("total");

    // Define a constant sales tax rate
    const SALES_TAX_RATE = 0.0725;

    // Retrieve the current cart from localStorage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // A function to recalculate and update subtotal, tax, and total values
    const updateTotals = () => {
        const subtotal = cart.reduce((sum, item) => {
            let itemPrice = parseFloat(item.price);

            // Adjust the price if there's a topping that adds cost
            if (item.topping === "Boba" || item.topping === "Mini Boba") {
                itemPrice += 0.50; // Increase item cost by $0.50 when boba is selected
            }
            return sum + itemPrice;
        }, 0);

        const salesTax = subtotal * SALES_TAX_RATE;
        const total = subtotal + salesTax;

        // Update the displayed totals (checking if elements exist to avoid errors)
        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (salesTaxElement) salesTaxElement.textContent = salesTax.toFixed(2);
        if (totalElement) totalElement.textContent = total.toFixed(2);
    };

    // A function to render the list of items currently in the cart
    const renderCartItems = () => {
        // Clear the container before re-rendering
        cartItemsContainer.innerHTML = "";

        // If the cart is empty, display a message and update totals accordingly
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
            updateTotals();
            return;
        }

        // For each item in the cart, create a DOM structure and append it to the container
        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            // If any customization properties are missing, set them to defaults
            item.sugarLevel = item.sugarLevel || "100%";
            item.iceLevel = item.iceLevel || "Regular Ice";
            item.topping = item.topping || "No Boba";

            // Construct the inner HTML for each cart item, including customization controls
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Price:</strong> $${parseFloat(item.price).toFixed(2)}</p>
                    <div class="customization">
                        <!-- Sugar level customization -->
                        <div class="customization-option">
                            <label for="sugar-level-${index}">Sugar Level:</label>
                            <select id="sugar-level-${index}" data-index="${index}" class="sugar-level">
                                <option value="0%" ${item.sugarLevel === "0%" ? "selected" : ""}>0%</option>
                                <option value="25%" ${item.sugarLevel === "25%" ? "selected" : ""}>25%</option>
                                <option value="50%" ${item.sugarLevel === "50%" ? "selected" : ""}>50%</option>
                                <option value="75%" ${item.sugarLevel === "75%" ? "selected" : ""}>75%</option>
                                <option value="100%" ${item.sugarLevel === "100%" ? "selected" : ""}>100%</option>
                            </select>
                        </div>
                        
                        <!-- Ice level customization -->
                        <div class="customization-option">
                            <label for="ice-level-${index}">Ice Level:</label>
                            <select id="ice-level-${index}" data-index="${index}" class="ice-level">
                                <option value="No Ice" ${item.iceLevel === "No Ice" ? "selected" : ""}>No Ice</option>
                                <option value="Less Ice" ${item.iceLevel === "Less Ice" ? "selected" : ""}>Less Ice</option>
                                <option value="Regular Ice" ${item.iceLevel === "Regular Ice" ? "selected" : ""}>Regular Ice</option>
                                <option value="Extra Ice" ${item.iceLevel === "Extra Ice" ? "selected" : ""}>Extra Ice</option>
                            </select>
                        </div>
                        
                        <!-- Topping customization -->
                        <div class="customization-option">
                            <label for="topping-${index}">Topping:</label>
                            <select id="topping-${index}" data-index="${index}" class="topping">
                                <option value="No Boba" ${item.topping === "No Boba" ? "selected" : ""}>No Boba</option>
                                <option value="Boba" ${item.topping === "Boba" ? "selected" : ""}>Boba</option>
                                <option value="Mini Boba" ${item.topping === "Mini Boba" ? "selected" : ""}>Mini Boba</option>
                            </select>
                        </div>
                    </div>
                    <button class="delete-button" data-index="${index}">🗑️ Delete</button>
                </div>
            `;

            // Append the constructed cart item to the container
            cartItemsContainer.appendChild(cartItem);
        });

        // Once all items are rendered, update the totals and attach customization listeners
        updateTotals();
        addCustomizationListeners();
    };

    // A function to attach event listeners to customization dropdowns
    const addCustomizationListeners = () => {
        // Grab all select elements for sugar, ice, and toppings
        const sugarSelects = document.querySelectorAll(".sugar-level");
        const iceSelects = document.querySelectorAll(".ice-level");
        const toppingSelects = document.querySelectorAll(".topping");

        // Update the cart and localStorage whenever sugar level changes
        sugarSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                cart[index].sugarLevel = e.target.value;
                localStorage.setItem("cart", JSON.stringify(cart));
            });
        });

        // Update the cart and localStorage whenever ice level changes
        iceSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                cart[index].iceLevel = e.target.value;
                localStorage.setItem("cart", JSON.stringify(cart));
            });
        });

        // Update the cart, localStorage, and totals whenever topping changes (since it affects price)
        toppingSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                cart[index].topping = e.target.value;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateTotals();
            });
        });
    };

    // Handle the deletion of cart items
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-button")) {
                const index = e.target.dataset.index;
                // Remove the selected item from the cart array
                cart.splice(index, 1);
                // Update the cart in localStorage
                localStorage.setItem("cart", JSON.stringify(cart));
                // Re-render the updated cart
                renderCartItems();
            }
        });
    } else {
        console.error('Cart items container not found');
    }

    // Handle the checkout process
    const checkoutButton = document.getElementById("checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            // If the cart is empty, alert the user and abort
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // Generate a random 4-digit order number
            const orderNumber = Math.floor(1000 + Math.random() * 9000);
            console.log("Generated Order Number:", orderNumber);

            // Safely extract the total amount from the DOM
            let totalAmount = 0;
            if (totalElement) {
                totalAmount = parseFloat(totalElement.textContent);
            } else {
                console.error("Total element not found");
                alert('There was an error processing your order. Please try again.');
                return;
            }

            // Build the order data object to send to the server
            const orderData = {
                orderNumber,
                items: cart,
                total: totalAmount,
            };

            // Send the order data to the server for processing
            fetch('/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Server response:', data);
                    // If the server indicates success, clear the cart and redirect to confirmation page
                    if (data.success) {
                        localStorage.removeItem('cart');
                        window.location.href = `confirmation.html?orderNumber=${orderNumber}`;
                    } else {
                        alert('There was an error processing your order. Please try again.');
                    }
                })
                .catch(error => {
                    // Log errors for debugging
                    console.error('Error:', error);
                    // For testing or fallback scenario, redirect even on error
                    window.location.href = `confirmation.html?orderNumber=${orderNumber}`;
                });
        });
    } else {
        console.error('Checkout button not found');
    }

    // Render the cart items when the page loads
    renderCartItems();
});
