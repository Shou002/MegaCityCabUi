document.addEventListener('DOMContentLoaded', () => {
    const staffForm = document.getElementById('staff-form');
    const tableBody = document.getElementById('staff-table-body');

    // Load existing staff members
    fetchStaffMembers();

    staffForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('staff-name').value,
            email: document.getElementById('staff-email').value,
            password: document.getElementById('staff-password').value
        };

        try {
            const response = await fetch('http://localhost:8080/users/addStaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData)
            });

            if (response.ok) {
                alert('Staff member added successfully!');
                staffForm.reset();
                fetchStaffMembers();
            } else {
                alert('Failed to add staff member. Please try again.');
            }
        } catch (error) {
            console.error('Error adding staff member:', error);
            alert('An error occurred. Please try again.');
        }
    });
});

async function fetchStaffMembers() {
    try {
        const response = await fetch('http://localhost:8080/admin/users');
        const data = await response.json();
        // Filter users with staff role
        const staffMembers = data.filter(user => user.role === 'staff');
        displayStaffMembers(staffMembers);
    } catch (error) {
        console.error('Error fetching staff members:', error);
    }
}

function displayStaffMembers(data) {
    const tableBody = document.getElementById('staff-table-body');
    tableBody.innerHTML = '';

    data.forEach(staff => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${staff.name}</td>
            <td>${staff.email}</td>
            <td>${staff.role}</td>
        `;
        tableBody.appendChild(tr);
    });
}