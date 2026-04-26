package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.service.ProductService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ✅ Add product
    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public Product addProduct(@RequestBody Product product, Principal principal) {
        return productService.addProduct(product, principal.getName());
    }

    // ✅ Get all products (dashboard)
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // ✅ Get my products
    @GetMapping("/my")
    public List<Product> getMyProducts(Principal principal) {
        return productService.getMyProducts(principal.getName());
    }
    
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product,
                                 Principal principal) {
        return productService.updateProduct(id, product, principal.getName());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id,
                              Principal principal) {
        productService.deleteProduct(id, principal.getName());
    }
}