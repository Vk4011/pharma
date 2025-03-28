function logoutUser() {
    // Clear user session (if any)
    localStorage.removeItem("userToken"); // Example: If using localStorage for authentication
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "signin.html";
}

function clearPageStack() {
    setTimeout(() => {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, null, window.location.href);
        };
    }, 0);
}

window.onload = clearPageStack;