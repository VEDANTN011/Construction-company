// ✅ Show logged-in username and optional posts


console.log("auth.js loaded");

function showLoggedInUser(user) {
    const welcome = document.getElementById("welcomeUser");
    if (welcome) {
        welcome.innerText = `Welcome, ${user.username}`;
        welcome.style.display = "block";
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
    }

    const postContainer = document.getElementById("userPosts");
    if (postContainer) {
        postContainer.innerHTML = "";

        if (!user.posts || user.posts.length === 0) {
            postContainer.innerHTML = "<p>No posts yet.</p>";
        } else {
            user.posts.forEach(post => {
                const div = document.createElement("div");
                div.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p><hr>`;
                postContainer.appendChild(div);
            });
        }
    }
}

// ✅ Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    location.reload(); // or redirect to login page
}

// ✅ Load user on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showLoggedInUser(user);
    }
});
