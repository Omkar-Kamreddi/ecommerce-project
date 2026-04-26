package com.ecommerce.service;


import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Role;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	
	private JwtUtil jwtUtil = null;
	

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User register(RegisterRequest request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 🔐 Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 👤 Default role
        user.setRole(Role.ROLE_USER);

        return userRepository.save(user);
    }
    
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }
    
}