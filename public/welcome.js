document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("user-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        // Save user info in local storage
        localStorage.setItem("userName", name);
        localStorage.setItem("userPhone", phone);

        // Redirect to main page
        window.location.href = "main.html";
    });
});
