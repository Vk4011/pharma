
        // Global variable to store medicines data
        let medicinesData = [];
        
        // Fetch all medicines when page loads
        document.addEventListener('DOMContentLoaded', function() {
            fetchMedicinesForDropdown();
        });

        // Function to fetch medicines for dropdown
        async function fetchMedicinesForDropdown() {
            try {
                const response = await fetch('http://localhost:9090/api/medicines');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                medicinesData = await response.json();
                populateDropdown(medicinesData);
            } catch (error) {
                console.error('Error fetching medicines:', error);
                document.getElementById('medicineDetails').innerHTML = 
                    '<p>Error loading medicine data. Please try again later.</p>';
            }
        }

        // Populate dropdown with medicine names
        function populateDropdown(medicines) {
            const dropdown = document.getElementById('medicineDropdown');
            dropdown.innerHTML = '<option value="" disabled selected>Select a medicine</option>';
            
            medicines.forEach(medicine => {
                const option = document.createElement('option');
                option.value = medicine.id;
                option.textContent = medicine.name;
                dropdown.appendChild(option);
            });
        }

        // Fetch details for selected medicine
        function fetchMedicineInfo() {
            const dropdown = document.getElementById('medicineDropdown');
            const selectedId = dropdown.value;
            
            if (!selectedId) {
                alert('Please select a medicine first');
                return;
            }
            
            const selectedMedicine = medicinesData.find(med => med.id == selectedId);
            displayMedicineDetails(selectedMedicine);
        }

        // Display medicine details
        function displayMedicineDetails(medicine) {
            const detailsDiv = document.getElementById('medicineDetails');
            detailsDiv.innerHTML = `
                <h3>${medicine.name}</h3>
                <div class="medicine-detail"><strong>ID:</strong> ${medicine.id}</div>
                <div class="medicine-detail"><strong>Precautions:</strong> ${medicine.precautions}</div>
                <div class="medicine-detail"><strong>Suggested Dosage:</strong> ${medicine.suggestedDosage}</div>
                <div class="medicine-detail"><strong>Best Time to Take:</strong> ${medicine.bestTimeToTake}</div>
                <div class="medicine-detail"><strong>Uses:</strong> ${medicine.uses}</div>
            `;
            
            // Hide all medicines display if it's visible
            document.getElementById('allMedicines').style.display = 'none';
            detailsDiv.style.display = 'block';
        }

        // Fetch and display all medicines
        async function fetchAllMedicines() {
            try {
                const response = await fetch('http://localhost:9090/api/medicines');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const medicines = await response.json();
                displayAllMedicines(medicines);
            } catch (error) {
                console.error('Error fetching all medicines:', error);
                document.getElementById('allMedicines').innerHTML = 
                    '<p>Error loading medicine data. Please try again later.</p>';
            }
        }

        // Display all medicines in a table
        function displayAllMedicines(medicines) {
            const allMedicinesDiv = document.getElementById('allMedicines');
            allMedicinesDiv.innerHTML = `
                <h3>All Medicines</h3>
                <table border="1" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Precautions</th>
                            <th>Dosage</th>
                            <th>Best Time</th>
                            <th>Uses</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${medicines.map(medicine => `
                            <tr>
                                <td>${medicine.id}</td>
                                <td>${medicine.name}</td>
                                <td>${medicine.precautions}</td>
                                <td>${medicine.suggestedDosage}</td>
                                <td>${medicine.bestTimeToTake}</td>
                                <td>${medicine.uses}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            
            // Hide single medicine display if it's visible
            document.getElementById('medicineDetails').style.display = 'none';
            allMedicinesDiv.style.display = 'block';
        }

        function clearPageStack() {
            setTimeout(() => {
                window.history.pushState(null, null, window.location.href);
                window.onpopstate = function () {
                    window.history.pushState(null, null, window.location.href);
                };
            }, 0);
        }
        
        window.onload = clearPageStack;
   