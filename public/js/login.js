async function handleLogin(event) {
    event.preventDefault();
    
    // Clear previous error messages
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
    
    // Get form data
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    // Basic validation
    if (!formData.email || !formData.password) {
        showError('Email and password are required');
        return false;
    }
    
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Login failed');
            return false;
        }
        
        // Login successful - redirect to home
        window.location.href = '/dashboard';
    } catch (error) {
        showError('An error occurred during login');
        return false;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
