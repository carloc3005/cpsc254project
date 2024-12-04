document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElement = document.querySelector(".cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    const updateCartCount = () => {
        cartCountElement.textContent = cart.length;
    };

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const menuItem = button.closest(".menu-item");
            const name = menuItem.querySelector("h3").textContent;
            const description = menuItem.querySelector("p").textContent;
            const price = parseFloat(menuItem.querySelector(".price").textContent.replace("$", ""));

            if (!name || !description || isNaN(price)) {
                console.error("Incomplete item data. Skipping.");
                return;
            }

            // Add item to the cart (allow duplicates)
            cart.push({ name, description, price });
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        });
    });

    document.querySelector("#submit-order").addEventListener("click", async () => {
        try {
            const orderNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random order number
            const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
            const userName = localStorage.getItem("userName");
            const userPhone = localStorage.getItem("userPhone"); // Get the phone number from local storage

            console.log("User Name:", userName);
            console.log("User Phone:", userPhone);
            console.log("Order Data:", { orderNumber, items: cart, total, userName, userPhone });

            const response = await fetch("/submit-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderNumber, items: cart, total, userName, userPhone }) // Include userName and userPhone
            });

            const data = await response.json();

            if (data.success) {
                alert("Order submitted successfully!");
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
            } else {
                alert("Failed to submit the order.");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("An error occurred while submitting your order.");
        }
    });

    updateCartCount();
});
