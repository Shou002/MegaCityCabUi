const bookingForm = document.getElementById('booking-form');
const vehicleNameSelect = document.getElementById('vehicle-name');
const rentalTimeInput = document.getElementById('rental-time');
const distanceField = document.getElementById('distance');
const finalPriceField = document.getElementById('final-price');

let selectedVehiclePrice = 0;
const AVERAGE_SPEED = 60; // km/h

async function fetchVehicles() {
    try {
        const response = await fetch('http://localhost:8080/vehicles/available');
        const vehicles = await response.json();
        console.log('Fetched vehicles data:', vehicles);
        localStorage.setItem('vehiclesData', JSON.stringify(vehicles));
        updateVehicleOptions(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
    }
}

function updateVehicleOptions(vehicles) {
    vehicleNameSelect.innerHTML = '<option value="">Select a vehicle</option>';
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.vehId || '';
        option.textContent = `${vehicle.veh_name} (${vehicle.type} - Capacity: ${vehicle.capacity})`;
        option.dataset.price = vehicle.price || 0;
        option.dataset.driverId = vehicle.driver.driverId || '';
        vehicleNameSelect.appendChild(option);
    });
}

function calculateDistanceAndPrice() {
    const rentalTime = parseFloat(rentalTimeInput.value) || 0;
    const estimatedDistance = rentalTime * AVERAGE_SPEED;
    distanceField.value = estimatedDistance.toFixed(2);

    const finalPrice = estimatedDistance * selectedVehiclePrice;
    finalPriceField.value = finalPrice.toFixed(2);
}

vehicleNameSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    selectedVehiclePrice = parseFloat(selectedOption.dataset.price) || 0;
    calculateDistanceAndPrice();
});

rentalTimeInput.addEventListener('input', calculateDistanceAndPrice);

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate vehicle selection
    if (!vehicleNameSelect.value) {
        alert('Please select a vehicle');
        return;
    }

    const selectedOption = vehicleNameSelect.options[vehicleNameSelect.selectedIndex];
    console.log('Selected option:', selectedOption);
    console.log('Selected option value:', selectedOption.value);
    console.log('Selected option dataset:', selectedOption.dataset);
    
    const vehicleId = parseInt(vehicleNameSelect.value);
    const driverId = parseInt(selectedOption.dataset.driverId);

    console.log('Parsed vehicleId:', vehicleId);
    console.log('Parsed driverId:', driverId);


    if (isNaN(vehicleId) || isNaN(driverId)) {
        alert('Invalid vehicle or driver data. Please try selecting the vehicle again.');
        return;
    }


    const pickupLocation = document.getElementById('pickup-location').value.trim();
    if (!pickupLocation) {
        alert('Please enter a pickup location');
        return;
    }

    const formData = {
        userId: JSON.parse(localStorage.getItem('userData')).id || 1,
        vehicleId: vehicleId,
        driverId: driverId,
        pickupLoc: pickupLocation,
        destination: document.getElementById('destination').value.trim(),
        date: new Date(document.getElementById('pickup-time').value).toISOString(),
        rentalTime: parseFloat(rentalTimeInput.value),
        distance: parseFloat(distanceField.value),
        finalPrice: parseFloat(finalPriceField.value),
        status: 'PENDING'
    };

    console.log('Sending booking data:', formData);

    try {
        const response = await fetch('http://localhost:8080/bookings/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            localStorage.removeItem('vehiclesData');
            alert('Booking successful!');
            bookingForm.reset();
        } else {
            alert('Failed to create booking. Please try again.');
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('An error occurred. Please try again.');
    }
});

fetchVehicles();