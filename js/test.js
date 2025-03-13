function login() {
    const name = document.getElementById('login-name').value;
    const password = document.getElementById('login-password').value;

    // Use URLSearchParams to handle URL encoding
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('password', password);

    // Use the full backend URL
    fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid credentials');
            }
        })
        .then(data => {
            alert('Login successful! Welcome ' + data.name);
            window.location.href = "Home.html";
        })
        .catch(error => {
            alert(error.message);
        });
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Registration failed');
            }
        })
        .then(data => {
            alert('Registration successful! Please login.');
            toggleForm('login');
        })
        .catch(error => {
            alert(error.message);
        });
}