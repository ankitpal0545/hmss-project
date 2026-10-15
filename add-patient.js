const patientForm = document.getElementById("patientForm");
const message = document.getElementById("message");

patientForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    message.textContent = "";
    message.className = "form-message";

    const patientData = {
        name: document.getElementById("name").value.trim(),
        age: Number(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        blood_group: document.getElementById("blood_group").value
    };

    try {
        await apiRequest("/patients", {
            method: "POST",
            body: JSON.stringify(patientData)
        });
        message.textContent = "Patient added successfully!";
        message.classList.add("ok");
        patientForm.reset();
    } catch (error) {
        message.textContent = "Error: " + error.message;
        message.classList.add("fail");
    }
});
