document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElement = document.querySelector(".cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    const updateCartCount = () => {
        cartCountElement.textContent = cart.length;
    };

    addToCartButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const menuItem = button.closest(".menu-item");
            const name = menuItem.querySelector("h3").textContent;
            const description = menuItem.querySelector("p").textContent;
            const price = menuItem.querySelector(".price").textContent.replace("$", "");

            // Add item to the cart
            cart.push({ name, description, price });
            localStorage.setItem("cart", JSON.stringify(cart));

            updateCartCount();
        });
    });

    updateCartCount();
});
