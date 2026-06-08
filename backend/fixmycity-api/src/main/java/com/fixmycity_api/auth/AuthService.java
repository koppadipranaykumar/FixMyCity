package com.fixmycity_api.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fixmycity_api.auth.dto.RegisterRequest;
import com.fixmycity_api.user.User;
import com.fixmycity_api.user.UserRepository;
import com.fixmycity_api.auth.dto.LoginRequest;
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("CITIZEN")
                .build();

        userRepository.save(user);

        return "Registration Successful";
    }
    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "User not found";
        }

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!matches) {
            return "Invalid password";
        }

        return "Login Successful";
    }
}