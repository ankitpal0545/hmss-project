const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

if (getUser()) {
    location.replace("dashboard.html");
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    loginError.textContent = "";

    const btn = loginForm.querySelector("button[type=submit]");
    btn.disabled = true;

    try {
        const user = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                username: document.getElementById("username").value.trim(),
                password: document.getElementById("password").value
            })
        });
        saveUser(user, document.getElementById("remember").checked);
        location.href = "dashboard.html";
    } catch (error) {
        loginError.textContent = error.message;
    } finally {
        btn.disabled = false;
    }
});

document.getElementById("forgotLink").addEventListener("click", e => {
    e.preventDefault();
    showToast("Please contact the system administrator");
});
