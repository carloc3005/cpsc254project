document.addEventListener("DOMContentLoaded", () => {
    // Get the order number from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('orderNumber');

    // Display the order number
    const orderNumberElement = document.getElementById('order-number');
    orderNumberElement.textContent = orderNumber;
});
