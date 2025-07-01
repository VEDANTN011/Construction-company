function showLoginForm() {
    document.getElementById("loginPopup").style.display = "flex";
    document.getElementById("registerPopup").style.display = "none";
}

function hideLoginForm() {
    document.getElementById("loginPopup").style.display = "none";
}

function showRegisterForm() {
    document.getElementById("registerPopup").style.display = "flex";
    document.getElementById("loginPopup").style.display = "none";
}

function hideRegisterForm() {
    document.getElementById("registerPopup").style.display = "none";
}

// ✅ LOGIN
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (!user || !pass) {
        document.getElementById("loginMessage").textContent = "Please enter both username and password.";
        return;
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "success") {
            alert(`Welcome back, ${data.user.username}!`);
            document.getElementById("loginMessage").textContent = "";
            hideLoginForm();

            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            showLoggedInUser(data.user);
        } else {
            document.getElementById("loginMessage").textContent = data.message;
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        document.getElementById("loginMessage").textContent = "Login failed.";
    });
}

// ✅ Show logged in user
function showLoggedInUser(user) {
    const welcome = document.getElementById("welcomeUser");
    welcome.innerText = `Welcome, ${user.username}`;
    welcome.style.display = "block";

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    const postContainer = document.getElementById("userPosts");
    postContainer.innerHTML = "";

    if (!user.posts || user.posts.length === 0) {
    postContainer.style.display = "none"; // hide container if no posts
} else {
    postContainer.style.display = "block"; // make sure it's visible
    user.posts.forEach(post => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p><hr>`;
        postContainer.appendChild(div);
    });
}

}

// ✅ Logout
function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    location.reload();
}

// ✅ REGISTER
function register() {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    if (!username || !email || !password || !confirmPassword) {
        document.getElementById("registerMessage").textContent = "All fields are required.";
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById("registerMessage").textContent = "Passwords do not match.";
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "success") {
            alert(`${data.username}, you have registered successfully!`);
            hideRegisterForm();
            showLoginForm();
        } else {
            document.getElementById("registerMessage").textContent = data.message;
        }
    })
    .catch(err => {
        console.error("Registration error:", err);
        document.getElementById("registerMessage").textContent = "Error registering.";
    });
}

// ✅ Animate stats
function animateCounter(id, target, duration) {
    const el = document.getElementById(id);
    let count = 0;
    const step = Math.ceil(target / (duration / 50)); // Updates every 50ms
    const interval = setInterval(() => {
        count += step;
        if (count >= target) {
            el.textContent = target;
            clearInterval(interval);
        } else {
            el.textContent = count;
        }
    }, 50);
}

// ✅ Run on page load
window.onload = function () {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        showLoggedInUser(JSON.parse(savedUser));
    }

    animateCounter("experience", 20, 2000);
    animateCounter("projects", 150, 2000);
    animateCounter("machineries", 30, 2000);
};

// ✅ Handle Career Form submission
const form = document.getElementById('careerForm');
if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message || 'Application submitted successfully', 'success');
                form.reset();
            } else {
                showMessage(data.message || 'Failed to submit application.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        }
    });


    function showMessage(msg, type) {
        let existingMsg = document.getElementById('formMessage');
        if (existingMsg) existingMsg.remove();

        const messageElem = document.createElement('div');
        messageElem.id = 'formMessage';
        messageElem.textContent = msg;
        messageElem.style.marginTop = '15px';
        messageElem.style.padding = '10px';
        messageElem.style.borderRadius = '5px';
        messageElem.style.fontWeight = 'bold';

        if (type === 'success') {
            messageElem.style.color = '#155724';
            messageElem.style.backgroundColor = '#d4edda';
            messageElem.style.border = '1px solid #c3e6cb';
        } else {
            messageElem.style.color = '#721c24';
            messageElem.style.backgroundColor = '#f8d7da';
            messageElem.style.border = '1px solid #f5c6cb';
        }

        form.appendChild(messageElem);
    }
}
