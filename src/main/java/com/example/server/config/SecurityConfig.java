// package com.example.server.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {
    
//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers(
//                     "/",               // Root endpoint
//                     "/db",             // Database console
//                     "/db/**",          // All DB console paths
//                     "/api/auth/**",    // Authentication endpoints
//                     "/h2-console/**" ,  // H2 console (if using)
//                     "/medicine"
//                 ).permitAll()          // Allow public access to these endpoints
//                 .anyRequest().authenticated()  // Secure all other endpoints
//             )
//             .headers(headers -> headers
//                 .frameOptions().disable()  // Needed for H2 console
//             );
        
//         return http.build();
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }


package com.example.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for API endpoints
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/db/**", "/api/auth/**", "/h2-console/**", "/api/medicines").permitAll()
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(options -> options.disable())); // Fix deprecated frameOptions
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
