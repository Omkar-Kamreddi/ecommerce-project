package com.ecommerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public AdminController(UserRepository userRepository,
                           ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ✅ Admin stats
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        return stats;
    }

    // ✅ Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Delete user
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ ONLY block ADMIN role (not email!)
        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new RuntimeException("Cannot delete admin");
        }

        userRepository.delete(user);
        return "User deleted successfully";
    }
}