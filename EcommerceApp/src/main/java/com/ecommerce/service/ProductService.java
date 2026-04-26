package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository,
                          UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // ✅ Add Product
    public Product addProduct(Product product, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        product.setOwner(user);
        return productRepository.save(product);
    }

    // ✅ Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ✅ Get my products
    public List<Product> getMyProducts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return productRepository.findByOwnerId(user.getId());
    }
    
    public Product updateProduct(Long id, Product updatedProduct, String email) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 Ownership OR Admin check
        if (!product.getOwner().getId().equals(user.getId()) &&
            user.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Not allowed");
        }

        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setDescription(updatedProduct.getDescription());

        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id, String email) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!product.getOwner().getId().equals(user.getId()) &&
            user.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Not allowed");
        }

        productRepository.delete(product);
    }
}
