document.addEventListener('DOMContentLoaded', () => {
    // Check if user data is in localStorage
    const userData = localStorage.getItem('userData');

    if (!userData) {
        window.location.href = "index.html";
        return;
    }

    // Parse user data
    const user = JSON.parse(userData);


    document.getElementById('user-name').textContent = user.username;
    document.getElementById('welcome-user-name').textContent = user.username;
    document.getElementById('user-role').textContent = user.role;


    if (user.role === 'admin' || user.role === 'staff') {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.classList.remove('hidden');
        });


        if (user.role !== 'admin') {
            const staffManagementElements = document.querySelectorAll('.staff-management');
            staffManagementElements.forEach(element => {
                element.classList.add('hidden');
            });
        }

        fetchAdminStatistics();
    }


    document.getElementById('logout-button').addEventListener('click', logout);
});


async function fetchAdminStatistics() {
    try {
        const [users, drivers, vehicles, bookings] = await Promise.all([
            fetch('http://localhost:8080/admin/users').then(res => res.json()),
            fetch('http://localhost:8080/admin/drivers').then(res => res.json()),
            fetch('http://localhost:8080/admin/vehicles').then(res => res.json()),
            fetch('http://localhost:8080/admin/bookings').then(res => res.json())
        ]);

        document.getElementById('active-drivers-count').textContent = drivers.length;
        document.getElementById('total-bookings-count').textContent = bookings.length;
        document.getElementById('available-vehicles-count').textContent = vehicles.length;
    } catch (error) {
        console.error('Error fetching admin statistics:', error);
    }
}

// Logout function
function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('userData');

    window.location.href = "index.html";
}