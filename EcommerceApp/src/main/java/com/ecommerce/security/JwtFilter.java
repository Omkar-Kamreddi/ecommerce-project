package com.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7);

                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                if (email != null &&
                        role != null &&
                        SecurityContextHolder.getContext().getAuthentication() == null) {

                    // ✅ ensure role format is correct
                    if (!role.startsWith("ROLE_")) {
                        role = "ROLE_" + role;
                    }

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    Collections.singletonList(new SimpleGrantedAuthority(role))
                            );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }

        } catch (JwtException e) {
            System.out.println("Invalid JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}