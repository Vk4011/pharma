package com.example.server.controller;

import com.example.server.model.Medicine;
import com.example.server.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineRepository medicineRepository;

    @Autowired
    public MedicineController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // Get all medicines
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        List<Medicine> medicines = medicineRepository.findAll();
        return medicines.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(medicines);
    }

    // Get medicine by ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new medicine
    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        if (medicine.getName() == null || medicine.getName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Medicine newMedicine = medicineRepository.save(medicine);
            return ResponseEntity.status(HttpStatus.CREATED).body(newMedicine);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update medicine
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        return medicineRepository.findById(id)
                .map(existingMedicine -> {
                    existingMedicine.setName(medicine.getName());
                    existingMedicine.setPrecautions(medicine.getPrecautions());
                    existingMedicine.setSuggestedDosage(medicine.getSuggestedDosage());
                    existingMedicine.setBestTimeToTake(medicine.getBestTimeToTake());
                    existingMedicine.setUses(medicine.getUses());

                    medicineRepository.save(existingMedicine);
                    return ResponseEntity.ok(existingMedicine);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Search medicines by name
    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam(required = false) String name) {
        List<Medicine> medicines = (name == null || name.isEmpty())
                ? medicineRepository.findAll()
                : medicineRepository.findByNameContainingIgnoreCase(name);

        return medicines.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(medicines);
    }
}
