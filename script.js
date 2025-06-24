function showLoginForm() {
    document.getElementById("loginPopup").style.display = "flex";
     document.getElementById("registerPopup").style.display = "none";
}

function hideLoginForm() {
    document.getElementById("loginPopup").style.display = "none";
    
}

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        alert("Login successful!");
        hideLoginForm();
    } else {
        document.getElementById("loginMessage").textContent = "Invalid username or password";
        
    }
    
}

function showRegisterForm() {
    document.getElementById("registerPopup").style.display = "flex";
    document.getElementById("loginPopup").style.display = "none";
}

function hideRegisterForm() {
    document.getElementById("registerPopup").style.display = "none";
}

function register() {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    if (!username || !email || !password || !confirmPassword) {
        document.getElementById("registerMessage").textContent = "All fields are required.";
    } else if (password !== confirmPassword) {
        document.getElementById("registerMessage").textContent = "Passwords do not match.";
    } else {
        alert("Registration successful!");
        hideRegisterForm();
        showLoginForm();
    }
}



