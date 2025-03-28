
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signinForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const apiErrorElement = document.getElementById('apiError');
    const successMessageElement = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    
    // Real-time validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearMessages();
        
        if (validateForm()) {
            try {
                // Show loading state
                submitBtn.disabled = true;
                loader.style.display = 'block';
                
                const response = await fetch('http://localhost:9090/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        password: passwordInput.value.trim(),
                        confirmPassword: confirmPasswordInput.value.trim()
                    })
                });

                // First check if response is empty
                const responseText = await response.text();
                
                if (!responseText) {
                    // Empty response but successful
                    if (response.ok) {
                        showSuccessMessage('Registration successful! You can now log in.');
                        form.reset();
                        return;
                    } else {
                        throw new Error('Registration failed with empty response');
                    }
                }
                
                // Try to parse as JSON
                try {
                    const result = JSON.parse(responseText);
                    
                    if (!response.ok) {
                        // Handle field-specific errors from backend
                        if (response.status === 400 && result.errors) {
                            Object.entries(result.errors).forEach(([field, message]) => {
                                const errorElement = document.getElementById(`${field}Error`);
                                if (errorElement) {
                                    errorElement.textContent = message;
                                    errorElement.style.display = 'block';
                                    document.getElementById(field).classList.add('error');
                                }
                            });
                            throw new Error('Please fix the form errors');
                        }
                        throw new Error(result.message || 'Registration failed');
                    }
                    
                    // Success case
                    showSuccessMessage(result.message || 'Registration successful! You can now log in.');
                    form.reset();
                    
                } catch (e) {
                    // Not JSON - treat as plain text response
                    if (response.ok) {
                        showSuccessMessage(responseText || 'Registration successful!');
                        form.reset();
                    } else {
                        throw new Error(responseText || 'Registration failed');
                    }
                }
                
            } catch (error) {
                console.error('Registration error:', error);
                showApiError(error.message);
            } finally {
                // Hide loading state
                submitBtn.disabled = false;
                loader.style.display = 'none';
            }
        }
    });
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailPattern.test(email);
        
        toggleError(emailInput, 'emailError', !isValid, 'Please enter a valid email address');
        return isValid;
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        const isValid = password.length >= 8;
        
        toggleError(passwordInput, 'passwordError', !isValid, 'Password must be at least 8 characters');
        return isValid;
    }
    
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const isValid = password === confirmPassword && password !== '';
        
        toggleError(confirmPasswordInput, 'confirmPasswordError', !isValid, 'Passwords do not match');
        return isValid;
    }
    
    function validateForm() {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        return isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }
    
    function toggleError(input, errorId, showError, message = '') {
        const errorElement = document.getElementById(errorId);
        
        if (showError) {
            input.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            input.classList.remove('error');
            errorElement.style.display = 'none';
        }
    }
    
    function showApiError(message) {
        apiErrorElement.textContent = message;
        apiErrorElement.style.display = 'block';
        successMessageElement.style.display = 'none';
    }
    
    function showSuccessMessage(message) {
        successMessageElement.textContent = message;
        successMessageElement.style.display = 'block';
        apiErrorElement.style.display = 'none';
    }
    
    function clearMessages() {
        apiErrorElement.style.display = 'none';
        successMessageElement.style.display = 'none';
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
});
