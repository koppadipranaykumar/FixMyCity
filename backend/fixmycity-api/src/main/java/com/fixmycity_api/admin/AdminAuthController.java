package com.fixmycity_api.admin;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    @PostMapping("/login")
    public String login(
            @RequestBody
            AdminLoginRequest request
    ) {

        if (
            request.getEmail().equals(
                    "admin@fixmycity.com"
            )
            &&
            request.getPassword().equals(
                    "admin123"
            )
        ) {

            return "Admin Login Successful";
        }

        return "Invalid Credentials";
    }
}