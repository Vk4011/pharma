document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const apiErrorElement = document.getElementById('apiError');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearErrors();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!validateEmail(email) || !password) {
            if (!validateEmail(email)) {
                showFieldError(emailInput, 'emailError', 'Please enter a valid email address');
            }
            if (!password) {
                showFieldError(passwordInput, 'passwordError', 'Password is required');
            }
            return;
        }

        try {
            // Show loading state
            loginButton.disabled = true;
            loginButton.innerHTML = '<span class="loading"></span> Logging in...';
            
            console.log('Attempting login with:', { email, password });
            
            const response = await fetch('http://localhost:9090/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('Response status:', response.status);
            
            // Clone the response to read it multiple times if needed
            const responseClone = response.clone();
            
            try {
                // First try to parse as JSON
                const data = await response.json();
                
                if (response.ok) {
                    // Successful login
                    handleSuccessfulLogin(data);
                } else {
                    // Handle server error messages
                    throw new Error(data.message || 'Login failed');
                }
            } catch (jsonError) {
                console.log('JSON parse failed, trying text:', jsonError);
                
                // If JSON parsing fails, try to read as text
                const text = await responseClone.text();
                
                // Try to handle common error patterns
                if (text.includes('Unauthorized') || response.status === 401) {
                    throw new Error('Invalid email or password');
                } else if (text) {
                    throw new Error(text);
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            handleLoginError(error);
        } finally {
            // Reset button state
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });

    function handleSuccessfulLogin(data) {
        // Store token if available
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        
        // Redirect to home or specified URL
        const redirectUrl = data.redirectUrl || 'http://127.0.0.1:5500/src/view/home.html';
        console.log('Login successful, redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
    }

    function handleLoginError(error) {
        let errorMessage = error.message || 'Login failed. Please try again.';
        
        // Special handling for common errors
        if (error.message.includes('Invalid email or password')) {
            showFieldError(emailInput, 'emailError', '');
            showFieldError(passwordInput, 'passwordError', errorMessage);
        } else if (error.message.toLowerCase().includes('network error')) {
            errorMessage = 'Network error. Please check your connection.';
        }
        
        showApiError(errorMessage);
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    function showFieldError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function showApiError(message) {
        apiErrorElement.textContent = message;
        apiErrorElement.style.display = 'block';
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        apiErrorElement.style.display = 'none';
    }

    // Clear page stack for navigation
    function clearPageStack() {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function() {
            window.history.pushState(null, null, window.location.href);
        };
    }
    
    clearPageStack();
});
