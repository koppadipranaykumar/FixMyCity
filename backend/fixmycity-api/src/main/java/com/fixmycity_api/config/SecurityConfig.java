package com.fixmycity_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS configuration defined below
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Disable CSRF (essential for stateless REST APIs)
            .csrf(csrf -> csrf.disable())
            
            // 3. Define authorization rules
            .authorizeHttpRequests(auth -> auth
                // Explicitly allow preflight OPTIONS requests used by browsers during CORS checks
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Permit all endpoints under /api/auth/
                .requestMatchers("/api/auth/**").permitAll()
                // Permit any other requests for debugging (restrict this later if needed)
                .anyRequest().permitAll()
            )
            
            // 4. Disable form login as you are using a decoupled frontend
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allows requests from any origin (ideal for Replit's dynamic URLs)
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 
        
        // Allows common HTTP methods used by your React frontends
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Required headers for typical JSON API operations and authentication tokens
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        
        // Allows browser clients to send credentials (like cookies or auth headers) if needed
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this exact configuration to all paths in the backend API
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}