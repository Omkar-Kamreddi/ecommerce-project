package com.ecommerce.controller;


import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.entity.User;
import com.ecommerce.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }
    
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}
