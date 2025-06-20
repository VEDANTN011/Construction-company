function showLoginForm() {
    document.getElementById("loginPopup").style.display = "flex";
   
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