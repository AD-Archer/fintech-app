// Configure toastr options
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 3000,
    extendedTimeOut: 1000,
    preventDuplicates: true
};

async function handleLogin(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    // Basic validation
    if (!formData.email || !formData.password) {
        toastr.error('Email and password are required');
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
            // Check if it's a rate limit error
            if (response.status === 429) {
                toastr.error('Too many login attempts. Please try again later.');
                return false;
            }
            
            // Handle other errors
            toastr.error(data.error || 'Login failed');
            return false;
        }
        
        // Show success message
        toastr.success('Login successful! Redirecting...');
        
        // Wait for the toast to be shown before redirecting
        setTimeout(() => {
            window.location.href = data.redirect || '/dashboard';
        }, 1000);
        
    } catch (error) {
        toastr.error('An error occurred during login');
        return false;
    }
}

// Add event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Add this function after the handleLogin function
async function continueAsGuest() {
    try {
        // Initialize guest storage if not exists
        if (!localStorage.getItem('guestTransactions')) {
            localStorage.setItem('guestTransactions', JSON.stringify([]));
        }
        
        console.log('Attempting to get guest token...');
        
        // Get guest token from server
        const response = await fetch('/auth/guest-token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: Date.now() // Add some data to ensure it's a proper POST
            })
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server sent non-JSON response');
        }

        const data = await response.json();
        console.log('Response:', data);

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to initialize guest session');
        }
        
        // Show success message
        toastr.success(data.message || 'Entering guest mode...');
        
        // Wait for the toast to be shown before redirecting
        setTimeout(() => {
            window.location.href = data.redirect || '/dashboard';
        }, 1000);
        
    } catch (error) {
        console.error('Guest mode error:', error);
        toastr.error('Error initializing guest mode: ' + error.message);
    }
}
