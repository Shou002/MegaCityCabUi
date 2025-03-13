async function fetchBookingHistory() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.id) {
            alert('Please log in to view booking history');
            window.location.href = 'index.html';
            return;
        }

        const response = await fetch(`http://localhost:8080/bookings/user/${userData.id}`);
        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error('Error fetching booking history:', error);
        alert('Failed to load booking history. Please try again.');
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function displayBookings(bookings) {
    const tbody = document.getElementById('booking-history-body');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.vehicleName}</td>
            <td>${booking.driverName}</td>
            <td>${booking.pickupLoc}</td>
            <td>${booking.destination}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${booking.rentalTime}</td>
            <td>${booking.distance.toFixed(2)}</td>
            <td>${booking.finalPrice.toFixed(2)}</td>
            <td class="status-${booking.status.toLowerCase()}">${booking.status}</td>
            <td>
                ${booking.status === 'PENDING' ? `
                    <button class="action-button complete-button" onclick="completeBooking(${booking.booId})">Complete</button>
                    <button class="action-button cancel-button" onclick="cancelBooking(${booking.booId})">Cancel</button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function completeBooking(booId) {
    if (!confirm('Are you sure you want to mark this booking as complete?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings/complete/${booId}`, {
            method: 'PUT'
        });

        if (response.ok) {
            alert('Booking marked as complete!');
            fetchBookingHistory();
        } else {
            alert('Failed to complete booking. Please try again.');
        }
    } catch (error) {
        console.error('Error completing booking:', error);
        alert('An error occurred. Please try again.');
    }
}

async function cancelBooking(booId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings/cancel/${booId}`, {
            method: 'PUT'
        });

        if (response.ok) {
            alert('Booking cancelled successfully!');
            fetchBookingHistory();
        } else {
            alert('Failed to cancel booking. Please try again.');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('An error occurred. Please try again.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchBookingHistory();
});