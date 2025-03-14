document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('admin-form');
    const tableBody = document.getElementById('admin-table-body');

    // Load drivers and vehicles
    fetchDriversAndVehicles();

    // Handle submission
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Add the driver
        const driverData = new URLSearchParams();
        driverData.append('name', document.getElementById('driver-name').value);
        driverData.append('age', document.getElementById('driver-age').value);
        driverData.append('address', document.getElementById('driver-address').value);
        driverData.append('pn', document.getElementById('driver-phone').value);

        try {
            const driverResponse = await fetch('http://localhost:8080/drivers/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: driverData
            });

            if (!driverResponse.ok) {
                throw new Error('Failed to add driver');
            }

            const driverResult = await driverResponse.json();
            const driverId = driverResult.driverId;

            // Add the vehicle with the driver ID
            const vehicleData = new URLSearchParams();
            vehicleData.append('veh_name', document.getElementById('vehicle-name').value);
            vehicleData.append('type', document.getElementById('vehicle-type').value);
            vehicleData.append('capacity', document.getElementById('vehicle-capacity').value);
            vehicleData.append('price', document.getElementById('vehicle-price').value);
            vehicleData.append('driverId', driverId);

            const vehicleResponse = await fetch('http://localhost:8080/vehicles/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: vehicleData
            });

            if (!vehicleResponse.ok) {
                throw new Error('Failed to add vehicle');
            }

            alert('Driver and vehicle added successfully!');
            adminForm.reset();
            fetchDriversAndVehicles();

        } catch (error) {
            console.error('Error adding driver and vehicle:', error);
            alert(error.message || 'An error occurred. Please try again.');
        }
    });
});

async function fetchDrivers() {
    try {
        const response = await fetch('http://localhost:8080/admin/drivers');
        const data = await response.json();
        console.log('Fetched drivers data:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return [];
    }
}

async function fetchVehicles() {
    try {
        const response = await fetch('http://localhost:8080/admin/vehicles');
        return await response.json();
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return [];
    }
}

async function fetchDriversAndVehicles() {
    try {
        const [drivers, vehicles] = await Promise.all([
            fetchDrivers(),
            fetchVehicles()
        ]);

        // Create a map of drivers by their ID for easier lookup
        const driversMap = new Map();
        drivers.forEach(driver => {
            driversMap.set(driver.driverId, {
                name: driver.name,
                age: driver.age,
                phone: driver.phone || 'N/A',
                driverId: driver.driverId
            });
        });

        // Match vehicles with their drivers
        const combinedData = vehicles.map(vehicle => {
            const driver = driversMap.get(vehicle.driverId) || { name: 'N/A', age: 'N/A', phone: 'N/A' };
            return {
                driver: driver,
                vehicle: vehicle
            };
        });

        displayDriversAndVehicles(combinedData);
    } catch (error) {
        console.error('Error fetching drivers and vehicles:', error);
    }
}

function displayDriversAndVehicles(data) {
    const tableBody = document.getElementById('admin-table-body');
    tableBody.innerHTML = '';

    console.log('Data received in displayDriversAndVehicles:', data);

    data.forEach(item => {
        const vehicle = item.vehicle;
        const driver = vehicle.driver || { name: 'N/A', age: 'N/A', pn: 'N/A' };
        console.log('Processing item:', { driver, vehicle });
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${driver.name || 'N/A'}</td>
            <td>${driver.age || 'N/A'}</td>
            <td>${driver.pn || 'N/A'}</td>
            <td>${vehicle.veh_name}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.capacity}</td>
            <td>${vehicle.price.toFixed(2)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

async function editDriverVehicle(driverId) {
    console.log('Edit driver/vehicle with ID:', driverId);
}
