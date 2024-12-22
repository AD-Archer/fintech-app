/*
This script is intended to handle the user registration
*/

async function handleRegister(event) {
    event.preventDefault();
    
    // Clear previous error messages
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
    errorDiv.textContent = ''; // Clear previous error messages
    
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
            // Show error messages from the server
            const errors = data.errors.map(err => err.msg).join(', ');
            showError(errors || 'Registration failed');
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
    errorDiv.textContent = message; // Set the error message
    errorDiv.style.display = 'block'; // Show the error message
}

// Attach the handleRegister function to the form submission
document.getElementById('registration-form').addEventListener('submit', handleRegister);
