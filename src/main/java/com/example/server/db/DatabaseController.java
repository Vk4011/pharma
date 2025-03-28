package com.example.server.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/db")
public class DatabaseController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public Map<String, String> checkDatabaseConnection() {
        Map<String, String> response = new HashMap<>();
        try {
            jdbcTemplate.execute("SELECT 1");
            response.put("dbname", "postgres");
            response.put("connection", "success");
        } catch (Exception e) {
            response.put("dbname", "postgres");
            response.put("connection", "failed");
        }
        return response;
    }
}
