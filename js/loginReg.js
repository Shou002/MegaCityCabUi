document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Check if user is already logged in
    checkLoginStatus();

    // Form switching functions
    const showLoginForm = () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    };

    const showRegisterForm = () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    };

    // Form switching function that can be called from other functions
    window.toggleForm = function(formName) {
        if (formName === 'login') {
            showLoginForm();
        } else if (formName === 'register') {
            showRegisterForm();
        }
    };

    // Event listeners
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
});

// Check if user is already logged in
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        // User is already logged in, redirect to Home
        window.location.href = "Home.html";
    }
}

// Login function to connect with backend
function login() {
    console.log("Login function called");
    const name = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Basic validation
    if (!name || !password) {
        alert("Please fill in all fields");
        return;
    }

    console.log("Attempting to login with:", name);

    // Use URLSearchParams to handle URL encoding
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('password', password);

    try {
        // Use the full backend URL
        fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        })
            .then(response => {
                console.log("Response received:", response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Invalid credentials');
                }
            })
            .then(data => {
                console.log("Login successful:", data);

                // Save user data to local storage
                const userData = {
                    id: data.id, // Add user ID
                    username: data.name || name,
                    role: data.role || 'user',
                    loggedInAt: new Date().toISOString()
                };

                localStorage.setItem('userData', JSON.stringify(userData));
                console.log("User data saved to local storage:", userData);

                // Redirect to home page
                window.location.href = "Home.html";
            })
            .catch(error => {
                console.error("Login error:", error);
                alert(error.message);
            });
    } catch (error) {
        console.error("Exception in login:", error);
        alert("An error occurred during login. Please try again.");
    }
}

// Register function to connect with backend
function register() {
    console.log("Register function called");
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    // Basic validation
    if (!name || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    console.log("Attempting to register with:", name, email);

    try {
        fetch('http://localhost:8080/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
            .then(response => {
                console.log("Response received:", response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Registration failed');
                }
            })
            .then(data => {
                console.log("Registration successful:", data);
                alert('Registration successful! Please login.');
                toggleForm('login');
            })
            .catch(error => {
                console.error("Registration error:", error);
                alert(error.message);
            });
    } catch (error) {
        console.error("Exception in registration:", error);
        alert("An error occurred during registration. Please try again.");
    }
}