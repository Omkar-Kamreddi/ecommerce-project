package com.ecommerce.config;

import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtFilter;
import com.ecommerce.security.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public SecurityConfig(JwtFilter jwtFilter,
                          JwtUtil jwtUtil,
                          UserRepository userRepository) {
        this.jwtFilter = jwtFilter;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // ✅ enforce admin
                        .anyRequest().authenticated()
                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.getWriter().write("Unauthorized");
                        })
                )

                .oauth2Login(oauth -> oauth
                        .successHandler((request, response, authentication) -> {

                            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

                            String email = oauthUser.getAttribute("email");
                            String name = oauthUser.getAttribute("name");

                            User user = userRepository.findByEmail(email)
                                    .orElseGet(() -> {
                                        User newUser = new User();
                                        newUser.setEmail(email);
                                        newUser.setName(name);
                                        newUser.setRole(Role.ROLE_USER);
                                        return userRepository.save(newUser);
                                    });

                            String token = jwtUtil.generateToken(
                                    user.getEmail(),
                                    user.getRole().name()
                            );

                            response.sendRedirect(
                                    "http://localhost:5173/oauth-success?token=" + token
                            );
                        })
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}