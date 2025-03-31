document.addEventListener("DOMContentLoaded", () => {
    const adminContainer = document.getElementById("adminContainer");
    const dashboard = document.getElementById("dashboard");
    const logoutBtn = document.getElementById("logoutBtn");
    const statusSpan = document.querySelector(".admin-info .status"); // Status text

    // Function to update status text
    function updateStatus(isLoggedIn) {
        if (isLoggedIn) {
            statusSpan.textContent = "Logged In successfully";
            statusSpan.classList.add("online");
            statusSpan.classList.remove("offline");
        } else {
            statusSpan.textContent = "Logged Out";
            statusSpan.classList.add("offline");
            statusSpan.classList.remove("online");
        }
    }

    // Check if admin is logged in (fixes automatic login issue)
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

    if (isLoggedIn) {
        showAdminDashboard();
    } else {
        updateStatus(false); // Set status to "Logged Out"
        adminContainer.style.display = "block"; // Ensure login form is visible
        dashboard.style.display = "none"; // Hide dashboard initially
    }

    document.getElementById("loginBtn").addEventListener("click", () => {
        const adminUser = document.getElementById("adminUser").value.trim();
        const adminPass = document.getElementById("adminPass").value.trim();
        const loginMessage = document.getElementById("loginMessage");

        // Hardcoded credentials (Replace with real authentication)
        if (adminUser === "admin" && adminPass === "password123") {
            loginMessage.textContent = "✅ Login successful!";
            loginMessage.style.color = "green";

            // Store login state in localStorage
            localStorage.setItem("isAdminLoggedIn", "true");

            // Show the dashboard & hide login form
            showAdminDashboard();
        } else {
            loginMessage.textContent = "❌ Wrong credentials!";
            loginMessage.style.color = "red";
        }
    });

    // Function to show admin dashboard & hide login form
    function showAdminDashboard() {
        adminContainer.style.display = "none";
        dashboard.style.display = "block";
        updateStatus(true); // Set status to "Logged In"
    }

    // Logout Functionality
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isAdminLoggedIn");
        updateStatus(false); // Set status to "Logged Out"
        adminContainer.style.display = "block"; // Show login form again
        dashboard.style.display = "none"; // Hide dashboard
    });

    // Hall & Capacity Input
    document.getElementById("submitHallBtn").addEventListener("click", async () => {
        const hallNumber = document.getElementById("hallNumber").value.trim();
        const hallCapacity = document.getElementById("hallCapacity").value.trim();

        if (!hallNumber || !hallCapacity || isNaN(hallNumber) || isNaN(hallCapacity) || hallNumber <= 0 || hallCapacity <= 0) {
            alert("⚠️ Please enter a valid hall number and capacity.");
            return;
        }

        try {
            const response = await fetch("https://seatallocation.onrender.com/setHallCapacity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hallNumber: Number(hallNumber), hallCapacity: Number(hallCapacity) })
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Hall and Capacity Set Successfully!");
            } else {
                alert(`⚠️ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error setting hall capacity:", error);
            alert("❌ Failed to set hall capacity. Check console.");
        }
    });

    // CSV Upload
    document.getElementById("uploadForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById("csvFile");
        const messageElement = document.getElementById("message");

        if (!fileInput.files.length) {
            messageElement.textContent = "⚠️ Please select a CSV file first.";
            messageElement.style.color = "red";
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch("https://seatallocation.onrender.com/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            messageElement.textContent = response.ok ? "✅ File uploaded and processed!" : `⚠️ Error: ${data.message}`;
            messageElement.style.color = response.ok ? "green" : "red";
        } catch (error) {
            console.error("Error:", error);
            messageElement.textContent = "❌ Failed to upload. Check console.";
            messageElement.style.color = "red";
        }
    });

    // Send Emails Button
    document.getElementById("sendEmailsBtn").addEventListener("click", async () => {
        try {
            const response = await fetch("https://seatallocation.onrender.com/sendEmails", { method: "POST" });
            const data = await response.json();
            alert(response.ok ? "✅ Emails sent successfully!" : `⚠️ Error: ${data.message}`);
        } catch (error) {
            console.error("Error sending emails:", error);
            alert("❌ Failed to send emails. Check console.");
        }
    });

    // Download CSV Button
    document.getElementById("downloadBtn").addEventListener("click", () => {
        setTimeout(() => {
            window.location.href = "https://seatallocation.onrender.com/download";
        }, 500);
    });
});
