document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the cart from localStorage if it exists; otherwise, start with an empty cart.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Grab DOM elements for displaying cart count and "Add to Cart" buttons.
    const cartCountElement = document.querySelector(".cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    // A helper function to update the displayed cart count.
    const updateCartCount = () => {
        // Keep the cart count up-to-date with the length of the cart array.
        cartCountElement.textContent = cart.length;
    };

    // Attach click event listeners to all "Add to Cart" buttons.
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Find the closest parent element containing the menu item details.
            const menuItem = button.closest(".menu-item");

            // Extract necessary data: name, description, and price of the item.
            const name = menuItem.querySelector("h3").textContent;
            const description = menuItem.querySelector("p").textContent;
            const priceText = menuItem.querySelector(".price").textContent.replace("$", "");
            const price = parseFloat(priceText);

            // If any required data is missing or the price is invalid, log an error and skip adding the item.
            if (!name || !description || isNaN(price)) {
                console.error("Incomplete item data. Skipping.");
                return;
            }

            // Add the selected item to the cart. Duplicates are allowed as per current logic.
            cart.push({ name, description, price });

            // Save the updated cart to localStorage so it persists across page refreshes.
            localStorage.setItem("cart", JSON.stringify(cart));

            // Update the cart count in the UI.
            updateCartCount();
        });
    });

    // Event listener for the "Submit Order" button.
    document.querySelector("#submit-order").addEventListener("click", async () => {
        try {
            // Generate a random 4-digit order number for demonstration purposes.
            const orderNumber = Math.floor(1000 + Math.random() * 9000);

            // Compute the total price of all items in the cart.
            const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

            // Retrieve the user's name and phone number from localStorage.
            // Presumably stored earlier during a checkout form process.
            const userName = localStorage.getItem("userName");
            const userPhone = localStorage.getItem("userPhone");

            // Log the order details to the console for debugging.
            console.log("User Name:", userName);
            console.log("User Phone:", userPhone);
            console.log("Order Data:", { orderNumber, items: cart, total, userName, userPhone });

            // Send the order data to the server endpoint "/submit-order".
            // Ensure the server is expecting a JSON body with this structure.
            const response = await fetch("/submit-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderNumber, items: cart, total, userName, userPhone })
            });

            // Parse the server's response as JSON.
            const data = await response.json();

            // If the server indicates success, show a success alert and clear the cart.
            if (data.success) {
                alert("Order submitted successfully!");
                cart = []; // Reset the cart array
                localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage to empty
                updateCartCount(); // Reflect that the cart is empty
            } else {
                // If not successful, notify the user.
                alert("Failed to submit the order.");
            }
        } catch (error) {
            // If any error occurs (network issues, server errors, etc.), log it and notify the user.
            console.error("Error submitting order:", error);
            alert("An error occurred while submitting your order.");
        }
    });

    // Initial update of the cart count to ensure the UI reflects the current state from localStorage.
    updateCartCount();
});
