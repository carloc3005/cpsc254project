document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const salesTaxElement = document.getElementById("sales-tax");
    const totalElement = document.getElementById("total");

    const SALES_TAX_RATE = 0.0725;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const updateTotals = () => {
        const subtotal = cart.reduce((sum, item) => {
            let itemPrice = parseFloat(item.price);
            // Add cost for toppings if applicable
            if (item.topping === "Boba" || item.topping === "Mini Boba") {
                itemPrice += 0.50; // Adjust the price as needed
            }
            return sum + itemPrice;
        }, 0);

        const salesTax = subtotal * SALES_TAX_RATE;
        const total = subtotal + salesTax;

        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (salesTaxElement) salesTaxElement.textContent = salesTax.toFixed(2);
        if (totalElement) totalElement.textContent = total.toFixed(2);
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
            updateTotals();
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            // Set default values if not already present
            item.sugarLevel = item.sugarLevel || "100%";
            item.iceLevel = item.iceLevel || "Regular Ice";
            item.topping = item.topping || "No Boba";

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Price:</strong> $${parseFloat(item.price).toFixed(2)}</p>

                    <div class="customization">
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
                        <div class="customization-option">
                            <label for="ice-level-${index}">Ice Level:</label>
                            <select id="ice-level-${index}" data-index="${index}" class="ice-level">
                                <option value="No Ice" ${item.iceLevel === "No Ice" ? "selected" : ""}>No Ice</option>
                                <option value="Less Ice" ${item.iceLevel === "Less Ice" ? "selected" : ""}>Less Ice</option>
                                <option value="Regular Ice" ${item.iceLevel === "Regular Ice" ? "selected" : ""}>Regular Ice</option>
                                <option value="Extra Ice" ${item.iceLevel === "Extra Ice" ? "selected" : ""}>Extra Ice</option>
                            </select>
                        </div>
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

            cartItemsContainer.appendChild(cartItem);
        });

        updateTotals();
        addCustomizationListeners();
    };

    const addCustomizationListeners = () => {
        const sugarSelects = document.querySelectorAll(".sugar-level");
        const iceSelects = document.querySelectorAll(".ice-level");
        const toppingSelects = document.querySelectorAll(".topping");

        sugarSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                cart[index].sugarLevel = e.target.value;
                localStorage.setItem("cart", JSON.stringify(cart));
            });
        });

        iceSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                cart[index].iceLevel = e.target.value;
                localStorage.setItem("cart", JSON.stringify(cart));
            });
        });

        toppingSelects.forEach(select => {
            select.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                cart[index].topping = e.target.value;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateTotals(); // Update totals if topping affects price
            });
        });
    };

    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-button")) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
        }
    });

    renderCartItems();
});
