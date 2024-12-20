/*
This script is intended to handle the user registration
*/

async function handleRegister(event) {
    event.preventDefault();
    
    // Clear previous error messages
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
        showError('All fields are required');
        return false;
    }
    
    if (formData.password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }
    
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Registration failed');
            return false;
        }
        
        // Registration successful - redirect to login
        window.location.href = '/auth/login';
    } catch (error) {
        showError('An error occurred during registration');
        return false;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
