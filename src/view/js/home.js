
        // Global variables
        let allMedicines = [];
        let filteredMedicines = [];
        const apiBaseUrl = 'http://localhost:9090/api/medicines';

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            fetchMedicines();
        });

        // Fetch all medicines from API
        async function fetchMedicines() {
            try {
                const response = await fetch(apiBaseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch medicines');
                }
                allMedicines = await response.json();
                populateMedicineDropdown(allMedicines);
                populateStoreFilter(allMedicines);
                displayMedicines(allMedicines);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('medicineResults').innerHTML = 
                    '<div class="error">Error loading medicine data. Please try again later.</div>';
            }
        }

        // Populate medicine dropdown
        function populateMedicineDropdown(medicines) {
            const dropdown = document.getElementById('medicineDropdown');
            dropdown.innerHTML = '<option value="" disabled selected>Select a medicine</option>';
            
            medicines.forEach(medicine => {
                const option = document.createElement('option');
                option.value = medicine.id;
                option.textContent = medicine.name;
                dropdown.appendChild(option);
            });
        }

        // Populate store filter dropdown
        function populateStoreFilter(medicines) {
            const storeFilter = document.getElementById('storeFilter');
            const stores = [...new Set(medicines.map(med => med.store || 'Unknown'))]; // Assuming there's a store property
            
            stores.forEach(store => {
                const option = document.createElement('option');
                option.value = store;
                option.textContent = store;
                storeFilter.appendChild(option);
            });
        }

        // Search for specific medicine
        function searchMedicine() {
            const dropdown = document.getElementById('medicineDropdown');
            const selectedId = dropdown.value;
            
            if (!selectedId) {
                alert('Please select a medicine first');
                return;
            }
            
            const selectedMedicine = allMedicines.find(med => med.id == selectedId);
            if (selectedMedicine) {
                displayMedicines([selectedMedicine]);
            }
        }

        // Apply filters and sorting
        function applyFilters() {
            const storeFilter = document.getElementById('storeFilter').value;
            const sortDirection = document.getElementById('sortPrice').value;
            
            // Filter by store
            filteredMedicines = storeFilter 
                ? allMedicines.filter(med => med.store === storeFilter) 
                : [...allMedicines];
            
            // Sort by price (assuming there's a price property)
            filteredMedicines.sort((a, b) => {
                const priceA = a.price || 0;
                const priceB = b.price || 0;
                return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
            });
            
            displayMedicines(filteredMedicines);
        }

        // Display medicines in results
        function displayMedicines(medicines) {
            const resultsDiv = document.getElementById('medicineResults');
            
            if (medicines.length === 0) {
                resultsDiv.innerHTML = '<div class="no-results">No medicines found matching your criteria.</div>';
                return;
            }
            
            resultsDiv.innerHTML = medicines.map(medicine => `
                <div class="medicine-card">
                    <h3>${medicine.name}</h3>
                    <div class="medicine-detail"><strong>ID:</strong> ${medicine.id}</div>
                    <div class="medicine-detail"><strong>Precautions:</strong> ${medicine.precautions}</div>
                    <div class="medicine-detail"><strong>Dosage:</strong> ${medicine.suggestedDosage}</div>
                    <div class="medicine-detail"><strong>Best Time:</strong> ${medicine.bestTimeToTake}</div>
                    <div class="medicine-detail"><strong>Uses:</strong> ${medicine.uses}</div>
                    ${medicine.price ? `<div class="medicine-detail"><strong>Price:</strong> $${medicine.price.toFixed(2)}</div>` : ''}
                    ${medicine.store ? `<div class="medicine-detail"><strong>Store:</strong> ${medicine.store}</div>` : ''}
                </div>
            `).join('');
        }

        // Logout function (placeholder)
        function logoutUser() {
            // Implement your logout logic here
            console.log('User logged out');
            window.location.href = 'login.html';
        }
   