document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("user-form");

    // Listening for the form's submit event to handle user input.
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevents the default form submission behavior (page reload).

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;

        // Store the user’s name and phone number in the browser’s localStorage.
        // This allows data to persist even after the page is closed or refreshed.
        localStorage.setItem("userName", name);
        localStorage.setItem("userPhone", phone);

        // After successfully storing the data, redirect the user to the main page.
        // This enhances the flow: the user first enters their details, then moves on to the main ordering interface.
        window.location.href = "main.html";
    });
});
